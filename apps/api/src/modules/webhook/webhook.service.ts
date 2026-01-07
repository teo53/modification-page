// =============================================================================
// 📁 src/modules/webhook/webhook.service.ts
// 🏷️  Webhook Service
// =============================================================================

import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, catchError, of } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class WebhookService {
    private readonly logger = new Logger(WebhookService.name);
    private readonly n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    constructor(private readonly httpService: HttpService) {}

    /**
     * Send a webhook event to n8n
     * 
     * @param eventName - The name of the event (e.g., 'user.signup', 'ad.created')
     * @param data - The payload data specific to the event
     */
    async sendWebhook(eventName: string, data: any): Promise<void> {
        if (!this.n8nWebhookUrl) {
            this.logger.warn(`Skipping webhook for event '${eventName}': N8N_WEBHOOK_URL is not configured.`);
            return;
        }

        const payload = {
            event: eventName,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development',
            data,
        };

        this.logger.log(`Sending webhook '${eventName}' to n8n...`);

        // Fire-and-forget: we don't await the result to block the main thread, 
        // but we subscribe to handle errors purely for logging.
        this.httpService.post(this.n8nWebhookUrl, payload)
            .pipe(
                catchError((error: AxiosError) => {
                    this.logger.error(
                        `Failed to send webhook '${eventName}': ${error.message}`,
                        error.response?.data,
                    );
                    return of(null); // Return observable to complete the stream
                }),
            )
            .subscribe({
                next: () => {
                    this.logger.log(`Webhook '${eventName}' sent successfully.`);
                },
            });
    }
}
