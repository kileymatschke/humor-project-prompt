"use client";

import { fors } from "../../fonts/fonts";

export default function DeleteHumorFlavorForm({
                                                  deleteHumorFlavor,
                                                  slug,
                                              }: {
    deleteHumorFlavor: () => Promise<void>;
    slug: string | null;
}) {
    return (
        <form
            action={deleteHumorFlavor}
            onSubmit={(e) => {
                const confirmed = confirm(
                    `Are you sure you want to delete "${slug ?? "this humor flavor"}"? This cannot be undone.`
                );

                if (!confirmed) {
                    e.preventDefault();
                }
            }}
        >
            <button
                type="submit"
                className={fors.className}
                style={{
                    padding: "12px 18px",
                    borderRadius: 12,
                    border: "1px solid rgba(0,0,0,0.12)",
                    background: "white",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                }}
            >
                - DELETE
            </button>
        </form>
    );
}