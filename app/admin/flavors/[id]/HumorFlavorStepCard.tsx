"use client";

import { useState } from "react";
import { fors } from "../../fonts/fonts";
import EditHumorFlavorStepForm from "./EditHumorFlavorStepForm";
import DeleteHumorFlavorStepForm from "./DeleteHumorFlavorStepForm";

type StepCardData = {
    id: number;
    order_by: number | null;
    step_type_label: string;
    input_type_value: string;
    output_type_value: string;
    llm_model_value: string;
    step_type_value: string;
    temperature: string;
    system_prompt: string;
    user_prompt: string;
    description: string;
};

export default function HumorFlavorStepCard({
                                                step,
                                                updateHumorFlavorStep,
                                                deleteHumorFlavorStep,
                                            }: {
    step: StepCardData;
    updateHumorFlavorStep: (formData: FormData) => Promise<void>;
    deleteHumorFlavorStep: (formData: FormData) => Promise<void>;
}) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            style={{
                padding: 18,
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.08)",
                background: "rgba(255,255,255,0.82)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                    flexWrap: "wrap",
                    marginBottom: 12,
                }}
            >
                <div>
                    <p
                        className={fors.className}
                        style={{ fontWeight: 700, margin: 0, marginBottom: 4 }}
                    >
                        Step {step.order_by ?? "—"}
                    </p>
                    <p className={fors.className} style={{ margin: 0 }}>
                        {step.step_type_label}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsExpanded((prev) => !prev)}
                    className={fors.className}
                    style={{
                        border: "none",
                        borderRadius: 999,
                        padding: "8px 14px",
                        background: "black",
                        color: "white",
                        fontWeight: 700,
                        cursor: "pointer",
                    }}
                >
                    {isExpanded ? "Collapse" : "Expand"}
                </button>
            </div>

            {isExpanded && (
                <div style={{ marginBottom: 14 }}>
                    <div style={{ marginBottom: 14 }}>
                        <p className={fors.className} style={{ fontWeight: 700, marginBottom: 6 }}>
                            System Prompt
                        </p>
                        <p
                            className={fors.className}
                            style={{
                                margin: 0,
                                whiteSpace: "pre-wrap",
                                overflowWrap: "break-word",
                            }}
                        >
                            {step.system_prompt || "—"}
                        </p>
                    </div>

                    <div>
                        <p className={fors.className} style={{ fontWeight: 700, marginBottom: 6 }}>
                            User Prompt
                        </p>
                        <p
                            className={fors.className}
                            style={{
                                margin: 0,
                                whiteSpace: "pre-wrap",
                                overflowWrap: "break-word",
                            }}
                        >
                            {step.user_prompt || "—"}
                        </p>
                    </div>
                </div>
            )}

            <div
                style={{
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    flexWrap: "wrap",
                }}
            >
                <EditHumorFlavorStepForm
                    step={step}
                    updateHumorFlavorStep={updateHumorFlavorStep}
                />

                <DeleteHumorFlavorStepForm
                    stepId={step.id}
                    stepNumber={step.order_by}
                    deleteHumorFlavorStep={deleteHumorFlavorStep}
                />
            </div>
        </div>
    );
}