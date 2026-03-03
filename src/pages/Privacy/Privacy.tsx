import toast from "react-hot-toast";
import { Button } from "../../components/Button/Button";
import { IconClear } from "../../icons/IconClear";
import { DBConfig } from "../../services/databaseConfig";
import { PrivacyLayout, PrivacyMeta } from "./Privacy.styled";

const PRIVACY_LAST_UPDATED = "2025-03-02" as const;

export function PrivacyPage() {
  const title = "Privacy Notice";

  const handleClearAllData = () => {
    if (
      !window.confirm("Clear all data stored by this app in your browser? This cannot be undone.")
    ) {
      return;
    }

    if (typeof indexedDB === "undefined") {
      toast.success("Stored data cleared.");
      return;
    }

    const request = indexedDB.open(DBConfig.name, DBConfig.version);

    request.onsuccess = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains("images")) {
        db.close();
        toast.success("Stored data cleared.");
        return;
      }

      const transaction = db.transaction("images", "readwrite");
      const store = transaction.objectStore("images");
      store.clear();

      transaction.oncomplete = () => {
        db.close();
        toast.success("Stored data cleared.");
      };

      transaction.onerror = () => {
        db.close();
        toast.error("Could not clear stored data. Please try again.");
      };
    };

    request.onerror = () => {
      toast.error("Could not clear stored data. Please try again.");
    };

    request.onupgradeneeded = () => {
      request.transaction?.abort();
      toast.error("Could not clear stored data. Please try again.");
    };
  };

  return (
    <PrivacyLayout data-component="PrivacyPage">
      <h1>{title}</h1>
      <PrivacyMeta>Last updated: {PRIVACY_LAST_UPDATED}</PrivacyMeta>
      <section>
        <h2>Controller</h2>
        <p>
          The data controller is the project author (Leonardo Favre). For questions or to exercise
          your rights, contact via the project repository on GitHub: leofavre/focal-point-editor.
        </p>
      </section>
      <section>
        <h2>Data we process</h2>
        <p>
          On your device: the app stores locally the images you choose and their file names, plus
          interface preferences (aspect ratio, display options), in IndexedDB and sessionStorage.
          None of this data is sent to our servers. Via the site: the hosting provider (Netlify) and
          the font provider (Google Fonts) may log access data (IP address, URL, date and time)
          under their policies.
        </p>
      </section>
      <section>
        <h2>Purposes and legal basis</h2>
        <p>
          Data is used to provide the focal point editor, improve and secure the service, and comply
          with legal obligations. The legal basis is performance of a contract (GDPR Art. 6(1)(b))
          and legitimate interest where applicable (Art. 6(1)(f)).
        </p>
      </section>
      <section>
        <h2>Retention</h2>
        <p>
          Data on your device remains until you delete it (for example via your browser&apos;s site
          data settings). Access logs are retained according to Netlify&apos;s (and any other
          operators&apos;) policy.
        </p>
      </section>
      <section>
        <h2>Sharing</h2>
        <p>
          Hosting is provided by Netlify; fonts are loaded from Google Fonts. These providers may
          process data in other countries. We choose services with adequate safeguards. Netlify
          policy:{" "}
          <a href="https://www.netlify.com/privacy/" target="_blank" rel="noreferrer">
            https://www.netlify.com/privacy/
          </a>
          . Google policy:{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
            https://policies.google.com/privacy
          </a>
          .
        </p>
      </section>
      <section>
        <h2>Your rights (GDPR Arts 15–22)</h2>
        <p>
          You have the right of access, rectification, erasure, restriction of processing, data
          portability, and to object, as well as the right to withdraw consent and to lodge a
          complaint with a supervisory authority. To delete all data stored by this app on your
          device, clear the site data in your browser settings. Data stays on your device; you can
          export or delete it using your browser&apos;s tools.
        </p>
      </section>
      <section>
        <h2>Security</h2>
        <p>
          Image and preference data stays only on your device and is not transmitted to our servers.
          For access to the site, we rely on Netlify&apos;s infrastructure security.
        </p>
      </section>
      <section>
        <h2>Changes</h2>
        <p>
          Changes to this notice will be posted on this page with the date of the last update.
          Continued use of the app after changes constitutes acceptance of the updated notice.
        </p>
      </section>
      <section>
        <h2>Clear all stored data</h2>
        <p>
          Use this button to delete all data that this app has stored in your browser&apos;s
          IndexedDB database and session storage for local images and preferences. You can also
          clear site data from your browser settings at any time.
        </p>
        <Button
          type="button"
          onClick={handleClearAllData}
          aria-label="Clear all data stored by this app in the browser"
          css={{ maxWidth: "35ch" }}
        >
          <IconClear />
          <Button.ButtonText>Clear all data</Button.ButtonText>
        </Button>
      </section>
    </PrivacyLayout>
  );
}
