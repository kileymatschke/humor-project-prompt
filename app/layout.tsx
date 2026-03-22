import "./globals.css";
import ThemeToggle from "./admin/components/ThemeToggle";

const themeScript = `
(function () {
  try {
    const saved = localStorage.getItem("theme") || "system";
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved = saved === "system" ? (systemDark ? "dark" : "light") : saved;

    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.style.colorScheme = resolved;
  } catch (e) {}
})();
`;

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />

        <div
            style={{
                maxWidth: 900,
                margin: "0 auto",
                padding: 24,
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: 12,
                }}
            >
                <ThemeToggle />
            </div>

            {children}
        </div>
        </body>
        </html>
    );
}