import { IconBack } from "@/src/icons/IconBack";
import { DocPageBackButton, DocPageHeader as DocPageHeaderStyled } from "./DocPageLayout.styled";

type DocPageHeaderProps = {
  title: string;
};

export function DocPageHeader({ title }: DocPageHeaderProps) {
  return (
    <DocPageHeaderStyled>
      <DocPageBackButton
        type="button"
        onClick={() => window.history.back()}
        aria-label="Back to previous page"
      >
        <IconBack />
      </DocPageBackButton>
      <h1>{title}</h1>
    </DocPageHeaderStyled>
  );
}
