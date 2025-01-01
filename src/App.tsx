const classNames = [
  "a_Good",
  "b_Moderate",
  "c_Unhealthy_Activity",
  "d_Unhealthy",
  "e_Very_Unhealthy",
  "f_Severe",
];

import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import clsx from "clsx";

const App = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await tf.loadLayersModel(
        "/models/tf_model/model.json",
        { strict: false }
      ); // Path ke model Anda
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  // Setup kamera
  useEffect(() => {
    const setupCamera = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
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
  }, []);

  const predictFrame = async () => {
    if (videoRef.current && model) {
      tf.tidy(() => {
        const video = videoRef.current;

        const img = tf.browser
          .fromPixels(video!)
          .resizeNearestNeighbor([128, 128])
          .expandDims();

        const predictions =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (model.predict(img) as tf.Tensor<any>).arraySync()[0];
        console.log("🚀 ~ handlePredict ~ predictions:", predictions);
        const predictedIndex = predictions.indexOf(Math.max(...predictions));
        const confidence = predictions[predictedIndex];
        setConfidence(confidence);

        if (confidence < 0.8) {
          setPrediction("Unknown");
        } else {
          const threshold = 0.7;
          if (confidence >= threshold) {
            setPrediction(classNames[predictedIndex]);
          }
        }
      });

      tf.dispose();
    }
  };

  return (
    <div className="container mx-auto max-w-lg p-10">
      <h1 className="text-xl mb-4 font-bold text-center">
        Air Pollution Prediction
      </h1>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-[550px] mb-5 object-cover rounded-xl overflow-hidden"
      ></video>
      <div className="w-full">
        <button
          className="px-6 py-4 w-full rounded-md bg-indigo-500 hover:bg-indigo-700 text-white"
          // onClick={() => setIsPredicting((prev) => !prev)}
          onClick={predictFrame}
        >
          Capture and Predict
        </button>
      </div>
      {prediction ? (
        <div
          className={clsx(
            "w-fit mx-auto my-6 px-6 py-4 rounded-md bg-gray-500 text-white",
            {
              "bg-green-500": prediction === classNames[0],
              "bg-green-700": prediction === classNames[1],
              "bg-blue-400": prediction === classNames[2],
              "bg-yellow-500": prediction === classNames[3],
              "bg-orange-500": prediction === classNames[4],
              "bg-red-500": prediction === classNames[5],
            }
          )}
        >
          <h2 className="text-center">{prediction}</h2>
          <h2 className="text-center text-sm">Akurasi: {confidence}</h2>
        </div>
      ) : null}
    </div>
  );
};

export default App;
