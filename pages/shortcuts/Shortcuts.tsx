import { DocPageHeader } from "@/components/DocPageLayout/DocPageHeader";
import { DocPageLayout, Kbd } from "@/components/DocPageLayout/DocPageLayout.styled";

export function ShortcutsPage() {
  const title = "Keyboard shortcuts";

  return (
    <DocPageLayout data-component="ShortcutsPage">
      <DocPageHeader title={title} />
      <p>
        Shortcuts are case insensitive and are not triggered when used with modifier keys (e.g.
        Control or Command).
      </p>
      <section>
        <h2>Editor</h2>
        <dl>
          <dt>
            <Kbd>E</Kbd>
          </dt>
          <dd>Focus the image.</dd>
          <dt>
            <Kbd>A</Kbd>
          </dt>
          <dd>Toggle the focal point overlay.</dd>
          <dt>
            <Kbd>S</Kbd>
          </dt>
          <dd>Toggle the image overflow.</dd>
          <dt>
            <Kbd>D</Kbd>
          </dt>
          <dd>Focus the aspect ratio slider.</dd>
        </dl>
      </section>
      <section>
        <h2>Code snippet</h2>
        <dl>
          <dt>
            <Kbd>F</Kbd>
          </dt>
          <dd>Open the code snippet dialog.</dd>
          <dt>
            <Kbd>C</Kbd>
          </dt>
          <dd>Copy the code snippet to the clipboard without opening the dialog.</dd>
        </dl>
      </section>
      <section>
        <h2>Image</h2>
        <dl>
          <dt>
            <Kbd>G</Kbd>, <Kbd>U</Kbd>, or <Kbd>I</Kbd>
          </dt>
          <dd>Open the file input to upload a new image.</dd>
        </dl>
      </section>
    </DocPageLayout>
  );
}
