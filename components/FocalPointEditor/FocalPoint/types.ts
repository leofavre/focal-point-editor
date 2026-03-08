import type { ObjectPositionString } from "@/src/types";

export type FocalPointProps = {
  onObjectPositionChange: (objectPosition: ObjectPositionString) => void;
  objectPositionX: number;
  objectPositionY: number;
};
