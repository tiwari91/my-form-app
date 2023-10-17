export function formatDate(isoDate) {
  const date = new Date(isoDate);
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };

  return date.toLocaleString("en-US", options).replace(/,/, "");
}
