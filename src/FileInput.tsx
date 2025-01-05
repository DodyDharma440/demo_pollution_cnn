import React, { useRef } from "react";
import { InputProps } from "./types";

const FileInput: React.FC<InputProps> = ({ onPredict }) => {
  const imageRef = useRef<HTMLImageElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (imageRef.current && file) {
      imageRef.current.src = URL.createObjectURL(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        value=""
        onChange={handleChange}
        className="mb-4"
      />
      <img
        className="w-full h-[300px] mx-auto text-center object-contain"
        ref={imageRef}
      />

      <div className="w-full mt-4">
        <button
          className="px-6 py-4 w-full rounded-md bg-indigo-500 hover:bg-indigo-700 text-white"
          onClick={() => onPredict(imageRef.current)}
        >
          Capture and Predict
        </button>
      </div>
    </div>
  );
};

export default FileInput;
