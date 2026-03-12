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
    <>
      <style>{styles}</style>
      <button
        className={`y2k-theme-toggle mx-2 ${!isDark ? "light-mode-override" : ""}`}
        onClick={toggleTheme}
        aria-label="Toggle System Optics"
      >
        <span className="y2k-optics-icon y2k-blink">
          {isDark ? "☾" : "☼"}
        </span>
        <span className="y2k-optics-text">
          {isDark ? "[ SYS: VOID ]" : "[ SYS: FLARE ]"}
        </span>
      </button>
    </>
  );
}

const styles = `
  /* Base Toggle Button (Dark Mode / Void) */
  .y2k-theme-toggle {
    background: rgba(10, 10, 18, 0.6);
    border: 1px solid var(--cyan, #00e5ff);
    color: var(--cyan, #00e5ff);
    font-family: 'VT323', monospace;
    font-size: 1.1rem;
    padding: 6px 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: inset 0 0 5px rgba(0, 229, 255, 0.1);
    backdrop-filter: blur(5px);
  }

  /* Hover State for Dark Mode */
  .y2k-theme-toggle:hover {
    background: rgba(0, 229, 255, 0.15);
    box-shadow: 0 0 15px rgba(0, 229, 255, 0.4), inset 0 0 10px rgba(0, 229, 255, 0.2);
    transform: translateY(-2px);
  }

  /* Text & Icon Styling */
  .y2k-optics-text {
    text-shadow: 0 0 5px currentColor;
    letter-spacing: 1px;
    white-space: nowrap;
  }

  .y2k-optics-icon {
    font-size: 1.2rem;
    text-shadow: 0 0 8px currentColor;
  }

  /* Blinking Effect for the Icon */
  .y2k-blink {
    animation: y2k-blink-anim 2s step-end infinite;
  }

  @keyframes y2k-blink-anim {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  /* Override State (Light Mode / Flare) - Shifts to Hot Pink */
  .y2k-theme-toggle.light-mode-override {
    border-color: #ff00ff;
    color: #ff00ff;
    background: rgba(255, 0, 255, 0.05);
    box-shadow: inset 0 0 5px rgba(255, 0, 255, 0.1);
  }

  .y2k-theme-toggle.light-mode-override:hover {
    background: rgba(255, 0, 255, 0.15);
    box-shadow: 0 0 15px rgba(255, 0, 255, 0.4), inset 0 0 10px rgba(255, 0, 255, 0.2);
  }
`;