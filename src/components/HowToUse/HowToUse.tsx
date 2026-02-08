import { IconCode } from "../../icons/IconCode";
import { IconMask } from "../../icons/IconMask";
import { IconUpload } from "../../icons/IconUpload";
import { Content } from "./HowToUse.styled";

export const HowToUse = ({ ...rest }: Record<string, unknown>) => {
  return (
    <Content data-component="HowToUse" {...rest}>
      <h1>Focal Point Editor</h1>
      <p>Crop images in responsive layouts without losing what matters most.</p>
      <h2>Steps</h2>
      <ol>
        <li>
          <IconUpload />
          <p>Choose an image</p>
          <ul>
            <li>
              Select an image from your device. It’s kept locally, so it can be edited offline. No
              uploads.
            </li>
          </ul>
        </li>
        <li>
          <IconMask />
          <p>Mask and crop it</p>
          <ul>
            <li>
              Use the slider to set the mask aspect ratio and drag the image to control how it’s
              cropped.
            </li>
          </ul>
        </li>
        <li>
          <IconCode />
          <p>Grab the code</p>
          <ul>
            <li>
              When you’re done, copy the code to use the image in full-width banners and responsive
              layouts.
            </li>
          </ul>
        </li>
      </ol>
    </Content>
  );
};
