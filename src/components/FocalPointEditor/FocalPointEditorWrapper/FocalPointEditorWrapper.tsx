import { detectProportionalImageHeight } from "../helpers/detectRelativeImageSize";
import { Container, Content } from "./FocalPointEditorWrapper.styled";
import type { FocalPointEditorWrapperProps } from "./types";

export function FocalPointEditorWrapper({
  aspectRatio,
  cursor,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
  children,
  ...rest
}: FocalPointEditorWrapperProps) {
  return (
    <Container {...rest}>
      <Content
        css={{
          aspectRatio: aspectRatio ?? "auto",
          height: `${detectProportionalImageHeight({ aspectRatio }) ?? 0}cqmin`,
          cursor,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        {children}
      </Content>
    </Container>
  );
}
