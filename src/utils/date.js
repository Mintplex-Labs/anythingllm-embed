import i18next from "@/i18n";

/**
 * Resolves the active i18next language into a locale list that the Intl API
 * accepts. Language codes may arrive with underscores (eg: `pt_BR`) from the
 * `data-language` script attribute, so they are normalized to BCP 47 hyphens.
 * Falls back to the browser default locale when the code is missing or invalid.
 * @returns {string[]}
 */
function resolveLocale() {
  try {
    return Intl.getCanonicalLocales(i18next.language?.replace(/_/g, "-"));
  } catch (e) {
    return [];
  }
}

export function formatDate(sentAt) {
  if (!sentAt) return "";

  try {
    const date = new Date(sentAt * 1000);
    const timeString = date.toLocaleTimeString(resolveLocale(), {
      hour: "numeric",
      minute: "2-digit",
    });
    return timeString;
  } catch (e) {
    return "";
  }
}
