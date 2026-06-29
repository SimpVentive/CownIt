import React, { useState } from 'react';
import { ChevronRight, CheckCircle, Zap, TrendingUp, MessageSquare } from 'lucide-react';

const ACCENT_COLOR = '#007bff';
const SECONDARY_TEXT = '#999';

const ONBOARDING_STEPS = [
  {
    icon: CheckCircle,
    title: 'Log Your Commits',
    description: 'Record your daily work achievements across Self, Team, and Organization levels'
  },
  {
    icon: Zap,
    title: 'Track Your Impact',
    description: 'Measure your impact across Cost, Productivity, Quality, Safety, Delivery, and People'
  },
  {
    icon: TrendingUp,
    title: 'Build Your Profile',
    description: 'Watch your health score grow as you log achievements and updates'
  },
  {
    icon: MessageSquare,
    title: 'Stay Connected',
    description: 'Receive insights and messages from your HR and leadership team'
  }
];

function Onboarding({ userName, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(true);

  if (!showOnboarding) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const Icon = step.icon;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        animation: 'fadeIn 0.3s ease-out'
      }}
      onClick={() => {
        if (currentStep === ONBOARDING_STEPS.length - 1) {
          setShowOnboarding(false);
          onComplete();
        }
      }}
    >
      <div
        style={{
          width: '90%',
          maxWidth: '400px',
          padding: '40px 24px',
          backgroundColor: '#fff',
          borderRadius: '12px',
          textAlign: 'center',
          animation: 'slideInUp 0.4s ease-out'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Welcome Message (first step) */}
        {currentStep === 0 && (
          <>
            <h1 style={{ margin: '0 0 12px 0', fontSize: '28px', fontWeight: '700' }}>
              Welcome, {userName.split(' ')[0]}! 👋
            </h1>
            <p style={{ margin: '0 0 32px 0', fontSize: '14px', color: SECONDARY_TEXT }}>
              Let's get you started with CownIt
            </p>
          </>
        )}

        {/* Step Content */}
        <div
          style={{
            marginBottom: '32px',
            animation: 'scale-in 0.3s ease-out'
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 24px',
              backgroundColor: '#f0f7ff',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon size={40} color={ACCENT_COLOR} />
          </div>

          <h2 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: '600' }}>
            {step.title}
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: SECONDARY_TEXT, lineHeight: '1.6' }}>
            {step.description}
          </p>
        </div>

        {/* Progress Dots */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            justifyContent: 'center',
            marginBottom: '32px'
          }}
        >
          {ONBOARDING_STEPS.map((_, idx) => (
            <div
              key={idx}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor:
                  idx === currentStep ? ACCENT_COLOR : idx < currentStep ? ACCENT_COLOR : '#ddd',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#f5f5f5',
                color: '#333',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Back
            </button>
          )}

          {currentStep === ONBOARDING_STEPS.length - 1 ? (
            <button
              onClick={() => {
                setShowOnboarding(false);
                onComplete();
              }}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: ACCENT_COLOR,
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Get Started
              <ChevronRight size={18} />
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setShowOnboarding(false);
                  onComplete();
                }}
                style={{
                  flex: 0.8,
                  padding: '12px',
                  backgroundColor: 'transparent',
                  color: SECONDARY_TEXT,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                Skip
              </button>
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: ACCENT_COLOR,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                Next
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Onboarding;
