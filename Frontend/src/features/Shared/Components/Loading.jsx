import { LuSparkles } from "react-icons/lu";

const Loading = ({ message = "Tuning into your vibe..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
      {/* Animated Glow Logo Container */}
      <div className="relative flex items-center justify-center">
        {/* Outer pulsing mood glow */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#d62b70]/30 via-[#8b5cf6]/20 to-[#2bd6d6]/30 blur-xl animate-pulse" />
        
        {/* Orbiting spinner ring */}
        <div className="w-24 h-24 rounded-full border-2 border-transparent border-t-[#d62b70] border-r-[#2bd6d6] border-b-[#8b5cf6] animate-spin" />
        
        {/* Inner center badge with Logo typography */}
        <div className="absolute flex flex-col items-center justify-center">
          <div className="flex items-center gap-1">
            <span className="font-['Bebas_Neue'] text-2xl tracking-[0.08em] bg-gradient-to-r from-[#ffb1c4] via-[#d62b70] to-[#2bd6d6] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(214,43,112,0.5)]">
              NovaVibe
            </span>
          </div>
          {/* Animated audio bars */}
          <div className="flex items-end gap-1 h-3 mt-1">
            <div className="w-0.5 bg-[#d62b70] h-full animate-eq-1 rounded-full" />
            <div className="w-0.5 bg-[#2bd6d6] h-full animate-eq-2 rounded-full" />
            <div className="w-0.5 bg-[#8b5cf6] h-full animate-eq-3 rounded-full" />
            <div className="w-0.5 bg-[#d62b70] h-full animate-eq-4 rounded-full" />
          </div>
        </div>
      </div>

      {/* Loading message */}
      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-[#94a3b8]">
        <LuSparkles className="text-[#d62b70] animate-spin" size={14} />
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Loading;
