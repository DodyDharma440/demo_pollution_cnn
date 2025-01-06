import { useState } from "react";
import clsx from "clsx";
import { apiWeather } from "./configs/api";
import FileInput from "./components/FileInput";
import VideoInput from "./components/VideoInput";

const classNames = ["cloudy", "rain", "shine", "sunrise"];

const App = () => {
  const [prediction, setPrediction] = useState("");
  const [confidence, setConfidence] = useState(0);

  const [inputMode, setInputMode] = useState<"file" | "video">(
    (localStorage.getItem("inputMode") as "file" | "video") ?? "file"
  );

  const handlePredict = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await apiWeather.post<{
        predicted_class: string;
        confidence: number;
      }>("/weather", formData);

      setPrediction(data.predicted_class);
      setConfidence(data.confidence);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto max-w-lg p-10">
      <h1 className="text-xl mb-4 font-bold text-center">Weather Prediction</h1>

      <div className="flex items-center mb-6 gap-4">
        {["video", "file"].map((t) => {
          return (
            <button
              key={t}
              className={clsx(
                "capitalize w-full px-4 py-2 border border-indigo-500 rounded-lg",
                {
                  ["bg-indigo-500 text-white"]: t === inputMode,
                  ["bg-transparent"]: t !== inputMode,
                }
              )}
              onClick={() => {
                setInputMode(t as typeof inputMode);
                setPrediction("");
                setConfidence(0);
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
              "!bg-blue-400": prediction === classNames[2],
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
