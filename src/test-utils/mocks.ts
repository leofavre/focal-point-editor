import type { ImageDraftState, ImageId, ImageRecord, ImageState } from "../types";

const defaultBreakpoints: ImageDraftState["breakpoints"] = [{ objectPosition: "50% 50%" }];

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

export function createMockImageState(overrides: Partial<ImageState> = {}): ImageState {
  return {
    ...createMockImageDraftState(overrides),
    url: "blob:http://localhost/test",
    naturalAspectRatio: 16 / 9,
    ...overrides,
  };
}

type createMockImageRecordOverrides = Omit<Partial<ImageRecord>, "id"> & { id?: string };

export function createMockImageRecord({
  id,
  ...overrides
}: createMockImageRecordOverrides = {}): ImageRecord {
  const typedId = (id ?? "mock-record-1") as ImageId;

  return {
    ...createMockImageDraftState(overrides),
    id: typedId,
    file: new Blob(["mock"], { type: "image/png" }),
    ...overrides,
  };
}
