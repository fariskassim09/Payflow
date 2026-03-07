import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Version check for cache busting
// This checks if a new version of the app is available and prompts the user to reload
const checkForUpdates = async () => {
  try {
    // Fetch the current index.html to check for version changes
    const response = await fetch("/index.html", {
      cache: "no-store", // Force fresh fetch, bypass cache
    });
    const html = await response.text();

    // Store the current version hash
    const currentVersion = localStorage.getItem("app-version");
    const newVersion = html.split("<!-- app-version: ")[1]?.split(" -->")[0] || new Date().getTime().toString();

    if (currentVersion && currentVersion !== newVersion) {
      // New version detected, prompt user to reload
      console.log("New version detected. Reloading app...");
      localStorage.setItem("app-version", newVersion);
      window.location.reload();
    } else if (!currentVersion) {
      // First time or version not set, store it
      localStorage.setItem("app-version", newVersion);
    }
  } catch (error) {
    console.error("Error checking for updates:", error);
  }
};

// Check for updates on app load
checkForUpdates();

// Optionally check for updates periodically (every 5 minutes)
setInterval(checkForUpdates, 5 * 60 * 1000);

createRoot(document.getElementById("root")!).render(<App />);
