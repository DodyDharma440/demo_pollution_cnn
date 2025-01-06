import React, { useEffect, useRef, useState } from "react";
import { InputProps } from "../types/types";

function dataURItoBlob(dataURI: string) {
  const byteString = atob(dataURI.split(",")[1]);
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  const ab = new ArrayBuffer(byteString.length);

  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([ab], { type: mimeString });
  return blob;
}

const VideoInput: React.FC<InputProps> = ({ onPredict }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [cameraOptions, setCameraOptions] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState("");

  const [isCapture, setIsCapture] = useState(false);

  const handlePredict = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      canvas
        .getContext("2d")
        ?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      setIsCapture(true);

      const file = new File([dataURItoBlob(canvas.toDataURL())], "capture.png");
      onPredict(file);
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
      let stream: MediaStream;

      const setupCamera = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          try {
            stream = await navigator.mediaDevices.getUserMedia({
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

      return () => {
        stream.getTracks().forEach((t) => t.stop());
      };
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
            return (
              <option key={opt.deviceId} value={opt.deviceId}>
                {opt.label}
              </option>
            );
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

      <hr className="my-4" />

      <div className="">
        {isCapture ? <p className="font-bold">Captured Image</p> : null}
        <canvas
          className="w-full my-5 object-contain rounded-xl overflow-hidden"
          ref={canvasRef}
        />
      </div>
    </>
  );
};

export default VideoInput;
