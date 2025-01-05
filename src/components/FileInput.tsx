import React, { useRef, useState } from "react";
import { InputProps } from "./types";

const FileInput: React.FC<InputProps> = ({ onPredict }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [file, setFile] = useState<File>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileValue = e.target.files?.[0];
    if (imageRef.current && fileValue) {
      setFile(fileValue);
      imageRef.current.src = URL.createObjectURL(fileValue);
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

      {file ? (
        <div className="w-full mt-4">
          <button
            className="px-6 py-4 w-full rounded-md bg-indigo-500 hover:bg-indigo-700 text-white"
            onClick={() => file && onPredict(file)}
          >
            Predict
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default FileInput;
