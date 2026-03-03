import { PrivacyMeta, PrivacyPage } from "./Privacy.styled";
import { PRIVACY_LAST_UPDATED, privacyContent } from "./privacyContent";

export function Privacy() {
  const { title, sections } = privacyContent;

  return (
    <PrivacyPage data-component="PrivacyPage">
      <h1>{title}</h1>
      <PrivacyMeta>Last updated: {PRIVACY_LAST_UPDATED}</PrivacyMeta>
      {sections.map((section) => (
        <section key={section.heading}>
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
        </section>
      ))}
    </PrivacyPage>
  );
}
