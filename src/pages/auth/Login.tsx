import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {Eye, EyeOff, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";
import {useAppDispatch} from "@/app/store";
import {setCredentials} from "@/features/auth/authSlice";
import {loginApi} from "@/api/auth.api";
import type {LoginRequest} from "@/types/api/auth";
import BookyLogo from "@/assets/Booky-logo.svg";
import type {LoginResponse} from "@/types/api/auth";

// reusable login form component
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
    <div className="flex flex-col gap-[2px] w-full bg-transparent">
      <Label
        htmlFor={id}
        className="font-bold text-neutral-950 tracking-[-0.02em] text-sm h-7 flex items-center leading-[28px]"
      >
        {label}
      </Label>

      <div
        className={cn(
          "flex flex-row items-center py-2 px-4 gap-2 w-full h-12 border rounded-xl transition-colors bg-transparent",
          error ? "border-[#EE1D52]" : "border-neutral-300",
        )}
      >
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full h-full border-0 p-0 bg-transparent text-sm focus-visible:ring-0 focus-visible:border-transparent focus-visible:outline-none placeholder:text-neutral-400 font-normal leading-[28px]"
        />
        {suffix && (
          <div className="flex items-center justify-center w-20 h-20 shrink-0 text-neutral-950">
            {suffix}
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <p className="font-medium text-accent-red tracking-[-0.03em] text-sm h-7 flex items-center leading-[28px]">
          {error}
        </p>
      )}
    </div>
  );
}

// Main page
export default function Login () {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

const { mutate: login, isPending } = useMutation<
  LoginResponse,
  Error,
  LoginRequest
>({
  mutationFn: (payload) => loginApi(payload),
  onSuccess: (data) => {
    dispatch(setCredentials({ token: data.token, user: data.user }));
    navigate(data.user.role === "ADMIN" ? "/admin" : "/books");
  },
  onError: (err: Error) => {
    const msg = err.message.toLowerCase();
    if (msg.includes("email")) {
      setEmailError(err.message);
    } else if (msg.includes("password")) {
      setPasswordError(err.message);
    } else {
      setEmailError("Invalid email or password");
      setPasswordError("Invalid email or password");
    }
  },
});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");
    login({ email, password });
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div
        className="w-[324px] md:w-[400px] flex flex-col items-start gap-5 p-0"
      >
        {/* Logo row */}
        <div className="flex flex-row items-center gap-[11.79px] h-[33px]">
          <img
            src={BookyLogo}
            alt="Booky"
            className="shrink-0 w-[33px] h-[33px]"
          />
          <span
            className="font-bold text-neutral-950 text-[25.1429px] leading-[33px]"
          >
            Booky
          </span>
        </div>

        {/* Heading block */}
        <div className="flex flex-col items-start gap-[0.5px] md:gap-2 w-full">
          <h1
            className="font-bold text-neutral-950 tracking-[-0.02em] text-2xl md:text-[28px] leading-[36px] md:leading-[38px]"
          >
            Login
          </h1>
          <p
            className="font-semibold text-neutral-700 tracking-[-0.02em] text-sm leading-[28px] md:leading-[30px]"
          >
            Sign in to manage your library account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full">
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
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-neutral-950 hover:text-neutral-700 transition-colors focus:outline-none flex items-center justify-center"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 stroke-[1.67px]" />
                ) : (
                  <Eye className="w-5 h-5 stroke-[1.67px]" />
                )}
              </button>
            }
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-full flex flex-row items-center justify-center gap-2 p-2 shadow-none border-0 transition-colors cursor-pointer text-base leading-[30px] tracking-[0.02em]"
          >
            {isPending && <Loader2 className="w-5 h-5 animate-spin text-neutral-25" />}
            Login
          </Button>

           {/* Register link */}
          <div className="flex flex-row items-center justify-center gap-1 w-full h-7 md:h-[30px]">
            <span className="font-semibold text-neutral-950 tracking-[-0.02em] text-sm leading-7 md:text-base md:leading-[30px]">
              Don't have an account?
            </span>
            <Link
              to="/register"
              className="font-bold text-primary tracking-[-0.02em] text-sm leading-7 md:text-base md:leading-[30px] hover:underline"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}