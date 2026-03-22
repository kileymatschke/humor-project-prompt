"use client";
import { createClient } from "../../../lib/supabase/browser";
import { adelia } from "../fonts/fonts";

export default function SignOutButton() {
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
    };

    return (
        <button
            onClick={handleSignOut}
            className={adelia.className}
            style={{
                border: "none",
                borderRadius: 999,
                padding: "10px 16px",
                background: "var(--text)",
                color: "var(--bg)",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                marginTop: "16px"
            }}

        >
            Sign Out
        </button>
    );
}