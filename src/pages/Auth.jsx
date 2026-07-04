import React, { useState } from 'react';

const ACCENT_COLOR = '#007bff';
const SECONDARY_TEXT = '#999';
const ERROR_COLOR = '#dc3545';
const SUCCESS_COLOR = '#28a745';

// Phone to user mapping for demo
const PHONE_TO_USER = {
  '9876543210': { id: 'p1', name: 'John Smith', department: 'Operations' },
  '9876543211': { id: 'p2', name: 'Sarah Johnson', department: 'Quality' },
  '9876543212': { id: 'p3', name: 'Mike Chen', department: 'Safety' },
  '9876543213': { id: 'p4', name: 'Lisa Davis', department: 'HR' }
};

function Auth({ onLoginSuccess }) {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [otpExpiry, setOtpExpiry] = useState(null);

  const handlePhoneSubmit = () => {
    setError('');

    // Validate phone number
    if (!phoneNumber.trim()) {
      setError('Please enter a phone number');
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = PHONE_TO_USER[phoneNumber];

      if (user) {
        // Known user
        const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedOtp(newOtp);
        setUserInfo(user);
        setStep('otp');
        setOtp('');

        // Set OTP expiry to 5 minutes
        setOtpExpiry(Date.now() + 5 * 60 * 1000);

        // Log OTP for demo (in real app, this would be sent via SMS)
        console.log(`OTP sent to ${phoneNumber}: ${newOtp}`);
      } else {
        setError('Phone number not registered. Please use a valid number from the demo.');
      }

      setLoading(false);
    }, 1000);
  };

  const handleOtpSubmit = () => {
    setError('');

    // Check OTP expiry
    if (Date.now() > otpExpiry) {
      setError('OTP expired. Please request a new one.');
      return;
    }

    // Validate OTP
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    if (otp.length !== 4) {
      setError('OTP must be 4 digits');
      return;
    }

    if (otp !== generatedOtp) {
      setError('Incorrect OTP. Please try again.');
      return;
    }

    // Success
    setLoading(true);
    setTimeout(() => {
      onLoginSuccess(userInfo.id, phoneNumber);
      setLoading(false);
    }, 500);
  };

  const handleResendOtp = () => {
    setError('');
    setLoading(true);

    setTimeout(() => {
      const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedOtp(newOtp);
      setOtp('');
      setOtpExpiry(Date.now() + 5 * 60 * 1000);
      console.log(`OTP resent to ${phoneNumber}: ${newOtp}`);
      setLoading(false);
    }, 1000);
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setPhoneNumber('');
    setOtp('');
    setError('');
    setGeneratedOtp('');
    setUserInfo(null);
  };

  const timeRemaining =
    otpExpiry && Math.max(0, Math.ceil((otpExpiry - Date.now()) / 1000));

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '40px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700' }}>
            Cow
            <span style={{ color: ACCENT_COLOR }}>It</span>
          </h1>
          <p style={{ margin: 0, fontSize: '12px', color: SECONDARY_TEXT }}>
            Commit & Own It
          </p>
        </div>

        {step === 'phone' && (
          <>
            <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: '600' }}>
              Register & Login
            </h2>

            {/* Demo Info */}
            <div
              style={{
                padding: '12px',
                backgroundColor: '#f0f7ff',
                borderRadius: '4px',
                marginBottom: '20px',
                fontSize: '12px',
                color: SECONDARY_TEXT
              }}
            >
              <strong>Demo phone numbers:</strong>
              <div style={{ marginTop: '8px' }}>
                • 9876543210 (John Smith)<br />
                • 9876543211 (Sarah Johnson)<br />
                • 9876543212 (Mike Chen)<br />
                • 9876543213 (Lisa Davis)
              </div>
            </div>

            {/* Phone Input */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                Mobile Number
              </label>
              <input
                type="tel"
                maxLength="10"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="10-digit mobile number"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: `1px solid ${error ? ERROR_COLOR : '#ddd'}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#f8d7da',
                  color: ERROR_COLOR,
                  borderRadius: '4px',
                  fontSize: '12px',
                  marginBottom: '16px'
                }}
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handlePhoneSubmit}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: loading ? '#ccc' : ACCENT_COLOR,
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '16px'
              }}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </>
        )}

        {step === 'otp' && (
          <>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '600' }}>
              Verify OTP
            </h2>
            <p
              style={{
                margin: '0 0 24px 0',
                fontSize: '13px',
                color: SECONDARY_TEXT
              }}
            >
              A 4-digit OTP has been sent to {phoneNumber}
            </p>

            {/* User Info */}
            {userInfo && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#f0f7ff',
                  borderRadius: '4px',
                  marginBottom: '20px',
                  fontSize: '12px'
                }}
              >
                <strong style={{ color: '#333' }}>{userInfo.name}</strong>
                <div style={{ color: SECONDARY_TEXT }}>{userInfo.department}</div>
              </div>
            )}

            {/* OTP Input */}
            <div style={{ marginBottom: '16px' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '8px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                Enter OTP
              </label>
              <input
                type="text"
                maxLength="4"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="0000"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '24px',
                  textAlign: 'center',
                  letterSpacing: '8px',
                  border: `1px solid ${error ? ERROR_COLOR : '#ddd'}`,
                  borderRadius: '4px',
                  boxSizing: 'border-box'
                }}
              />
              <div
                style={{
                  marginTop: '8px',
                  fontSize: '12px',
                  color: timeRemaining < 60 ? ERROR_COLOR : SECONDARY_TEXT
                }}
              >
                Expires in: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60)
                  .toString()
                  .padStart(2, '0')}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  padding: '12px',
                  backgroundColor: '#f8d7da',
                  color: ERROR_COLOR,
                  borderRadius: '4px',
                  fontSize: '12px',
                  marginBottom: '16px'
                }}
              >
                {error}
              </div>
            )}

            {/* Verify Button */}
            <button
              onClick={handleOtpSubmit}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: loading ? '#ccc' : ACCENT_COLOR,
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '12px'
              }}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            {/* Resend OTP */}
            <button
              onClick={handleResendOtp}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'transparent',
                color: ACCENT_COLOR,
                border: `1px solid ${ACCENT_COLOR}`,
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                marginBottom: '16px'
              }}
            >
              Resend OTP
            </button>

            {/* Back Button */}
            <button
              onClick={handleBackToPhone}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'transparent',
                color: SECONDARY_TEXT,
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: '500'
              }}
            >
              Use different number
            </button>

            {/* Debug Info */}
            <div
              style={{
                marginTop: '20px',
                padding: '12px',
                backgroundColor: '#fff9e6',
                borderRadius: '4px',
                fontSize: '11px',
                color: '#666'
              }}
            >
              <strong>Demo OTP:</strong> {generatedOtp}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Auth;
