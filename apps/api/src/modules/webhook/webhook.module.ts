// =============================================================================
// 📁 src/modules/webhook/webhook.module.ts
// 🏷️  Webhook Module
// =============================================================================

import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WebhookService } from './webhook.service';

@Global() // Make it global so we don't need to import it in every module
@Module({
    imports: [HttpModule],
    providers: [WebhookService],
    exports: [WebhookService],
})
export class WebhookModule { }
