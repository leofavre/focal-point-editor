/**
 * Privacy notice content for LGPD compliance (English only; users may use automatic translation).
 * Last updated date is used in the UI; update when the notice changes.
 */
export const PRIVACY_LAST_UPDATED = "2025-03-02";

export const privacyContent = {
  title: "Privacy Notice",
  sections: [
    {
      heading: "Controller",
      body: "The data controller is the project author (Leonardo Favre). For questions or to exercise your rights, contact via the project repository on GitHub: leofavre/focal-point-editor.",
    },
    {
      heading: "Data we process",
      body: "On your device: the app stores locally the images you choose and their file names, plus interface preferences (aspect ratio, display options), in IndexedDB and sessionStorage. None of this data is sent to our servers. Via the site: the hosting provider (Netlify) and the font provider (Google Fonts) may log access data (IP address, URL, date and time) under their policies.",
    },
    {
      heading: "Purposes and legal basis",
      body: "Data is used to provide the focal point editor, improve and secure the service, and comply with legal obligations. The legal basis is performance of contract/service (Art. 7º, V, LGPD) and legitimate interest where applicable.",
    },
    {
      heading: "Retention",
      body: "Data on your device remains until you delete it (for example via your browser's site data settings). Access logs are retained according to Netlify's (and any other operators') policy.",
    },
    {
      heading: "Sharing",
      body: "Hosting is provided by Netlify; fonts are loaded from Google Fonts. These providers may process data in other countries. We choose services with adequate safeguards. Netlify policy: https://www.netlify.com/privacy/. Google policy: https://policies.google.com/privacy.",
    },
    {
      heading: "Your rights (Art. 18 LGPD)",
      body: "You have the right to confirmation, access, correction, anonymization, blocking or deletion of unnecessary data, portability, deletion of data processed with consent, information about sharing, and revocation of consent. To delete all data stored by this app on your device, clear the site data in your browser settings. Data stays on your device; you can export or delete it using your browser's tools.",
    },
    {
      heading: "Security",
      body: "Image and preference data stays only on your device and is not transmitted to our servers. For access to the site, we rely on Netlify's infrastructure security.",
    },
    {
      heading: "Changes",
      body: "Changes to this notice will be posted on this page with the date of the last update. Continued use of the app after changes constitutes acceptance of the updated notice.",
    },
  ],
};
