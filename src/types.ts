export type ObjectPositionString = `${string}% ${string}%`;

export type ObjectPositionObject = { x: number; y: number };

export type StoredImage = {
  id: string;
  name: string;
  data: string;
  size: number;
  type: string;
  timestamp: number;
  objectPosition: ObjectPositionString;
};

export type StoredUI = {
  id: "current";
  aspectRatio: number;
  showPointMarker: boolean;
  showGhostImage: boolean;
  showCodeSnippet: boolean;
};
