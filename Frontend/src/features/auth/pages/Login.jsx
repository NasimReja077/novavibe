import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import Input from "../components/Input.jsx";
import { useAuth } from "../hook/useAuth.js";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import ContinueWithGoogle from "../components/ContinueWithGoogle.jsx";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuth();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    clearError();

    const resultAction = await login({
      email: data.email,
      password: data.password,
    });

    if (resultAction?.meta?.requestStatus === "fulfilled") {
      toast.success("Welcome back!", { id: "login-success" });
      navigate("/");
      return;
    }

    toast.error(resultAction?.payload || "Login failed", {
      id: "login-error",
    });
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#05080f] font-['Outfit'] overflow-hidden p-5">
      {/* Background grid */}
      <div className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(61,139,255,0.15) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage: "radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 100%)",
        }} aria-hidden="true"
      />

      {/* Ambient spots */}
      <div
        className="fixed rounded-full pointer-events-none z-1 blur-[110px] w-145 h-145 -top-35 -left-30 animate-[login-breathe_10s_ease-in-out_infinite_alternate]"
        style={{
          background: "radial-gradient(circle, rgba(61,139,255,0.22) 0%, transparent 68%)",
        }}
        aria-hidden="true"
      />
      <div className="fixed rounded-full pointer-events-none z-[1] blur-[110px] w-105 h-[420px] -bottom-25 right-[3%] animate-[login-breathe_12s_ease-in-out_infinite_alternate] [animation-delay:-4s]"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.20) 0%, transparent 68%)",
        }}
        aria-hidden="true"
      />
      
      <div className="fixed rounded-full pointer-events-none z-[1] blur-[110px] w-[300px] h-[300px] top-[25%] -right-[60px] animate-[login-breathe_8s_ease-in-out_infinite_alternate] [animation-delay:-6s]"
        style={{
          background:
            "radial-gradient(circle, rgba(0,212,255,0.14) 0%, transparent 68%)",
        }}
        aria-hidden="true"
      />
      <div className="fixed rounded-full pointer-events-none z-[1] blur-[110px] w-[340px] h-[340px] bottom-[8%] left-[3%] animate-[login-breathe_14s_ease-in-out_infinite_alternate] [animation-delay:-9s]"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.16) 0%, transparent 68%)",
        }}
        aria-hidden="true"
      />

      {/* Card */}
      <div className="relative z-[2] flex w-full max-w-210 min-h-127.5 bg-[rgba(8,13,26,0.78)] border border-[rgba(82,148,255,0.16)] rounded-[20px] overflow-hidden backdrop-blur-[22px] shadow-[0_0_0_1px_rgba(61,139,255,0.04),0_28px_90px_rgba(0,0,0,0.72),0_0_100px_rgba(61,139,255,0.06)_inset] animate-[login-card-in_0.7s_cubic-bezier(0.22,1,0.36,1)_both] max-[680px]:flex-col max-[680px]:max-w-100">
        {/* GIF panel */}
        <div className="relative flex-[0_0_43%] overflow-hidden flex items-end max-[680px]:flex-[0_0_190px] after:content-[''] after:absolute after:top-[8%] after:right-0 after:w-px after:h-[84%] after:bg-linear-to-b after:from-transparent after:via-[rgba(61,139,255,0.30)] after:to-transparent after:z-4 max-[680px]:after:hidden">
          <div className="absolute inset-0 bg-gradient-to-[145deg] from-[#080f20] to-[#040810]">
            <img
              src="https://i.pinimg.com/originals/6a/c7/80/6ac780f0649e8e2497148d50edf432c3.gif"
              alt="mooflow animation"
              className="w-full h-full object-cover block"
            />
          </div>

          <div className="relative z-[3] w-full p-[26px_24px] bg-linear-to-t from-[rgba(4,8,20,0.88)] to-transparent flex flex-col gap-1.5">
            <span className="inline-block font-['Outfit'] text-[11px] font-semibold tracking-[0.14em] uppercase text-[#3d8bff] bg-[rgba(61,139,255,0.10)] border border-[rgba(61,139,255,0.25)] rounded-md px-[11px] py-[5px] w-fit">
              NovaVibe AI
            </span>
            <p className="font-['Bebas_Neue'] text-[2.8rem] leading-none tracking-[0.04em] text-[#dde8ff] [text-shadow:0_4px_28px_rgba(0,0,0,0.85)] max-[680px]:text-[2rem]">
              HEAR YOUR
              <br />
              MOOD.
            </p>
          </div>
        </div>

        {/* Form panel */}
        <div className="flex-1 flex flex-col justify-center px-[42px] py-12 animate-[login-fade-up_0.65s_0.2s_cubic-bezier(0.22,1,0.36,1)_both] max-[680px]:px-6 max-[680px]:py-8 max-[420px]:px-[18px] max-[420px]:py-6.5">
          <div className="mb-7">
            <h1 className="font-['Bebas_Neue'] text-[2.4rem] tracking-[0.06em] text-[#dde8ff] leading-[1.1] after:content-[''] after:block after:w-[30px] after:h-[3px] after:bg-[#3d8bff] after:rounded-sm after:mt-2.25 after:shadow-[0_0_14px_rgba(61,139,255,0.70)] max-[420px]:text-[2rem]">
              Welcome Back
            </h1>
            <p className="mt-[9px] text-[13px] text-[#5a7ab0] font-light tracking-[0.01em]">
              Sign in to continue your journey
            </p>
          </div>
          
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {typeof error === "string" ? error : error.message || "Login failed"}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
            <Input
              id="login-email"
              label="Email"
              type="email"
              name="email"
              placeholder="Enter your email"
              autoComplete="email"
              {...formRegister("email")}
              error={errors.email?.message}
              variant="blue"
            />

            <Input
              id="login-password"
              label="Password"
              type="password"
              name="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              {...formRegister("password")}
              error={errors.password?.message}
              variant="blue"
            />

            <div className="flex justify-between items-center -mt-0.5">
              {/* Remember / Forgot – uncomment if needed */}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1.5 py-[13px] w-full bg-[#3d8bff] text-white font-['Outfit'] font-semibold text-sm tracking-[0.06em] uppercase border-none rounded-[10px] cursor-pointer relative overflow-hidden transition-[background,transform,box-shadow] duration-200 shadow-[0_4px_22px_rgba(61,139,255,0.38)] hover:bg-[#5aa3ff] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(61,139,255,0.52),0_0_0_3px_rgba(61,139,255,0.15)] active:scale-[0.98] active:shadow-[0_2px_10px_rgba(61,139,255,0.28)] before:content-[''] before:absolute before:top-0 before:-left-[80%] before:w-[55%] before:h-full before:bg-gradient-to-[120deg] before:from-transparent before:via-[rgba(255,255,255,0.22)] before:to-transparent before:skew-x-[-20deg] before:transition-[left] before:duration-500 before:ease-in-out hover:before:left-[130%] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Signing In..." : "Sign In"}
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

          <p className="text-center mt-[18px] text-[12.5px] text-[#5a7ab0]">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-[#3d8bff] no-underline font-medium transition-opacity duration-200 hover:opacity-70 hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login
