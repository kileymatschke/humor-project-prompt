"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

function applyTheme(theme: Theme) {
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved = theme === "system" ? (systemDark ? "dark" : "light") : theme;

    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.style.colorScheme = resolved;
}

export default function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>("system");

    useEffect(() => {
        const saved = (localStorage.getItem("theme") as Theme | null) || "system";
        setTheme(saved);
        applyTheme(saved);

        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = () => {
            const current = (localStorage.getItem("theme") as Theme | null) || "system";
            if (current === "system") applyTheme("system");
        };

        media.addEventListener("change", handleChange);
        return () => media.removeEventListener("change", handleChange);
    }, []);

    function updateTheme(next: Theme) {
        setTheme(next);
        localStorage.setItem("theme", next);
        applyTheme(next);
    }

    return (
        <div style={{ display: "flex", gap: 8 }}>
            <button
                onClick={() => updateTheme("light")}
                style={{
                    border: "none",
                    borderRadius: 999,
                    padding: "10px 16px",
                    background: "var(--button)",
                    color: "var(--buttontext)",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                }}
            >
                LIGHT
            </button>


            <button
                onClick={() => updateTheme("dark")}
                style={{
                    border: "none",
                    borderRadius: 999,
                    padding: "10px 16px",
                    background: "var(--button)",
                    color: "var(--buttontext)",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                }}
            >
                DARK
            </button>

            <button
                onClick={() => updateTheme("system")}
                style={{
                    border: "none",
                    borderRadius: 999,
                    padding: "10px 16px",
                    background: "var(--button)",
                    color: "var(--buttontext)",
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: "pointer",
                }}
            >
                SYSTEM
            </button>
        </div>
    );
}