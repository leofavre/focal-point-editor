import styled from "@emotion/styled";

/**
 * Wrapper for the toast Toaster. When used as a popover (top-layer), overrides
 * UA styles so no visible box or backdrop is shown—only the toasts.
 */
export const Wrapper = styled.div`
  &[popover] {
    background: transparent;
    border: none;
    padding: 0;
    margin: 0;
    overflow: visible;
    box-shadow: none;
  }

  &[popover]::backdrop {
    background: transparent;
  }
`;
