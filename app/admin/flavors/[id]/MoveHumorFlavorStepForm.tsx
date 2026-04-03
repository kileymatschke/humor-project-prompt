"use client";

export default function MoveHumorFlavorStepForm({
                                                    stepId,
                                                    stepNumber,
                                                    moveHumorFlavorStepAction,
                                                }: {
    stepId: number;
    stepNumber: number | null;
    moveHumorFlavorStepAction: (formData: FormData) => Promise<void>;
}) {
    return (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <form action={moveHumorFlavorStepAction} style={{ margin: 0 }}>
                <input type="hidden" name="stepId" value={stepId} />
                <input type="hidden" name="direction" value="up" />
                <button
                    type="submit"
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 999,
                        border: "1px solid var(--bg)",
                        background: "var(--bg)",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "16px"
                    }}
                    aria-label={`Move Step ${stepNumber ?? "—"} up`}
                    title={`Move Step ${stepNumber ?? "—"} up`}
                >
                    ↑
                </button>
            </form>

            <form action={moveHumorFlavorStepAction} style={{ margin: 0 }}>
                <input type="hidden" name="stepId" value={stepId} />
                <input type="hidden" name="direction" value="down" />
                <button
                    type="submit"
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 999,
                        border: "1px solid var(--bg)",
                        background: "var(--bg)",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "16px"
                    }}
                    aria-label={`Move Step ${stepNumber ?? "—"} down`}
                    title={`Move Step ${stepNumber ?? "—"} down`}
                >
                    ↓
                </button>
            </form>
        </div>
    );
}