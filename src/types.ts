import { Tensor3D } from "@tensorflow/tfjs";

export type InputProps = {
  onPredict: (
    element: HTMLVideoElement | HTMLImageElement | null,
    tensor3d?: Tensor3D
  ) => void;
};
