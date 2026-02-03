import styled from "@emotion/styled";

export const Container = styled.div`
  container-type: size;
  container-name: image-uploader;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #f5f7fa;
  border-radius: 0.5rem;
  border: 2px dashed #e2e8f0;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
  cursor: pointer;
  box-sizing: border-box;
  height: 100%;

  * {
    cursor: pointer;
  }

  &[data-drag-over] {
    background-color: #edf2f7;
    border-color: #cbd5e0;
  }

  @container image-uploader (max-inline-size: 40rem) {
    padding: 0;
  }
`;

export const DropZone = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
`;

export const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0aec0;

  @container image-uploader (max-inline-size: 40rem) {
    display: none;
  }
`;

export const InstructionText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  text-align: center;

  @container image-uploader (max-inline-size: 40rem) {
    display: none;
  }
`;

export const OrDivider = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #4a5568;

  @container image-uploader (max-inline-size: 40rem) {
    display: none;
  }
`;

export const BrowseButton = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background-color: #4285f4;
  border: none;
  border-radius: 0.375rem;
  transition: background-color 0.15s ease;
  width: 12ch;

  &:hover {
    background-color: #3367d6;
  }
`;

export const HiddenControl = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
`;
