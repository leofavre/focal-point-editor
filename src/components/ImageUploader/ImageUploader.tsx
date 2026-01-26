import type { ImageUploaderProps } from "./types";

export function ImageUploader({ ref, onFormSubmit, onImageChange }: ImageUploaderProps) {
  return (
    <form className="image-uploader" onSubmit={onFormSubmit} noValidate>
      <label className="label" htmlFor="image-upload">
        Upload Image
      </label>
      <input
        ref={ref}
        className="control"
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={onImageChange}
        required
      />
      <p className="help-text">Only image files are allowed (e.g., PNG, JPEG, GIF, WebP)</p>
    </form>
  );
}
