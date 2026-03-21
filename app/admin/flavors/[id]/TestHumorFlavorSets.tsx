"use client";

import { useActionState, useState } from "react";
import { fors, adelia } from "../../fonts/fonts";
import type { TestImageSet } from "./testSets";

export type TestHumorFlavorState = {
    success: boolean;
    error: string | null;
    results: {
        sourceImageUrl: string;
        imageId: string;
        captions: unknown[];
    }[];
};

const initialState: TestHumorFlavorState = {
    success: false,
    error: null,
    results: [],
};

export default function TestHumorFlavorSets({
                                                humorFlavorId,
                                                testSets,
                                                testHumorFlavorSetAction,
                                            }: {
    humorFlavorId: number;
    testSets: TestImageSet[];
    testHumorFlavorSetAction: (
        state: TestHumorFlavorState,
        formData: FormData
    ) => Promise<TestHumorFlavorState>;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSetId, setActiveSetId] = useState<string | null>(null);

    const [state, formAction, isPending] = useActionState(
        testHumorFlavorSetAction,
        initialState
    );

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={fors.className}
                style={{
                    border: "none",
                    borderRadius: 999,
                    padding: "10px 16px",
                    background: "var(--button)",
                    color: "var(--buttontext)",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                }}
            >
                {isOpen ? "CLOSE TEST" : "TEST"}
            </button>

            {isOpen ? (
                <div
                    style={{
                        flexBasis: "100%",
                        padding: 24,
                        borderRadius: 20,
                        background: "var(--bg)",
                        border: "1px solid var(--bg)",
                        boxShadow: "0 8px 24px var(--bg)",
                        marginTop: 8,
                    }}
                >
                    <h2
                        className={adelia.className}
                        style={{
                            textAlign: "left",
                            fontWeight: 700,
                            fontSize: 24,
                            marginBottom: 20,
                        }}
                    >
                        Test Image Sets
                    </h2>

                    {testSets.length === 0 ? (
                        <p className={fors.className}>No test sets available yet.</p>
                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                                gap: 16,
                                marginBottom: 24,
                            }}
                        >
                            {testSets.map((set) => (
                                <form
                                    key={set.id}
                                    action={formAction}
                                    onSubmit={() => {
                                        setActiveSetId(set.id);
                                        setIsOpen(true);
                                    }}
                                >
                                    <input
                                        type="hidden"
                                        name="humorFlavorId"
                                        value={String(humorFlavorId)}
                                    />
                                    <input
                                        type="hidden"
                                        name="imageUrls"
                                        value={JSON.stringify(set.images)}
                                    />
                                    <input type="hidden" name="setId" value={set.id} />

                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        style={{
                                            width: "100%",
                                            textAlign: "left",
                                            padding: 16,
                                            borderRadius: 16,
                                            border:
                                                activeSetId === set.id
                                                    ? "2px solid var(--text)"
                                                    : "1px solid var(--text)",
                                            background: "var(--card)",
                                            cursor: isPending ? "not-allowed" : "pointer",
                                            opacity:
                                                isPending && activeSetId !== set.id ? 0.6 : 1,
                                        }}
                                    >
                                        <div
                                            className={fors.className}
                                            style={{
                                                fontWeight: 700,
                                                fontSize: 18,
                                                marginBottom: 8,
                                                color: "var(--text)"
                                            }}
                                        >
                                            {set.label}
                                        </div>

                                        <div
                                            className={fors.className}
                                            style={{
                                                marginBottom: 12,
                                                fontSize: 14,
                                                color: "var(--text)"
                                            }}
                                        >
                                            {set.images.length} image
                                            {set.images.length === 1 ? "" : "s"}
                                        </div>

                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(3, 1fr)",
                                                gap: 6,
                                            }}
                                        >
                                            {set.images.slice(0, 6).map((imageUrl, index) => (
                                                <img
                                                    key={index}
                                                    src={imageUrl}
                                                    alt={`${set.label} preview ${index + 1}`}
                                                    style={{
                                                        width: "100%",
                                                        aspectRatio: "1 / 1",
                                                        objectFit: "cover",
                                                        borderRadius: 10,
                                                        border: "1px solid var(--text)",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </button>
                                </form>
                            ))}
                        </div>
                    )}

                    {isPending ? (
                        <p className={fors.className}>
                            Testing selected set and generating captions...
                        </p>
                    ) : null}

                    {state.error ? (
                        <p
                            className={fors.className}
                            style={{
                                color: "var(--errortext)",
                                fontWeight: 700,
                            }}
                        >
                            {state.error}
                        </p>
                    ) : null}

                    {state.results.length > 0 ? (
                        <div style={{ display: "grid", gap: 20 }}>
                            <h3
                                className={fors.className}
                                style={{
                                    margin: 0,
                                    fontWeight: 700,
                                    fontSize: 20,
                                }}
                            >
                                Results
                            </h3>

                            {state.results.map((result, index) => {
                                const uniqueCaptions = Array.from(
                                    new Map(
                                        result.captions
                                            .filter(
                                                (caption) =>
                                                    caption &&
                                                    typeof caption === "object" &&
                                                    "content" in (caption as any) &&
                                                    typeof (caption as any).content === "string"
                                            )
                                            .map((caption) => [(caption as any).content, caption])
                                    ).values()
                                );

                                return (
                                    <div
                                        key={`${result.imageId}-${index}`}
                                        style={{
                                            padding: 18,
                                            borderRadius: 16,
                                            border: "1px solid rgba(0,0,0,0.12)",
                                            background: "white",
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns: "180px 1fr",
                                                gap: 18,
                                                alignItems: "start",
                                            }}
                                        >
                                            <img
                                                src={result.sourceImageUrl}
                                                alt={`Test result ${index + 1}`}
                                                style={{
                                                    width: "100%",
                                                    borderRadius: 14,
                                                    objectFit: "cover",
                                                    border: "1px solid rgba(0,0,0,0.08)",
                                                }}
                                            />

                                            <div>
                                                <p
                                                    className={fors.className}
                                                    style={{ fontWeight: 700, marginTop: 0 }}
                                                >
                                                    Image {index + 1}
                                                </p>

                                                <p className={fors.className}>
                                                    <strong>Image ID:</strong> {result.imageId}
                                                </p>

                                                {uniqueCaptions.length === 0 ? (
                                                    <p className={fors.className}>No captions returned.</p>
                                                ) : (
                                                    <div style={{ display: "grid", gap: 10 }}>
                                                        {uniqueCaptions.map((caption, captionIndex) => (
                                                            <div
                                                                key={captionIndex}
                                                                style={{
                                                                    padding: 12,
                                                                    borderRadius: 12,
                                                                    background: "rgba(0,0,0,0.04)",
                                                                    border: "1px solid rgba(0,0,0,0.08)",
                                                                }}
                                                            >
                                                                <p
                                                                    className={fors.className}
                                                                    style={{
                                                                        margin: 0,
                                                                        fontSize: 15,
                                                                    }}
                                                                >
                                                                    {(caption as any).content}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                    ) : null}
                </div>
            ) : null}
        </>
    );
}