"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { fors } from "../fonts/fonts";

type HumorFlavor = {
    id: number | string | null;
    slug: string | null;
    description: string | null;
};

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            className={fors.className}
            disabled={pending}
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
            {pending ? "Creating..." : "Submit"}
        </button>
    );
}

export default function HumorFlavorsClient({
                                               rows,
                                               createHumorFlavor,
                                           }: {
    rows: HumorFlavor[];
    createHumorFlavor: (formData: FormData) => Promise<void>;
}) {
    const [search, setSearch] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);

    const filteredRows = useMemo(() => {
        const query = search.toLowerCase().trim();

        if (!query) return rows;

        return rows.filter((row) => {
            const slug = String(row.slug ?? "").toLowerCase();
            const description = String(row.description ?? "").toLowerCase();

            return slug.includes(query) || description.includes(query);
        });
    }, [rows, search]);

    return (
        <>
            <div
                style={{
                    width: "100%",
                    maxWidth: 1200,
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: 24,
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "flex-start",
                }}
            >
                <button
                    type="button"
                    onClick={() => setShowCreateForm(true)}
                    className={fors.className}
                    style={{
                        border: "none",
                        borderRadius: 999,
                        padding: "10px 16px",
                        background: "var(--button)",
                        color: "var(--buttontext)",
                        fontWeight: 1000,
                        fontSize: 14,
                        cursor: "pointer",
                    }}
                >
                    + CREATE
                </button>
            </div>

            {showCreateForm && (
                <div
                    style={{
                        width: "100%",
                        maxWidth: 1200,
                        marginLeft: "auto",
                        marginRight: "auto",
                        marginBottom: 16,
                        padding: 24,
                        borderRadius: 20,
                        background: "var(--field)",
                        border: "1px solid var(--bg)",
                        boxShadow: "0 8px 24px var(--bg)",
                        boxSizing: "border-box",
                    }}
                >
                    <form action={createHumorFlavor}>
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
                                    required
                                    className={fors.className}
                                    style={{
                                        width: "100%",
                                        padding: "14px 16px",
                                        borderRadius: 14,
                                        border: "1px solid var(--bg)",
                                        fontSize: "1rem",
                                        background: "var(--card)",
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
                                    required
                                    rows={4}
                                    className={fors.className}
                                    style={{
                                        width: "100%",
                                        padding: "14px 16px",
                                        borderRadius: 14,
                                        border: "1px solid var(--bg)",
                                        fontSize: 18,
                                        background: "var(--card)",
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
                                    onClick={() => setShowCreateForm(false)}
                                    className={fors.className}
                                    style={{
                                        border: "none",
                                        borderRadius: 999,
                                        padding: "10px 16px",
                                        background: "var(--buttontext)",
                                        color: "var(--button)",
                                        fontWeight: 700,
                                        fontSize: 14,
                                        cursor: "pointer",
                                    }}
                                >
                                    Cancel
                                </button>

                                <SubmitButton />
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div
                style={{
                    marginTop: 0,
                    padding: 24,
                    borderRadius: 20,
                    background: "var(--allflavorsbg)",
                    border: "1px solid var(--bg)",
                    width: "100%",
                    maxWidth: 1200,
                    marginLeft: "auto",
                    marginRight: "auto",
                    boxSizing: "border-box",
                }}
            >
                <div style={{ marginBottom: 24 }}>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search humor flavors..."
                        className={fors.className}
                        style={{
                            width: "100%",
                            padding: "14px 16px",
                            borderRadius: 14,
                            border: "1px solid var(--bg)",
                            fontSize: 18,
                            background: "var(--card)",
                            boxSizing: "border-box",
                            color: "var(--text)"
                        }}
                    />
                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: 16,
                    }}
                >
                    {filteredRows.map((row, i) => (
                        <Link
                            key={i}
                            href={`/admin/flavors/${row.id}`}
                            style={{
                                textDecoration: "none",
                                color: "inherit",
                            }}
                        >
                            <div
                                className={fors.className}
                                style={{
                                    position: "relative",
                                    padding: "20px 16px 16px 16px",
                                    borderRadius: "16px",
                                    background: "var(--card)",
                                    border: "1px solid var(--bg)",
                                    minHeight: 140,
                                    boxSizing: "border-box",
                                    cursor: "pointer",
                                    transition:
                                        "transform 0.15s ease, box-shadow 0.15s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                    e.currentTarget.style.boxShadow =
                                        "0 8px 18px var(--allflavorsbg)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "translateY(0)";
                                    e.currentTarget.style.boxShadow =
                                        "0 4px 10px var(--allflavorsbg)";
                                }}
                            >
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 10,
                                        left: 12,
                                        fontSize: "0.9rem",
                                        fontWeight: 700,
                                        opacity: 0.7,
                                    }}
                                >
                                    {row.id ?? "—"}
                                </div>

                                <div
                                    style={{
                                        textAlign: "center",
                                        fontWeight: 700,
                                        fontSize: "1.05rem",
                                        marginTop: 12,
                                        marginBottom: 10,
                                    }}
                                >
                                    {row.slug ?? "—"}
                                </div>

                                <div
                                    style={{
                                        fontSize: "0.95rem",
                                        lineHeight: 1.5,
                                        textAlign: "center",
                                        opacity: 0.85,
                                    }}
                                >
                                    {row.description ?? "—"}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredRows.length === 0 && (
                    <p
                        className={fors.className}
                        style={{
                            marginTop: 20,
                            textAlign: "center",
                            opacity: 0.7,
                        }}
                    >
                        No humor flavors found.
                    </p>
                )}
            </div>
        </>
    );
}