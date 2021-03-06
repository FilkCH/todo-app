const themeStorageKey = "theme";
const rootClasses = document.documentElement.classList;
const lightModeClass = "light-mode";
const darkModeClass = "dark-mode";

// Switch themes
export const themeHandler = () => {
  if (Object.values(rootClasses).includes(lightModeClass)) {
    localStorage.setItem(themeStorageKey, darkModeClass);
  } else {
    localStorage.setItem(themeStorageKey, lightModeClass);
  }
  rootClasses.toggle(lightModeClass);
};

// Set the chosen theme class
export const setTheme = () => {
  const savedTheme = localStorage.getItem(themeStorageKey);
  const userPrefLight = window.matchMedia("(prefers-color-scheme: light)");

  if (savedTheme !== darkModeClass) {
    if (savedTheme === lightModeClass || userPrefLight.matches) {
      rootClasses.add(lightModeClass);
    }
  }
};
