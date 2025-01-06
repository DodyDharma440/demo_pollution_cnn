import React, { useRef, useState } from "react";
import { InputProps } from "../types/types";
import Dropzone from "react-dropzone";
import clsx from "clsx";

const FileInput: React.FC<InputProps> = ({ onPredict }) => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [file, setFile] = useState<File>();

  const handleChange = (files: File[]) => {
    console.log("🚀 ~ handleChange ~ files:", files);
    const fileValue = files[0];
    if (imageRef.current && fileValue) {
      setFile(fileValue);
      imageRef.current.src = URL.createObjectURL(fileValue);
    }
  };

  return (
    <div>
      <Dropzone
        accept={{
          "image/*": [],
        }}
        onDrop={handleChange}
        useFsAccessApi={false}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div
              {...getRootProps()}
              className="flex mb-4 rounded-lg bg-gray-50 cursor-pointer items-center justify-center border border-dashed border-gray-300 h-[200px]"
            >
              <input {...getInputProps()} />
              <p className="max-w-[200px] text-center text-gray-500">
                Drag 'n' drop some files here, or click to select files
              </p>
            </div>
          </section>
        )}
      </Dropzone>
      {/* <input
        type="file"
        accept="image/*"
        value=""
        onChange={handleChange}
        className="mb-4"
      /> */}

      <img
        className={clsx(
          "w-full h-[300px] mx-auto text-center object-contain rounded-lg",
          {
            ["block"]: Boolean(file),
            ["hidden"]: !file,
          }
        )}
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
