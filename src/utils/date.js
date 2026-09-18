import i18next from "@/i18n";

export function formatDate(sentAt) {
  if (!sentAt) return "";

  try {
    const date = new Date(sentAt * 1000);
    const timeString = date.toLocaleTimeString(i18next.language, {
      hour: "numeric",
      minute: "2-digit",
    });
    return timeString;
  } catch (e) {
    return "";
  }
}
