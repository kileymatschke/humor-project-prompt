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
                    border: "none",
                    borderRadius: 999,
                    padding: "10px 16px",
                    background: "#111",
                    color: "white",
                    fontWeight: 700,
                    cursor: "pointer",
                }}
            >
                DELETE
            </button>
        </form>
    );
}