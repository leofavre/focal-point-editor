import { IconCode } from "../../icons/IconCode";
import { IconMask } from "../../icons/IconMask";
import { IconReference } from "../../icons/IconReference";
import { Content } from "./HowToUse.styled";

const iconByTitle: Record<string, React.ReactNode> = {
  "Choose an image": <IconMask />,
  "Edit the focal point": <IconReference />,
  "Grab the code": <IconCode />,
};

const steps = [
  {
    title: "Choose an image",
    detail:
      "Select an image from your device. It's kept locally, so it can be edited offline. No uploads.",
  },
  {
    title: "Edit the focal point",
    detail:
      "Drag slider to test how the image adapts to different aspect ratios. Set a focal point to keep important areas visible as the container changes.",
  },
  {
    title: "Grab the code",
    detail:
      "The tool calculates the CSS object-position for your image. Copy the code to use it in full-width banners, hero sections and responsive layouts.",
  },
];

export const HowToUse = ({ ...rest }: Record<string, unknown>) => {
  return (
    <Content data-component="HowToUse" {...rest}>
      <h1>Focal Point Editor</h1>
      <p>Crop images in responsive layouts without losing what matters most.</p>
      <h2>Steps</h2>
      <ol>
        {steps.map((step) => (
          <li key={step.title}>
            {iconByTitle[step.title]}
            <p>{step.title}</p>
            <ul>
              <li>{step.detail}</li>
            </ul>
          </li>
        ))}
      </ol>
    </Content>
  );
};
