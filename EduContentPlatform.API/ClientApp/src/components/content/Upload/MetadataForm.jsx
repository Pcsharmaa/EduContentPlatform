import React, { useState } from 'react';
import './upload.css';

const UploadWizard = ({ 
  steps = [],
  initialStep = 0,
  onComplete,
  onCancel,
  showProgress = true,
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [stepData, setStepData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    const currentStepData = steps[currentStep];
    
    // Validate current step if validator is provided
    if (currentStepData.validate) {
      const validation = currentStepData.validate(stepData[currentStepData.id]);
      if (!validation.isValid) {
        setErrors(prev => ({ ...prev, [currentStepData.id]: validation.errors }));
        return;
      }
    }
    
    // Clear errors for this step
    setErrors(prev => ({ ...prev, [currentStepData.id]: undefined }));
    
    // Move to next step or complete
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    
    try {
      if (onComplete) {
        await onComplete(stepData);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStepData = (stepId, data) => {
    setStepData(prev => ({
      ...prev,
      [stepId]: { ...prev[stepId], ...data },
    }));
  };

  const getProgressPercentage = () => {
    return ((currentStep + 1) / steps.length) * 100;
  };

  const currentStepComponent = steps[currentStep]?.component;
  const currentStepData = stepData[steps[currentStep]?.id] || {};

  return (
    <div className="upload-wizard">
      {/* Progress Bar */}
      {showProgress && steps.length > 1 && (
        <div className="wizard-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          
          <div className="progress-steps">
            {steps.map((step, index) => (
              <div 
                key={step.id} 
                className={`progress-step ${index <= currentStep ? 'completed' : ''} ${index === currentStep ? 'current' : ''}`}
              >
                <div className="step-number">{index + 1}</div>
                <div className="step-label">{step.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Step Content */}
      <div className="wizard-content">
        {currentStepComponent && React.createElement(currentStepComponent, {
          data: currentStepData,
          updateData: (data) => updateStepData(steps[currentStep].id, data),
          errors: errors[steps[currentStep].id] || [],
          isSubmitting,
        })}
      </div>

      {/* Navigation */}
      <div className="wizard-navigation">
        <div className="navigation-left">
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="nav-button prev-button"
              disabled={isSubmitting}
            >
              Previous
            </button>
          )}
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="nav-button cancel-button"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
        </div>

        <div className="navigation-right">
          <button
            type="button"
            onClick={handleNext}
            className="nav-button next-button"
            disabled={isSubmitting}
          >
            {currentStep < steps.length - 1 ? 'Next' : 'Complete'}
            {isSubmitting && (
              <span className="button-spinner"></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadWizard;