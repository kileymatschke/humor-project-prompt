"use client";

import { useState } from "react";
import { fors, adelia } from "../../fonts/fonts";

export type HumorFlavorCaptionGalleryItem = {
    imageId: string;
    imageUrl: string;
    captions: {
        id: string;
        content: string;
        created_datetime_utc: string | null;
    }[];
};

export default function HumorFlavorCaptionsGallery({
                                                       items,
                                                   }: {
    items: HumorFlavorCaptionGalleryItem[];
}) {
    const [isOpen, setIsOpen] = useState(false);

    const flatCaptionCards = items.flatMap((item) =>
        item.captions.map((caption) => ({
            imageId: item.imageId,
            imageUrl: item.imageUrl,
            captionId: caption.id,
            content: caption.content,
            created_datetime_utc: caption.created_datetime_utc,
        }))
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
                    background: "#111",
                    color: "white",
                    fontWeight: 700,
                    cursor: "pointer",
                }}
            >
                {isOpen ? "CLOSE CAPTIONS" : "CAPTIONS"}
            </button>

            {isOpen ? (
                <div
                    style={{
                        flexBasis: "100%",
                        padding: 24,
                        borderRadius: 20,
                        background: "rgba(255,255,255,0.9)",
                        border: "1px solid rgba(0,0,0,0.1)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
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
                        Captions
                    </h2>

                    {flatCaptionCards.length === 0 ? (
                        <p className={fors.className}>
                            No captions have been generated for this humor flavor yet.
                        </p>
                    ) : (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr",
                                gap: 20,

                                maxHeight: 300,      // 👈 controls ~10 items
                                overflowY: "auto",   // 👈 enables scrolling
                                paddingRight: 6,     // 👈 prevents scrollbar overlap
                            }}
                        >
                            {flatCaptionCards.map((card, index) => (
                                <div
                                    key={card.captionId}
                                    style={{
                                        padding: 16,
                                        borderRadius: 16,
                                        border: "1px solid rgba(0,0,0,0.12)",
                                        background: "white",
                                        display: "flex",
                                        gap: 14,
                                        alignItems: "flex-start",
                                    }}
                                >
                                    <img
                                        src={card.imageUrl}
                                        alt={`Caption ${index + 1}`}
                                        style={{
                                            width: 60,
                                            height: 60,
                                            objectFit: "cover",
                                            borderRadius: 10,
                                            border: "1px solid rgba(0,0,0,0.08)",
                                            flexShrink: 0,
                                        }}
                                    />

                                    <div
                                        style={{
                                            flex: 1,
                                            display: "grid",
                                            gap: 10,
                                            minWidth: 0,
                                        }}
                                    >
                                        <div
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
                                                    fontSize: 18,
                                                    lineHeight: 1.4,
                                                    wordBreak: "break-word",
                                                }}
                                            >
                                                {card.content}
                                            </p>
                                        </div>

                                        <div>
                                            {/*<p*/}
                                            {/*    className={fors.className}*/}
                                            {/*    style={{*/}
                                            {/*        margin: 0,*/}
                                            {/*        fontSize: 12,*/}
                                            {/*        opacity: 0.7,*/}
                                            {/*    }}*/}
                                            {/*>*/}
                                            {/*    <strong>Image ID:</strong> {card.imageId}*/}
                                            {/*</p>*/}

                                            {/*{card.created_datetime_utc ? (*/}
                                            {/*    <p*/}
                                            {/*        className={fors.className}*/}
                                            {/*        style={{*/}
                                            {/*            marginTop: 6,*/}
                                            {/*            marginBottom: 0,*/}
                                            {/*            fontSize: 12,*/}
                                            {/*            opacity: 0.7,*/}
                                            {/*        }}*/}
                                            {/*    >*/}
                                            {/*        {card.created_datetime_utc}*/}
                                            {/*    </p>*/}
                                            {/*) : null}*/}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : null}
        </>
    );
}