export function openExternal(url: string) {
  const popup = window.open(url, "_blank");
  if (popup) popup.opener = null;
  else window.location.href = url;
}
