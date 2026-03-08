import { useEffect, useRef } from "react";
import { Toaster, useToasterStore } from "react-hot-toast";
import { BACKDROP_HIDE_DELAY_MS } from "@/src/hooks/useClosingTransition";
import { Wrapper } from "./ToasterInPopover.styled";

export function ToasterInPopover() {
  const popoverRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toasts } = useToasterStore();

  useEffect(() => {
    if (popoverRef.current == null) return;

    if (toasts.length > 0) {
      if (hideTimeoutRef.current != null) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      popoverRef.current.showPopover();
    } else {
      hideTimeoutRef.current = setTimeout(() => {
        hideTimeoutRef.current = null;
        popoverRef.current?.hidePopover();
      }, BACKDROP_HIDE_DELAY_MS);
    }

    return () => {
      if (hideTimeoutRef.current != null) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };
  }, [toasts.length]);

  return (
    <Wrapper ref={popoverRef} popover="manual">
      <Toaster
        position="top-center"
        toastOptions={{
          style: { borderRadius: 0 },
          success: {
            iconTheme: {
              primary: "var(--color-toast-success)",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "var(--color-toast-error)",
              secondary: "#fff",
            },
          },
        }}
      />
    </Wrapper>
  );
}
