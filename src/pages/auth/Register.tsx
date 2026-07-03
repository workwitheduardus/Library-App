import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/app/store";
import { setCredentials } from "@/features/auth/authSlice";
import { registerApi } from "@/api/auth.api";
import type { RegisterRequest, RegisterResponse } from "@/types/api/auth";
import BookyLogo from "@/assets/Booky-logo.svg";

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  suffix?: React.ReactNode;
  required?: boolean;
}

function InputField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  suffix,
  required,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-[2px] w-full bg-white">
      <label
        htmlFor={id}
        className="font-bold text-neutral-950 tracking-[-0.02em] text-sm leading-7"
      >
        {label}
      </label>

      <div
        className={cn("flex items-center gap-2 px-4 h-12 border rounded-xl bg-transparent transition-colors", error ? "border-[#EE1D52]" : "border-neutral-300",
        )}
      >
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="flex-1 bg-transparent text-sm font-normal leading-7 outline-none placeholder:text-neutral-400 text-neutral-950"
        />
        {suffix && (
          <div className="shrink-0 flex items-center justify-center">
            {suffix}
          </div>
        )}
      </div>

      {error && (
        <p className="font-medium text-[#EE1D52] tracking-[-0.03em] text-sm leading-7">
          {error}
        </p>
      )}
    </div>
  );
}

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const clearErrors = () => {
    setNameError("");
    setEmailError("");
    setPhoneError("");
    setPasswordError("");
    setConfirmError("");
  };
  
const { mutate: register, isPending } = useMutation<RegisterResponse, Error, RegisterRequest
>({
  mutationFn: (payload) => registerApi(payload),
  onSuccess: (data) => {
    dispatch(setCredentials({ token: data.token, user: data.user }));
    navigate("/");
  },
  onError: (err: Error) => {
    const msg = err.message.toLowerCase();
    if (msg.includes("email")) setEmailError(err.message);
    else if (msg.includes("phone")) setPhoneError(err.message);
    else if (msg.includes("name")) setNameError(err.message);
    else if (msg.includes("password")) setPasswordError(err.message);
    else setEmailError(err.message);
  },
});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      return;
    }
    if (phone.length < 8 || phone.length > 20) {
      setPhoneError("Phone must be 8–20 characters.");
      return;
    }

    register({ name, email, phone, password });
  };

  const eyeButton = (show: boolean, toggle: () => void, label: string) => (
    <button
      type="button"
      onClick={toggle}
      className="text-neutral-400 hover:text-neutral-700 transition-colors"
      tabIndex={-1}
      aria-label={label}
    >
      {show ? ( <EyeOff className="w-5 h-5" strokeWidth={1.67} />) : ( <Eye className="w-5 h-5" strokeWidth={1.67} />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div
        className={cn("w-full flex flex-col gap-5","max-w-[345px] sm:max-w-[400px]",
        )}
      >
        {/* Logo row */}
        <div className="flex items-center gap-[11.79px]">
          <img
            src={BookyLogo}
            alt="Booky"
            className="w-[33px] h-[33px] shrink-0"
          />
          <span className="font-bold text-neutral-950 text-[25.1429px] leading-[33px]">
            Booky
          </span>
        </div>

        {/* Heading block */}
        <div className="flex flex-col gap-[2px] sm:gap-2">
          <h1
            className="font-bold text-neutral-950 tracking-[-0.02em] text-[24px] leading-9 sm:text-[28px] sm:leading-[38px]"
          >
            Register
          </h1>
          <p
            className="font-semibold tracking-[-0.02em]text-sm leading-7 sm:text-base sm:leading-[30px]"
            style={{ color: "#414651" }}
          >
            Create your library account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          {/* Name */}
          <InputField
            id="name"
            label="Name"
            placeholder="Your full name"
            value={name}
            onChange={(v) => {
              setName(v);
              setNameError("");
            }}
            error={nameError}
            required
          />

          {/* Email */}
          <InputField
            id="email"
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(v) => {
              setEmail(v);
              setEmailError("");
            }}
            error={emailError}
            required
          />

          {/* Phone */}
          <InputField
            id="phone"
            label="Phone"
            type="tel"
            placeholder="08xxxxxxxxxx"
            value={phone}
            onChange={(v) => {
              setPhone(v);
              setPhoneError("");
            }}
            error={phoneError}
            required
          />

          {/* Password */}
          <InputField
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(v) => {
              setPassword(v);
              setPasswordError("");
            }}
            error={passwordError}
            required
            suffix={eyeButton(
              showPassword,
              () => setShowPassword((s) => !s),
              showPassword ? "Hide password" : "Show password",
            )}
          />

          {/* Confirm Password */}
          <InputField
            id="confirmPassword"
            label="Confirm Password"
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(v) => {
              setConfirmPassword(v);
              setConfirmError("");
            }}
            error={confirmError}
            required
            suffix={eyeButton(
              showConfirm,
              () => setShowConfirm((s) => !s),
              showConfirm ? "Hide password" : "Show password",
            )}
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary/90 text-white font-bold tracking-[-0.02em] text-base leading-[30px] disabled:opacity-50 transition-opacity"
          >
            {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
            Register
          </button>

          <div className="flex items-center justify-center gap-1">
            <span
              className="font-semibold text-neutral-950 tracking-[-0.02em] text-sm leading-7 sm:text-base sm:leading-[30px]"
            >
              Already have an account?
            </span>
            <Link
              to="/login"
              className="font-bold text-primary tracking-[-0.02em]text-sm leading-7 sm:text-base sm:leading-[30px]hover:underline"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
