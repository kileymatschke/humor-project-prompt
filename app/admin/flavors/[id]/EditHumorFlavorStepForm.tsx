"use client";

import { useState } from "react";
import { fors } from "../../fonts/fonts";

type StepData = {
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

export default function EditHumorFlavorStepForm({
                                                    step,
                                                    updateHumorFlavorStep,
                                                }: {
    step: StepData;
    updateHumorFlavorStep: (formData: FormData) => Promise<void>;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const inputStyle = {
        width: "100%",
        padding: 12,
        borderRadius: 12,
        border: "1px solid var(--bg)",
        boxSizing: "border-box" as const,
        fontSize: 14,
    };

    const labelStyle = {
        display: "block" as const,
        fontWeight: 700,
        marginBottom: 8,
    };

    return (
        <div>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={fors.className}
                style={{
                    border: "none",
                    borderRadius: 999,
                    padding: "8px 14px",
                    background: "#222",
                    color: "white",
                    fontWeight: 700,
                    cursor: "pointer",
                }}
            >
                {isOpen ? "CANCEL EDIT" : "EDIT"}
            </button>

            {isOpen && (
                <form
                    action={updateHumorFlavorStep}
                    style={{
                        marginTop: 14,
                        padding: 20,
                        borderRadius: 16,
                        background: "var(--bg)",
                        border: "1px solid var(--bg)",
                        boxShadow: "0 8px 24px var(--bg)",
                        display: "grid",
                        gap: 16,
                    }}
                >
                    <input type="hidden" name="step_id" value={step.id} />

                    <div>
                        <label className={fors.className} style={labelStyle}>
                            Input Type
                        </label>
                        <select
                            name="input_type"
                            required
                            defaultValue={step.input_type_value}
                            className={fors.className}
                            style={inputStyle}
                        >
                            <option value="image-and-text">image and text input</option>
                            <option value="text-only">text only input</option>
                        </select>
                    </div>

                    <div>
                        <label className={fors.className} style={labelStyle}>
                            Output Type
                        </label>
                        <select
                            name="output_type"
                            required
                            defaultValue={step.output_type_value}
                            className={fors.className}
                            style={inputStyle}
                        >
                            <option value="string">string</option>
                            <option value="array">array</option>
                        </select>
                    </div>

                    <div>
                        <label className={fors.className} style={labelStyle}>
                            LLM Model
                        </label>
                        <select
                            name="llm_model"
                            required
                            defaultValue={step.llm_model_value}
                            className={fors.className}
                            style={inputStyle}
                        >
                            <option value="gpt-4.1">GPT-4.1</option>
                        </select>
                    </div>

                    <div>
                        <label className={fors.className} style={labelStyle}>
                            Step Type
                        </label>
                        <select
                            name="step_type"
                            required
                            defaultValue={step.step_type_value}
                            className={fors.className}
                            style={inputStyle}
                        >
                            <option value="celebrity-recognition">celebrity-recognition</option>
                            <option value="image-description">image-description</option>
                            <option value="general">general</option>
                        </select>
                    </div>

                    <div>
                        <label className={fors.className} style={labelStyle}>
                            Temperature (optional)
                        </label>
                        <input
                            type="number"
                            name="temperature"
                            step="0.1"
                            defaultValue={step.temperature}
                            className={fors.className}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label className={fors.className} style={labelStyle}>
                            System Prompt
                        </label>
                        <textarea
                            name="system_prompt"
                            required
                            rows={6}
                            defaultValue={step.system_prompt}
                            className={fors.className}
                            style={{
                                ...inputStyle,
                                resize: "vertical",
                            }}
                        />
                    </div>

                    <div>
                        <label className={fors.className} style={labelStyle}>
                            User Prompt
                        </label>
                        <textarea
                            name="user_prompt"
                            required
                            rows={6}
                            defaultValue={step.user_prompt}
                            className={fors.className}
                            style={{
                                ...inputStyle,
                                resize: "vertical",
                            }}
                        />
                    </div>

                    <div>
                        <label className={fors.className} style={labelStyle}>
                            Description (optional)
                        </label>
                        <textarea
                            name="description"
                            rows={4}
                            defaultValue={step.description}
                            className={fors.className}
                            style={{
                                ...inputStyle,
                                resize: "vertical",
                            }}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className={fors.className}
                            style={{
                                border: "none",
                                borderRadius: 999,
                                padding: "10px 18px",
                                background: "var(--button)",
                                color: "var(--buttontext)",
                                fontWeight: 700,
                                fontSize: 14,
                                cursor: "pointer",
                            }}
                        >
                            SAVE CHANGES
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}