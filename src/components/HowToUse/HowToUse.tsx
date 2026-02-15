import readme from "../../../README.md";
import { IconCode } from "../../icons/IconCode";
import { IconMask } from "../../icons/IconMask";
import { IconReference } from "../../icons/IconReference";
import { extractHowToUseFromReadme } from "../../utils/readmeAst";
import { Content } from "./HowToUse.styled";

const iconByTitle: Record<string, React.ReactNode> = {
  "Choose an image": <IconMask />,
  "Edit the focal point": <IconReference />,
  "Grab the code": <IconCode />,
};

export const HowToUse = ({ ...rest }: Record<string, unknown>) => {
  const { title, tagline, steps } = extractHowToUseFromReadme(readme);

  return (
    <Content data-component="HowToUse" {...rest}>
      <h1>{title}</h1>
      <p>{tagline}</p>
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
