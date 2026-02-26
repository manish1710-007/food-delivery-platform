import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // 1. Check local storage for saved preference
    const savedTheme = localStorage.getItem("app-theme");
    // 2. Check the user's OS preference
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Apply the correct theme on initial load
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.setAttribute("data-bs-theme", "dark");
    } else {
      setIsDark(false);
      document.documentElement.setAttribute("data-bs-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.setAttribute("data-bs-theme", "light");
      localStorage.setItem("app-theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.setAttribute("data-bs-theme", "dark");
      localStorage.setItem("app-theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <button
      className={`btn rounded-circle p-2 mx-2 d-flex align-items-center justify-content-center shadow-sm ${
        isDark ? "btn-dark border-secondary" : "btn-light border"
      }`}
      onClick={toggleTheme}
      style={{ width: "42px", height: "42px", transition: "all 0.3s ease" }}
      aria-label="Toggle Dark Mode"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}