(function () {
  const storageKey = "learn-theme";
  const root = document.documentElement;
  const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)") : null;

  function storedTheme() {
    try {
      const value = window.localStorage.getItem(storageKey);
      return value === "light" || value === "dark" ? value : "";
    } catch {
      return "";
    }
  }

  function systemTheme() {
    return media && media.matches ? "light" : "dark";
  }

  function activeTheme() {
    return root.dataset.theme || storedTheme() || systemTheme();
  }

  function applyTheme(theme, persist) {
    const nextTheme = theme === "light" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;
    if (persist) {
      try {
        window.localStorage.setItem(storageKey, nextTheme);
      } catch {
        /* Ignore unavailable storage. */
      }
    }
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.setAttribute(
        "aria-label",
        nextTheme === "dark" ? "Switch to light mode" : "Switch to dark mode",
      );
      button.querySelector("[data-theme-toggle-label]").textContent =
        nextTheme === "dark" ? "Dark" : "Light";
    });
  }

  function createToggle() {
    const button = document.createElement("button");
    button.className = "theme-toggle";
    button.type = "button";
    button.dataset.themeToggle = "";
    button.innerHTML = '<span class="theme-toggle-mark" aria-hidden="true"></span><span data-theme-toggle-label></span>';
    button.addEventListener("click", () => {
      applyTheme(activeTheme() === "dark" ? "light" : "dark", true);
    });
    return button;
  }

  function installToggle() {
    if (document.querySelector("[data-theme-toggle]")) return;
    const siteNav = document.querySelector(".site-header nav");
    const deckTopbar = document.querySelector(".deck-topbar");
    const target = siteNav || deckTopbar;
    if (!target) return;
    target.appendChild(createToggle());
    applyTheme(activeTheme(), false);
  }

  applyTheme(storedTheme() || systemTheme(), false);

  if (media) {
    media.addEventListener("change", () => {
      if (!storedTheme()) applyTheme(systemTheme(), false);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installToggle);
  } else {
    installToggle();
  }
})();
