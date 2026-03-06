import { StyledTitle } from "./SiteTitle.styled";
import type { SiteTitleProps } from "./types";

export function SiteTitle({
  ref,
  children = "Focal Point Editor",
  to = "/",
  ...rest
}: SiteTitleProps) {
  return (
    <StyledTitle ref={ref} data-component="SiteTitle" {...rest}>
      <a href={to} css={{ color: "inherit", textDecoration: "none" }}>
        {children}
      </a>
    </StyledTitle>
  );
}
