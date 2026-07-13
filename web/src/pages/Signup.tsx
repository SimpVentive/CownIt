import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import * as api from "@/lib/api";

const NAVY = "#0B1F3A";
const GREEN = "#2E7D32";

interface SignupProps {
  onSignupSuccess: () => void;
  onBackToLogin: () => void;
}

function Signup({ onSignupSuccess, onBackToLogin }: SignupProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const canSubmit = name.length > 0 && email.length > 0 && password.length > 0 && confirmPassword.length > 0;

  const handleSignup = async () => {
    setError("");

    if (!name) {
      setError("Enter your name");
      return;
    }
    if (!email) {
      setError("Enter email address");
      return;
    }
    if (!password) {
      setError("Enter password");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      await api.signup(name, email, password);
      onSignupSuccess();
    } catch (err) {
      setError((err as Error).message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      {/* Decorative background curves */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <path d="M100 0 L100 25 Q72 8 55 0 Z" fill="#F5F5F5" />
        <path d="M0 100 L0 78 C35 68 55 88 100 82 L100 100 Z" fill={NAVY} />
        <path d="M100 100 L100 88 C72 94 45 90 18 100 Z" fill={GREEN} />
      </svg>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="mb-7 flex flex-col items-center">
          <svg width="80" height="80" viewBox="0 0 80 80" aria-hidden="true">
            <circle cx="40" cy="22" r="9" fill={NAVY} />
            <path
              d="M28 42 Q28 60 44 66 L52 56"
              stroke={NAVY}
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M46 36 L60 22 M60 22 L53 22 M60 22 L60 30"
              stroke={GREEN}
              strokeWidth="5.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <div className="mt-2 text-[34px] font-medium leading-none">
            <span style={{ color: NAVY }}>Cown</span>
            <span style={{ color: GREEN }}>It</span>
          </div>
          <div className="mt-1 text-sm text-[#666]">Commit &amp; Own It</div>
        </div>

        {/* Card */}
        <div className="w-full max-w-md rounded-xl border border-[#e0e0e0] bg-white p-6 shadow-sm">
          <div className="mb-6 text-center text-base font-medium text-black">Sign up for CownIt</div>

          {/* Name */}
          <div className="mb-3.5 flex items-center gap-3 rounded-lg border border-[#e0e0e0] px-3 focus-within:border-[#999]">
            <User size={18} className="shrink-0 text-[#666]" />
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              placeholder="Full name"
              className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#999]"
            />
          </div>

          {/* Email */}
          <div className="mb-3.5 flex items-center gap-3 rounded-lg border border-[#e0e0e0] px-3 focus-within:border-[#999]">
            <Mail size={18} className="shrink-0 text-[#666]" />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Email address"
              className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#999]"
            />
          </div>

          {/* Password */}
          <div className="mb-3.5 flex items-center gap-3 rounded-lg border border-[#e0e0e0] px-3 focus-within:border-[#999]">
            <Lock size={18} className="shrink-0 text-[#666]" />
            <input
              type={passwordVisible ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Password (min. 8 characters)"
              className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#999]"
            />
            <button
              type="button"
              onClick={() => setPasswordVisible(!passwordVisible)}
              className="shrink-0 text-[#666]"
              aria-label={passwordVisible ? "Hide password" : "Show password"}
            >
              {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="mb-3.5 flex items-center gap-3 rounded-lg border border-[#e0e0e0] px-3 focus-within:border-[#999]">
            <Lock size={18} className="shrink-0 text-[#666]" />
            <input
              type={confirmPasswordVisible ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSignup();
              }}
              placeholder="Confirm password"
              className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#999]"
            />
            <button
              type="button"
              onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              className="shrink-0 text-[#666]"
              aria-label={confirmPasswordVisible ? "Hide password" : "Show password"}
            >
              {confirmPasswordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-3 rounded-lg bg-[#FBEAE8] p-3 text-xs text-[#B42318]">{error}</div>
          )}

          {/* Signup button */}
          <button
            type="button"
            onClick={handleSignup}
            disabled={!canSubmit || isLoading}
            className="h-12 w-full rounded-lg text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed"
            style={{ backgroundColor: canSubmit && !isLoading ? NAVY : "#e0e0e0" }}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </div>

        {/* Back to login */}
        <div className="mt-5 flex items-center gap-1 text-[13px]">
          <span className="text-black">Already have an account?</span>
          <button
            type="button"
            onClick={onBackToLogin}
            className="font-medium"
            style={{ color: GREEN }}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
