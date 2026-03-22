"use client";

export default function DeleteHumorFlavorStepForm({
                                                      stepId,
                                                      stepNumber,
                                                      deleteHumorFlavorStep,
                                                  }: {
    stepId: number;
    stepNumber: number | string;
    deleteHumorFlavorStep: (formData: FormData) => void | Promise<void>;
}) {
    return (
        <form
            action={deleteHumorFlavorStep}
            onSubmit={(e) => {
                const confirmed = window.confirm(
                    `Are you sure you want to delete Step ${stepNumber}?`
                );

                if (!confirmed) {
                    e.preventDefault();
                }
            }}
            style={{ margin: 0, flexShrink: 0 }}
        >
            <input type="hidden" name="stepId" value={stepId} />
            <button
                type="submit"
                style={{
                    width: 28,
                    height: 28,
                    borderRadius: 9999,
                    border: "1px solid var(--bg)",
                    background: "var(--bg)",
                    cursor: "pointer",
                    fontWeight: 700,
                    lineHeight: 1,
                }}
                aria-label={`Delete Step ${stepNumber}`}
                title={`Delete Step ${stepNumber}`}
            >
                ×
            </button>
        </form>
    );
}