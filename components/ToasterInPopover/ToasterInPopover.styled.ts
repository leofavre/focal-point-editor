import styled from "@emotion/styled";

/**
 * Wrapper for the toast Toaster. When used as a popover (top-layer), overrides
 * UA styles so no visible box or backdrop is shown—only the toasts.
 */
export const Wrapper = styled.div`
  top: 0;
  left: 50%;
  transform: translate(-50%, calc(var(--position) * 100% + (var(--position) + 1) * var(--base-line-05x)));
  transition: transform 132ms ease-in-out;
  text-wrap: balance;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  overflow: visible;
  box-shadow: none;

  &::backdrop {
    background: transparent;
  }

  &[data-dismissed] {
    transform: translate(-50%, -150%);
  }

  > div {
    padding: var(--base-line-025x);
    padding-inline-start: var(--base-line-05x);
    min-height: 5ch;
  }
`;
