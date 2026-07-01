import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useMutation} from "@tanstack/react-query";
import {Eye, EyeOff, Loader2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {cn} from "@/lib/utils";
import {useAppDispatch} from "@/app/store";
import {setCredentials} from "@/features/auth/authSlice";
import {loginApi} from "../../api/auth.api";
import type {LoginRequest} from "@/types/api/auth";
import BookyLogo from "@/assets/booky-logo.svg";
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
    <div className="flex flex-col gap-[2px] w-full">
      <Label
        htmlFor={id}
        className="font-bold text-neutral-950 tracking-[-0.02em]"
        style={{ fontSize: 14, lineHeight: "28px" }}
      >
        {label}
      </Label>

      <div className="relative">
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={cn(
            "h-12 rounded-xl px-4 text-sm border",
            suffix && "pr-11",
            error
              ? "border-accent-red focus-visible:ring-accent-red/30"
              : "border-neutral-300",
          )}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {suffix}
          </span>
        )}
      </div>

      {/* Error state */}
      {error && (
        <p
          className="font-medium text-accent-red tracking-[-0.03em]"
          style={{ fontSize: 14, lineHeight: "28px" }}
        >
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

  const { mutate: login, isPending } = useMutation({
    mutationFn: (payload: LoginRequest) => loginApi(payload),
    onSuccess: (data: LoginResponse) => {
      dispatch(setCredentials({ token: data.token, user: data.user }));
      navigate(data.user.role === "ADMIN" ? "/admin" : "/books");
    },
    onError: (err: Error) => {
      const msg = err.message.toLocaleLowerCase();
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
        className="w-full bg-white rounded-2xl flex flex-col gap-5 p-8 sm:p-10"
        style={{ maxWidth: 324 }}
      >
        {/* Logo row */}
        <div className="flex items-center" style={{ gap: "11.79px" }}>
          <img
            src={BookyLogo}
            alt="Booky"
            width={33}
            height={33}
            className="shrink-0"
          />
          <span
            className="font-bold text-neutral-950"
            style={{ fontSize: "25.1429px", lineHeight: "33px" }}
          >
            Booky
          </span>
        </div>

        {/* Heading block */}
        <div className="flex flex-col gap-[2px]">
          <h1
            className="font-bold text-neutral-950 tracking-[-0.02em]
                       text-[24px] leading-[36px]
                       sm:text-[28px] sm:leading-[38px]"
          >
            Login
          </h1>
          <p
            className="font-semibold text-neutral-700 tracking-[-0.02em]
                       text-[14px] leading-[28px]
                       sm:text-[16px] sm:leading-[30px]"
          >
            Sign in to manage your library account.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                className="text-neutral-400 hover:text-neutral-700 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            }
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white
                       font-bold rounded-full flex items-center justify-center
                       gap-2 mt-2"
            style={{
              fontSize: 16,
              lineHeight: "30px",
              letterSpacing: "-0.02em",
            }}
          >
            {isPending && <Loader2 className="w-5 h-5 animate-spin" />}
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}