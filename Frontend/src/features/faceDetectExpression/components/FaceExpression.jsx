import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils.js";
import { LuScanFace, LuVideoOff, LuCamera, LuSparkles } from "react-icons/lu";

const FaceExpression = ({ onExpressionDetect }) => {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState("Camera Ready");
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (!isCameraOn) return;

    let mounted = true;
    const currentVideo = videoRef.current;

    const startCamera = async () => {
      try {
        await init({ landmarkerRef, videoRef, streamRef });
        if (!mounted) {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
          if (landmarkerRef.current) {
            landmarkerRef.current.close();
            landmarkerRef.current = null;
          }
        }
      } catch (err) {
        if (!mounted) return;
        console.error("Error initializing face detection:", err);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        if (landmarkerRef.current) {
          landmarkerRef.current.close();
          landmarkerRef.current = null;
        }
      }
    };

    startCamera();

    return () => {
      mounted = false;
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }

      if (currentVideo?.srcObject) {
        const stream = currentVideo.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        currentVideo.srcObject = null;
      }
    };
  }, [isCameraOn]);

  useEffect(() => {
    if (onExpressionDetect && expression) {
      const expStr = expression.toLowerCase();
      if (expStr.includes("happy")) {
        onExpressionDetect("happy");
      } else if (expStr.includes("surpris")) {
        onExpressionDetect("surprised");
      } else if (expStr.includes("sad")) {
        onExpressionDetect("sad");
      } else if (expStr.includes("neutral")) {
        onExpressionDetect("neutral");
      }
    }
  }, [expression, onExpressionDetect]);

  const handleScan = () => {
    setIsDetecting(true);
    try {
      detect({ landmarkerRef, videoRef, setExpression });
    } catch (e) {
      console.warn("Detection run:", e);
    }
    setTimeout(() => setIsDetecting(false), 1200);
  };

  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
    if (isCameraOn) {
      setExpression("Camera Off");
    } else {
      setExpression("Camera Ready");
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#16161a] border border-[#d62b70]/30 shadow-[0_0_25px_rgba(214,43,112,0.15)] group">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#1b1b1e]/90 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d62b70] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d62b70]" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#ffb1c4]">
            AI Mood Radar
          </span>
        </div>

        <button
          onClick={toggleCamera}
          className="flex items-center gap-1 text-[11px] text-[#94a3b8] hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-md"
          aria-label="Toggle camera"
        >
          {isCameraOn ? <LuCamera size={13} /> : <LuVideoOff size={13} />}
          <span>{isCameraOn ? "Cam On" : "Cam Off"}</span>
        </button>
      </div>

      {/* Camera / Visualizer Viewport */}
      <div className="relative aspect-4/3 w-full bg-[#0e0e11] overflow-hidden flex items-center justify-center">
        {/* Radar sweep effect */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#d62b70]/20 via-transparent to-transparent" />
        
        {/* Animated HUD Grid Ring */}
        <div className="absolute w-32 h-32 rounded-full border border-[#d62b70]/30 animate-pulse pointer-events-none z-10 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border border-dashed border-[#2bd6d6]/40 animate-spin pointer-events-none" />
        </div>

        {/* Video feed */}
        <video
          ref={videoRef}
          className={`relative z-10 w-full h-full object-cover transition-opacity duration-300 ${
            !isCameraOn ? "opacity-0" : "opacity-90"
          }`}
          playsInline
          autoPlay
          muted
        />

        {!isCameraOn && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#94a3b8] gap-2">
            <LuVideoOff size={32} />
            <span className="text-xs">Camera paused</span>
          </div>
        )}
      </div>

      {/* Floating Bottom Console */}
      <div className="p-3 bg-[#131316]/95 border-t border-white/5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase font-semibold text-[#94a3b8] tracking-wider">
            Detected Emotion
          </p>
          <p className="text-xs md:text-sm font-bold text-white truncate flex items-center gap-1.5 mt-0.5">
            <LuSparkles className="text-[#d62b70]" size={13} />
            <span className="capitalize">{expression}</span>
          </p>
        </div>

        <button
          onClick={handleScan}
          disabled={isDetecting}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#d62b70] to-[#8b5cf6] text-white text-xs font-bold shadow-[0_2px_15px_rgba(214,43,112,0.4)] hover:brightness-110 active:scale-95 transition-all shrink-0"
        >
          <LuScanFace size={15} className={isDetecting ? "animate-spin" : ""} />
          <span>{isDetecting ? "Scanning..." : "Scan Face"}</span>
        </button>
      </div>
    </div>
  );
};

export default FaceExpression;