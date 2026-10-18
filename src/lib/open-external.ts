export function openExternal(url: string) {
  const popup = window.open(url, "_blank");
  if (popup) popup.opener = null;
  else window.location.href = url;
}

export function isDesktopPointer() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
