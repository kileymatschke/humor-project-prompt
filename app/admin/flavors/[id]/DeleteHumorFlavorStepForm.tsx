"use client";

import { useState } from "react";
import { fors } from "../../fonts/fonts";

export default function DeleteHumorFlavorStepForm({
                                                      stepId,
                                                      stepNumber,
                                                      deleteHumorFlavorStep,
                                                  }: {
    stepId: number;
    stepNumber: number | null;
    deleteHumorFlavorStep: (formData: FormData) => Promise<void>;
}) {
    const [confirming, setConfirming] = useState(false);

    return (
        <div>
            {!confirming ? (
                <button
                    type="button"
                    onClick={() => setConfirming(true)}
                    className={fors.className}
                    style={{
                        border: "none",
                        borderRadius: 999,
                        padding: "8px 14px",
                        background: "#8b0000",
                        color: "white",
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    DELETE
                </button>
            ) : (
                <form
                    action={deleteHumorFlavorStep}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        flexWrap: "wrap",
                    }}
                >
                    <input type="hidden" name="step_id" value={stepId} />

                    <span className={fors.className}>
                        Delete Step {stepNumber ?? "—"}?
                    </span>

                    <button
                        type="submit"
                        className={fors.className}
                        style={{
                            border: "none",
                            borderRadius: 999,
                            padding: "8px 14px",
                            background: "#8b0000",
                            color: "white",
                            fontWeight: 700,
                            cursor: "pointer",
                        }}
                    >
                        YES, DELETE
                    </button>

                    <button
                        type="button"
                        onClick={() => setConfirming(false)}
                        className={fors.className}
                        style={{
                            border: "1px solid rgba(0,0,0,0.2)",
                            borderRadius: 999,
                            padding: "8px 14px",
                            background: "white",
                            color: "black",
                            fontWeight: 700,
                            cursor: "pointer",
                        }}
                    >
                        CANCEL
                    </button>
                </form>
            )}
        </div>
    );
}