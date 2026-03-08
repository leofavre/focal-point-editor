import type { PropsWithChildren } from "react";
import { ToasterInPopover } from "@/components/ToasterInPopover/ToasterInPopover";
import { AppContext } from "@/src/AppContext";
import { IndexedDBServiceRoot } from "@/src/services/IndexedDBServiceRoot";
import SharedLayout from "./(layout)/Layout";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <ToasterInPopover />
      <IndexedDBServiceRoot>
        <AppContext>
          <SharedLayout>{children}</SharedLayout>
        </AppContext>
      </IndexedDBServiceRoot>
    </>
  );
}
