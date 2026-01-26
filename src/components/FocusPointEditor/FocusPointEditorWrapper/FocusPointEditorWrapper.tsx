import styled from "@emotion/styled";
import { detectProportionalImageHeight } from "../helpers/detectRelativeImageSize";
import type { FocusPointEditorWrapperProps } from "./types";

const FocusPointEditorContainer = styled.div`
  container-type: size;
  isolation: isolate;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FocusPointEditorContent = styled.div`
  position: relative;
  touch-action: none;
  user-select: none;
`;

export function FocusPointEditorWrapper({
  aspectRatio,
  cursor,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  children,
  ...rest
}: FocusPointEditorWrapperProps) {
  return (
    <FocusPointEditorContainer {...rest}>
      <FocusPointEditorContent
        css={{
          aspectRatio: aspectRatio ?? "auto",
          height: `${detectProportionalImageHeight({ aspectRatio }) ?? 0}cqmin`,
          cursor,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
        {children}
      </FocusPointEditorContent>
    </FocusPointEditorContainer>
  );
}
