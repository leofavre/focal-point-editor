import { IconAdd } from "../../icons/IconAdd";
import { IconCode } from "../../icons/IconCode";
import { IconReference } from "../../icons/IconReference";
import { Content } from "./HowToUse.styled";

export const HowToUse = ({ ...rest }: Record<string, unknown>) => {
  return (
    <Content data-component="HowToUse" {...rest}>
      <h1>Focal Point Editor</h1>
      <p>Crop images in responsive layouts without losing what matters most.</p>
      <h2>Steps</h2>
      <ol>
        <li>
          <IconAdd />
          <p>Choose an image</p>
          <ul>
            <li>
              Select an image from your device. It&apos;s kept locally, so it can be edited offline.
              No uploads.
            </li>
          </ul>
        </li>
        <li>
          <IconReference />
          <p>Edit the focal point</p>
          <ul>
            <li>
              Drag slider to test how the image adapts to different aspect ratios. Set a focal point
              to keep important areas visible as the container changes.
            </li>
          </ul>
        </li>
        <li>
          <IconCode />
          <p>Grab the code</p>
          <ul>
            <li>
              The tool calculates the CSS object-position for your image. Copy the code to use it in
              full-width banners, hero sections and responsive layouts.
            </li>
          </ul>
        </li>
      </ol>
    </Content>
  );
};
