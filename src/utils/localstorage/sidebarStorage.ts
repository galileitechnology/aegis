export function getSidebarState(): boolean {
  if (typeof window !== "undefined") {
    return localStorage.getItem("sidebar-open") === "true";
  }
  return false;
}

export function setSidebarState(isOpen: boolean): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("sidebar-open", JSON.stringify(isOpen));
  }
}
