import type { ImageDraftState, ImageRecord, ImageState } from "../types";

const defaultBreakpoints: ImageDraftState["breakpoints"] = [
  { objectPosition: "50% 50%" },
];

export function createMockImageDraftState(
  overrides: Partial<ImageDraftState> = {},
): ImageDraftState {
  return {
    name: "test.png",
    type: "image/png",
    createdAt: 1000,
    breakpoints: defaultBreakpoints,
    ...overrides,
  };
}

export function createMockImageState(
  overrides: Partial<ImageState> = {},
): ImageState {
  return {
    ...createMockImageDraftState(overrides),
    url: "blob:http://localhost/test",
    naturalAspectRatio: 16 / 9,
    ...overrides,
  };
}

export function createMockImageRecord(
  overrides: Partial<ImageRecord> = {},
): ImageRecord {
  return {
    ...createMockImageDraftState(overrides),
    id: "mock-record-1",
    file: new Blob(["mock"], { type: "image/png" }),
    ...overrides,
  };
}
