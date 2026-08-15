import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import Input from "../components/Input.jsx";
import { useAuth } from "../hook/useAuth.js";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import ContinueWithGoogle from "../components/ContinueWithGoogle.jsx";

const schema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters").max(50),
    email: z.string().email("Please enter a valid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[0-9]/, "Must contain at least one number")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[!@#$%^&*]/, "Must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();

  const onSubmit = async (data) => {
    clearError();

    const resultAction = await register({
      username: data.username,
      email: data.email,
      password: data.password,
    });

    if (resultAction?.meta?.requestStatus === "fulfilled") {
      toast.success("Account created successfully!", { id: "register-success" });
      navigate("/");
      return;
    }

    toast.error(resultAction?.payload || "Registration failed", {
      id: "register-error",
    });
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#060e09] font-['DM_Sans'] overflow-hidden p-5">
      {/* Background grid */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(29,185,84,0.16) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage:
            "radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Ambient spots */}
      <div
        className="fixed rounded-full pointer-events-none z-[1] blur-[100px] w-[550px] h-[550px] -top-[130px] -left-[110px] animate-[breathe_10s_ease-in-out_infinite_alternate]"
        style={{
          background:
            "radial-gradient(circle, rgba(29,185,84,0.22) 0%, transparent 68%)",
        }}
        aria-hidden="true"
      />
      <div
        className="fixed rounded-full pointer-events-none z-[1] blur-[100px] w-[420px] h-[420px] -bottom-[90px] right-[4%] animate-[breathe_12s_ease-in-out_infinite_alternate] [animation-delay:-4s]"
        style={{
          background:
            "radial-gradient(circle, rgba(0,215,145,0.18) 0%, transparent 68%)",
        }}
        aria-hidden="true"
      />
      <div
        className="fixed rounded-full pointer-events-none z-[1] blur-[100px] w-[280px] h-[280px] top-[28%] -right-[50px] animate-[breathe_8s_ease-in-out_infinite_alternate] [animation-delay:-6s]"
        style={{
          background:
            "radial-gradient(circle, rgba(128,255,90,0.13) 0%, transparent 68%)",
        }}
        aria-hidden="true"
      />
      <div
        className="fixed rounded-full pointer-events-none z-[1] blur-[100px] w-[320px] h-[320px] bottom-[12%] left-[4%] animate-[breathe_14s_ease-in-out_infinite_alternate] [animation-delay:-9s]"
        style={{
          background:
            "radial-gradient(circle, rgba(0,195,120,0.14) 0%, transparent 68%)",
        }}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative z-[2] flex w-full max-w-[840px] min-h-[510px] bg-[rgba(9,18,11,0.80)] border border-[rgba(29,185,84,0.17)] rounded-[20px] overflow-hidden backdrop-blur-[22px] shadow-[0_0_0_1px_rgba(29,185,84,0.04),0_28px_90px_rgba(0,0,0,0.70),0_0_100px_rgba(29,185,84,0.06)_inset] animate-[card-in_0.7s_cubic-bezier(0.22,1,0.36,1)_both] max-[680px]:flex-col max-[680px]:max-w-[400px]">
        {/* GIF panel */}
        <div className="relative flex-[0_0_43%] overflow-hidden flex items-end max-[680px]:flex-[0_0_190px] after:content-[''] after:absolute after:top-[8%] after:right-0 after:w-px after:h-[84%] after:bg-gradient-to-b after:from-transparent after:via-[rgba(29,185,84,0.30)] after:to-transparent after:z-[4] max-[680px]:after:hidden">
          <div className="absolute inset-0 bg-gradient-to-[145deg] from-[#081a0e] to-[#040b06]">
            <img
              src="https://i.pinimg.com/originals/a8/17/f2/a817f27f252c3e43c78181468b85b1e5.gif"
              alt="mood animation"
              className="w-full h-full object-cover block"
            />
          </div>

          <div className="relative z-[3] w-full px-6 py-[26px] bg-gradient-to-t from-[rgba(4,10,6,0.85)] to-transparent flex flex-col gap-1.5">
            <span className="inline-block font-['Syne'] text-[11px] font-bold tracking-[0.14em] uppercase text-[#1db954] bg-[rgba(29,185,84,0.12)] border border-[rgba(29,185,84,0.25)] rounded-md px-[11px] py-[5px] w-fit">
              NovaVibe AI
            </span>
            <p className="font-['Syne'] font-extrabold text-[2.1rem] leading-[1.1] tracking-[-0.02em] text-[#dff0e6] [text-shadow:0_4px_24px_rgba(0,0,0,0.8)] max-[680px]:text-[1.7rem]">
              FEEL THE
              <br />
              MUSIC.
            </p>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex-1 flex flex-col justify-center px-[42px] py-12 animate-[fade-up_0.65s_0.2s_cubic-bezier(0.22,1,0.36,1)_both] max-[680px]:px-6 max-[680px]:py-8 max-[420px]:px-[18px] max-[420px]:py-[26px]">
          <div className="mb-7">
            <h1 className="font-['Syne'] font-extrabold text-[1.8rem] text-[#dff0e6] tracking-[-0.025em] leading-[1.15] after:content-[''] after:block after:w-[30px] after:h-[3px] after:bg-[#1db954] after:rounded-sm after:mt-[9px] after:shadow-[0_0_12px_rgba(29,185,84,0.65)] max-[420px]:text-[1.5rem]">
              Create Account
            </h1>
            <p className="mt-[9px] text-[13px] text-[#5f9070] font-light">
              Start your mood‑music journey
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {typeof error === "string" ? error : error.message || "Registration failed"}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
            <Input
              id="reg-username"
              label="Username"
              name="username"
              placeholder="Enter your username"
              autoComplete="username"
              {...formRegister("username")}
              error={errors.username?.message}
              variant="green"
            />

            <Input
              id="reg-email"
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              {...formRegister("email")}
              error={errors.email?.message}
              variant="green"
            />

            <Input
              id="reg-password"
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="new-password"
              {...formRegister("password")}
              error={errors.password?.message}
              variant="green"
            />

            <Input
              id="reg-confirm-password"
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              autoComplete="new-password"
              {...formRegister("confirmPassword")}
              error={errors.confirmPassword?.message}
              variant="green"
            />
            
            <button
              type="submit"
              disabled={loading}
              className="mt-2 py-[13px] w-full bg-[#1db954] text-black font-['Syne'] font-bold text-sm tracking-[0.05em] border-none rounded-[10px] cursor-pointer relative overflow-hidden transition-[background,transform,box-shadow] duration-200 shadow-[0_4px_20px_rgba(29,185,84,0.36)] hover:bg-[#22e060] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(29,185,84,0.50),0_0_0_3px_rgba(29,185,84,0.15)] active:scale-[0.98] active:shadow-[0_2px_10px_rgba(29,185,84,0.28)] before:content-[''] before:absolute before:top-0 before:-left-[80%] before:w-[55%] before:h-full before:bg-gradient-to-[120deg] before:from-transparent before:via-[rgba(255,255,255,0.24)] before:to-transparent before:skew-x-[-20deg] before:transition-[left] before:duration-500 before:ease-in-out hover:before:left-[130%] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>

             {/* Divider */}
              <div className="flex items-center gap-4">
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: "#e4e2df" }}
                />
                <span
                  className="text-[10px] uppercase tracking-[0.15em]"
                  style={{ color: "#B5ADA3" }}
                >
                  or
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: "#e4e2df" }}
                />
              </div>

              {/* Google SSO */}
              <ContinueWithGoogle />
          </form>

          <p className="text-center mt-[18px] text-[12.5px] text-[#5f9070]">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#1db954] no-underline font-medium transition-opacity duration-200 hover:opacity-70 hover:underline"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Register