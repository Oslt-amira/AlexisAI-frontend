/** Browser-level departures while Focus is enabled, independent of its timer. */
export function watchFocusDepartures(onDeparture: () => void) {
  const visibility = () => {
    if (document.hidden) onDeparture();
  };
  const blur = () => onDeparture();
  const beforeUnload = (event: BeforeUnloadEvent) => {
    onDeparture();
    event.preventDefault();
    // Browsers supply their own warning text and require prior user interaction.
    event.returnValue = "";
  };
  document.addEventListener("visibilitychange", visibility);
  window.addEventListener("blur", blur);
  window.addEventListener("beforeunload", beforeUnload);
  return () => {
    document.removeEventListener("visibilitychange", visibility);
    window.removeEventListener("blur", blur);
    window.removeEventListener("beforeunload", beforeUnload);
  };
}
