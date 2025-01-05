const classNames = [
  "a_Good",
  "b_Moderate",
  "c_Unhealthy_Activity",
  "d_Unhealthy",
  "e_Very_Unhealthy",
  "f_Severe",
];

import { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import clsx from "clsx";
import VideoInput from "./VideoInput";
import FileInput from "./FileInput";

const App = () => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState(0);

  const [inputMode, setInputMode] = useState<"file" | "video">(
    (localStorage.getItem("inputMode") as "file" | "video") ?? "file"
  );

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await tf.loadLayersModel(
        "/models2/tf_model/model.json",
        { strict: false }
      );
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  const handlePredict = async (
    element: HTMLImageElement | HTMLVideoElement | null
  ) => {
    if (element && model) {
      const imgData = tf.browser.fromPixels(element);

      const [predictedClass, confidence] = tf.tidy(() => {
        const tensorImg = imgData
          .resizeNearestNeighbor([128, 128])
          .toFloat()
          .expandDims();
        const result = model.predict(tensorImg) as tf.Tensor<tf.Rank>;

        const predictions = result.dataSync();
        console.log(
          "🚀 ~ const[predictedClass,confidence]=tf.tidy ~ predictions:",
          predictions
        );
        const predicted_index = result.as1D().argMax().dataSync()[0];

        const predictedClass = classNames[predicted_index];
        const confidence = Math.round(predictions[predicted_index] * 100);

        return [predictedClass, confidence];
      });

      setPrediction(predictedClass);
      setConfidence(confidence);
    }
  };

  return (
    <div className="container mx-auto max-w-lg p-10">
      <h1 className="text-xl mb-4 font-bold text-center">
        Air Pollution Prediction
      </h1>

      <div className="flex items-center mb-6 gap-4">
        {["video", "file"].map((t) => {
          return (
            <button
              className={clsx(
                "capitalize w-full px-4 py-2 border border-indigo-500 rounded-lg",
                {
                  ["bg-indigo-500 text-white"]: t === inputMode,
                  ["bg-transparent"]: t !== inputMode,
                }
              )}
              onClick={() => {
                setInputMode(t as typeof inputMode);
                localStorage.setItem("inputMode", t);
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      {inputMode === "video" ? <VideoInput onPredict={handlePredict} /> : null}
      {inputMode === "file" ? <FileInput onPredict={handlePredict} /> : null}

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
          {prediction === "Unknown" ? null : (
            <h2 className="text-center text-sm">Akurasi: {confidence}</h2>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default App;
