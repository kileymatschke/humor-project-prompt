"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { fors } from "../../fonts/fonts";

function SaveButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            className={fors.className}
            disabled={pending}
            style={{
                padding: "12px 18px",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.12)",
                background: pending ? "var(--button)" : "var(--button)",
                color: "var(--buttontext)",
                fontWeight: 700,
                fontSize: 14,
                cursor: pending ? "not-allowed" : "pointer",
                boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
            }}
        >
            {pending ? "Saving..." : "Save"}
        </button>
    );
}

export default function EditHumorFlavorForm({
                                                slug,
                                                description,
                                                updateHumorFlavor,
                                            }: {
    slug: string | null;
    description: string | null;
    updateHumorFlavor: (formData: FormData) => Promise<void>;
}) {
    const [isEditing, setIsEditing] = useState(false);

    if (!isEditing) {
        return (
            <button
                type="button"
                onClick={() => setIsEditing(true)}
                className={fors.className}
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
                EDIT
            </button>
        );
    }

    return (
        <div
            style={{
                marginBottom: 16,
                padding: 24,
                borderRadius: 20,
                background: "rgba(255,255,255,0.92)",
                border: "1px solid rgba(0,0,0,0.1)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                boxSizing: "border-box",
            }}
        >
            <form action={updateHumorFlavor}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                    }}
                >
                    <div>
                        <label
                            className={fors.className}
                            style={{
                                display: "block",
                                marginBottom: 8,
                                fontWeight: 700,
                            }}
                        >
                            Slug
                        </label>
                        <input
                            name="slug"
                            defaultValue={slug ?? ""}
                            required
                            className={fors.className}
                            style={{
                                width: "100%",
                                padding: "14px 16px",
                                borderRadius: 14,
                                border: "1px solid rgba(0,0,0,0.15)",
                                fontSize: "1rem",
                                background: "white",
                                boxSizing: "border-box",
                            }}
                        />
                    </div>

                    <div>
                        <label
                            className={fors.className}
                            style={{
                                display: "block",
                                marginBottom: 8,
                                fontWeight: 700,
                            }}
                        >
                            Description
                        </label>
                        <textarea
                            name="description"
                            defaultValue={description ?? ""}
                            required
                            rows={4}
                            className={fors.className}
                            style={{
                                width: "100%",
                                padding: "14px 16px",
                                borderRadius: 14,
                                border: "1px solid rgba(0,0,0,0.15)",
                                fontSize: "1rem",
                                background: "white",
                                boxSizing: "border-box",
                                resize: "vertical",
                            }}
                        />
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: 12,
                            justifyContent: "flex-end",
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className={fors.className}
                            style={{
                                padding: "12px 18px",
                                borderRadius: 12,
                                border: "1px solid rgba(0,0,0,0.12)",
                                background: "var(--buttontext)",
                                color: "var(--button)",
                                fontWeight: 700,
                                fontSize: 14,
                                cursor: "pointer",
                            }}
                        >
                            Cancel
                        </button>

                        <SaveButton />
                    </div>
                </div>
            </form>
        </div>
    );
}