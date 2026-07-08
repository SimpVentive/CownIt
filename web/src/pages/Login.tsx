import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  User,
  Users,
  Briefcase,
  Check,
} from "lucide-react";
import type { Role } from "@/lib/types";
import { login as apiLogin } from "@/lib/api";

const NAVY = "#0B1F3A";
const GREEN = "#2E7D32";

interface LoginProps {
  onLoginSuccess: (role: Role, userId: string, userName: string) => void;
}

const ROLES: { value: Role; label: string; icon: typeof User }[] = [
  { value: "individual", label: "Individual", icon: User },
  { value: "hr", label: "HR", icon: Users },
  { value: "ceo", label: "CEO", icon: Briefcase },
];

function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [twoFaEnabled, setTwoFaEnabled] = useState<boolean>(true);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const canSubmit = email.length > 0 && password.length > 0;

  const handleLogin = async () => {
    setError("");
    if (!email) {
      setError("Enter email address");
      return;
    }
    if (!password) {
      setError("Enter password");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiLogin(email, password);
      const user = response.user;
      onLoginSuccess(user.role as Role, user.id, user.name);
    } catch (err) {
      setError((err as Error).message || "Login failed. Please try again.");
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
          <div className="mb-6 text-center text-base font-medium text-black">Login to CownIt</div>

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
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
              placeholder="Password"
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

          {/* 2FA toggle */}
          <div className="mb-3 flex items-center gap-3 rounded-lg border border-[#e0e0e0] p-3">
            <ShieldCheck size={22} className="shrink-0 text-[#666]" strokeWidth={1.75} />
            <div className="flex-1">
              <div className="text-[13px] font-medium text-black">
                Two-factor authentication (2FA)
              </div>
              <div className="text-xs text-[#999]">Secure your account with 2FA</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={twoFaEnabled}
              onClick={() => setTwoFaEnabled(!twoFaEnabled)}
              className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
              style={{ backgroundColor: twoFaEnabled ? GREEN : "#e0e0e0" }}
            >
              <span
                className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all"
                style={{ left: twoFaEnabled ? "22px" : "2px" }}
              />
            </button>
          </div>

          {/* Remember me / forgot password */}
          <div className="mb-3 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2 text-[13px] text-black">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[#e0e0e0]"
                style={{ accentColor: GREEN }}
              />
              Remember me
            </label>
            <button type="button" className="text-[13px] font-medium" style={{ color: GREEN }}>
              Forgot password?
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-3 rounded-lg bg-[#FBEAE8] p-3 text-xs text-[#B42318]">{error}</div>
          )}

          {/* Login button */}
          <button
            type="button"
            onClick={handleLogin}
            disabled={!canSubmit || isLoading}
            className="h-12 w-full rounded-lg text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed"
            style={{ backgroundColor: canSubmit && !isLoading ? NAVY : "#e0e0e0" }}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* Sign up */}
        <div className="mt-5 flex items-center gap-1 text-[13px]">
          <span className="text-black">New to CownIt?</span>
          <button type="button" className="font-medium" style={{ color: GREEN }}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
