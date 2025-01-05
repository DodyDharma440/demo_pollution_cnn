import React, { useEffect, useRef, useState } from "react";
import { InputProps } from "./types";

const VideoInput: React.FC<InputProps> = ({ onPredict }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [cameraOptions, setCameraOptions] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState("");

  const handlePredict = async () => {
    if (videoRef.current) {
      onPredict(videoRef.current);
    }
  };

  useEffect(() => {
    const getDevices = async () => {
      const data = await navigator.mediaDevices.enumerateDevices();
      const devices = data.filter((d) => d.kind === "videoinput");
      setCameraOptions(devices);
      const selected = localStorage.getItem("selectedCamera");

      if (selected) {
        setSelectedCamera(selected);
      } else {
        setSelectedCamera(devices[0].deviceId);
        localStorage.setItem("selectedCamera", devices[0].deviceId);
      }
    };
    getDevices();
  }, []);

  useEffect(() => {
    if (selectedCamera) {
      const setupCamera = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: { deviceId: selectedCamera },
            });
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error("Error accessing camera:", error);
          }
        } else {
          console.error("getUserMedia not supported on this browser.");
        }
      };
      setupCamera();
    }
  }, [onPredict, selectedCamera]);

  return (
    <>
      <div className="mb-4">
        <label>Select camera</label>
        <select
          value={selectedCamera}
          onChange={(e) => {
            setSelectedCamera(e.target.value);
            localStorage.setItem("selectedCamera", e.target.value);
          }}
          className="border border-gray-200 px-4 py-2 w-full appearance-none rounded-lg"
        >
          {cameraOptions.map((opt) => {
            return <option value={opt.deviceId}>{opt.label}</option>;
          })}
        </select>
      </div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full mb-5 object-contain rounded-xl overflow-hidden"
      ></video>
      <div className="w-full">
        <button
          className="px-6 py-4 w-full rounded-md bg-indigo-500 hover:bg-indigo-700 text-white"
          // onClick={() => setIsPredicting((prev) => !prev)}
          onClick={handlePredict}
        >
          Capture and Predict
        </button>
      </div>
    </>
  );
};

export default VideoInput;
