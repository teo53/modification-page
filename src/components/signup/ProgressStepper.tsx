import React from 'react';
import { Check } from 'lucide-react';

interface ProgressStepperProps {
    currentStep: number;
    totalSteps: number;
    steps: string[];
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep, totalSteps, steps }) => {
    return (
        <div className="mb-8">
            <div className="flex items-center justify-between relative">
                {/* Progress Bar */}
                <div className="absolute top-5 left-0 w-full h-1 bg-border -z-10" />
                <div
                    className="absolute top-5 left-0 h-1 bg-primary transition-all duration-500 -z-10"
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                />

                {/* Steps */}
                {steps.map((label, index) => {
                    const stepNum = index + 1;
                    const isComplete = stepNum < currentStep;
                    const isCurrent = stepNum === currentStep;

                    return (
                        <div key={stepNum} className="flex flex-col items-center gap-2 bg-background px-2">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${isComplete
                                        ? 'border-primary bg-primary text-white'
                                        : isCurrent
                                            ? 'border-primary bg-primary/20 text-primary'
                                            : 'border-border bg-background text-text-muted'
                                    }`}
                            >
                                {isComplete ? <Check size={20} /> : stepNum}
                            </div>
                            <span className={`text-xs text-center ${isCurrent ? 'text-text-main font-bold' : 'text-text-muted'}`}>
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressStepper;
