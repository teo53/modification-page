import React from 'react';
import { Calendar } from 'lucide-react';

interface DatePickerProps {
    value: Date;
    onChange: (date: Date) => void;
    minDate?: Date;
    disabled?: boolean;
    label?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
    value,
    onChange,
    minDate = new Date(),
    disabled = false,
    label
}) => {
    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(e.target.value);
        onChange(newDate);
    };

    return (
        <div className="space-y-2">
            {label && (
                <label className="text-sm text-text-muted">{label}</label>
            )}
            <div className="relative">
                <input
                    type="date"
                    value={formatDate(value)}
                    onChange={handleChange}
                    min={formatDate(minDate)}
                    disabled={disabled}
                    className="w-full bg-background border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white focus:border-primary outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                    size={18}
                />
            </div>
        </div>
    );
};

export default DatePicker;
