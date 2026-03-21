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
        {/* apply theme ASAP */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />

        {/* 🌙 toggle in top-right */}
        <div
            style={{
                position: "fixed",
                top: 20,
                right: 20,
                zIndex: 9999,
            }}
        >
            <ThemeToggle />
        </div>

        {children}
        </body>
        </html>
    );
}

// export default function RootLayout({
//                                        children,
//                                    }: {
//     children: React.ReactNode
// }) {
//     return (
//         <html>
//         <body>{children}</body>
//         </html>
//     )
// }