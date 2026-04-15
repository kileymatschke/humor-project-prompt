"use client";

import { createClient } from "../../lib/supabase/browser";
import { adelia, fors, kindergarten } from "../admin/fonts/fonts";

export default function LoginPage() {
    const supabase = createClient();

    async function signInWithGoogle() {
        const origin = window.location.origin;

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${origin}/auth/callback`,
            },
        });

        if (error) alert(error.message);
    }

    return (
        <main
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center",
                paddingTop: "120px",
            }}
        >
            <h1
                style={{
                    fontSize: "35px",
                    marginBottom: "20px",
                    textAlign: "center",
                    lineHeight: 1.6,
                }}
                className={adelia.className}
            >
                The Humor Project:
                <br />
                Prompt Chain Tool
            </h1>

            <button
                onClick={signInWithGoogle}
                style={{
                    border: "none",
                    borderRadius: 999,
                    padding: "10px 16px",
                    background: "var(--text)",
                    color: "var(--bg)",
                    fontWeight: 700,
                    fontSize: 18,
                    cursor: "pointer",
                    marginTop: 12,
                    marginBottom: 20,
                }}
                className={adelia.className}
            >
                Sign in with Google
            </button>

            <p
                style={{
                    fontSize: 16,
                    margin: 0,
                    lineHeight: 1.2,
                }}
                className={fors.className}
            >
                Superadmin or matrix admin status required for access.
            </p>

            <p
                style={{
                    fontSize: 16,
                    margin: 0,
                    lineHeight: 1.2,
                }}
                className={fors.className}
            >
                You will be redirected back to this page if access is denied.
            </p>
        </main>
    );
}