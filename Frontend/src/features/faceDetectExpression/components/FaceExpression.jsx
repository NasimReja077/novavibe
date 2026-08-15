import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils.js";
import { GiRadarSweep } from "react-icons/gi";
import { LuScanFace, LuVideoOff } from "react-icons/lu";
import { FaVideo } from "react-icons/fa6";

const FaceExpression = ({ onExpressionDetect }) => {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState("Detecting...");
  const [isCameraOn, setIsCameraOn] = useState(true);

  useEffect(() => {
    if (!isCameraOn) {
      setExpression("Camera Off");
      return;
    }

    setExpression("Detecting...");
    let mounted = true;

    const startCamera = async () => {
      try {
        await init({ landmarkerRef, videoRef, streamRef });
        if (!mounted) {
          // Cleanup if unmounted during init
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => {
              track.stop();
            });
            streamRef.current = null;
          }
          if (landmarkerRef.current) {
            landmarkerRef.current.close();
            landmarkerRef.current = null;
          }
          return;
        }
        setExpression("Camera Ready");
      } catch (err) {
        if (!mounted) return;
        console.error("Error initializing face detection:", err);
        setExpression(`Error: ${err.message || "Camera init failed"}`);
        // Cleanup on failure
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => {
            track.stop();
          });
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

      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
        videoRef.current.srcObject = null;
      }
    };
  }, [isCameraOn]);

  useEffect(() => {
    if (onExpressionDetect && expression) {
      const expStr = expression.toLowerCase();
      if (expStr.includes("happy")) {
        onExpressionDetect("happy");
      } else if (expStr.includes("surprise")) {
        onExpressionDetect("surprise");
      } else if (expStr.includes("sad")) {
        onExpressionDetect("sad");
      } else if (expStr.includes("neutral")) {
        onExpressionDetect("neutral");
      }
    }
  }, [expression, onExpressionDetect]);

  const toggleCamera = () => {
    setIsCameraOn((prev) => !prev);
  };

  return (
    <div className="relative w-full max-w-sm aspect-4/3 rounded-2xl overflow-hidden bg-[#141414] ring-1 ring-white/10 shadow-lg">
      {/* Fallback background if video is loading or off */}
      <div className="absolute inset-0 flex items-center justify-center">
        <LuVideoOff size={32} className="text-zinc-800" />
      </div>

      {/* Video Feed */}
      <video
        ref={videoRef}
        className={`relative z-10 w-full h-full object-cover transition-opacity duration-300 ${!isCameraOn ? "opacity-0" : "opacity-100"}`}
        playsInline
        autoPlay
        muted
      />

      {/* Floating Top Control: Camera Toggle */}
      <div className="absolute top-3 right-3 z-20">
        <button
          onClick={toggleCamera}
          className="flex items-center justify-center h-8 w-8 rounded-full bg-black/40 backdrop-blur-md text-zinc-400 hover:text-white hover:bg-black/60 ring-1 ring-white/10 transition-all duration-200"
          aria-label="Toggle camera"
        >
          {isCameraOn ? <FaVideo size={16} /> : <LuVideoOff size={16} />}
        </button>
      </div>

      {/* Floating Bottom Console: Scanner & Results */}
      <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between px-4 py-2.5 bg-black/40 backdrop-blur-md rounded-xl ring-1 ring-white/10">
        <div className="flex items-center gap-3">
          <GiRadarSweep className="text-zinc-400 animate-pulse" size={16} />

          <h2 className="text-sm font-medium text-zinc-300 tracking-wide">
            Looking{" "}
            <span className="text-white font-semibold ml-1 capitalize">
              {expression}
            </span>
          </h2>
        </div>

        {/* Scan Action Button */}
        <button
          onClick={() => detect({ landmarkerRef, videoRef, setExpression })}
          className="text-zinc-400 hover:text-white transition-colors duration-200 group flex items-center"
          aria-label="Scan face"
        >
          Scan
          <LuScanFace
            size={18}
            className="ml-1 group-hover:scale-110 transition-transform duration-200"
          />
        </button>
      </div>
    </div>
  );
};

export default FaceExpression;