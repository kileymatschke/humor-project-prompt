"use client";

import { ReactNode, useState } from "react";
import { fors } from "../../fonts/fonts";

type HumorFlavorStep = {
    id: number;
    order_by: number | null;
    llm_input_type_id: number | null;
    llm_output_type_id: number | null;
    llm_model_id: number | null;
    humor_flavor_step_type_id: number | null;
    llm_temperature: number | null;
    llm_system_prompt: string | null;
    llm_user_prompt: string | null;
    description: string | null;
};

function getInputTypeValue(id: number | null) {
    return id === 1 ? "image-and-text" : id === 2 ? "text-only" : "";
}

function getOutputTypeValue(id: number | null) {
    return id === 1 ? "string" : id === 2 ? "array" : "";
}

function getStepTypeValue(id: number | null) {
    return id === 1
        ? "celebrity-recognition"
        : id === 2
            ? "image-description"
            : id === 3
                ? "general"
                : "";
}

function getLlmModelValue(id: number | null) {
    const map: Record<number, string> = {
        1: "GPT-4.1",
        2: "GPT-4.1-mini",
        3: "GPT-4.1-nano",
        4: "GPT-4.5-preview",
        5: "GPT-4o",
        6: "GPT-4o-mini",
        7: "o1",
        8: "Grok-2-vision",
        9: "Grok-3",
        10: "Grok-4",
        11: "Gemini 2.5 Pro (was 1.5 Pro)",
        12: "Gemini 2.5 Flash (was 1.5 Flash)",
        13: "Gemini 2.5 Pro",
        14: "Gemini 2.5 Flash",
        15: "Gemini 2.5 Flash Lite",
        16: "GPT 5",
        17: "GPT 5 Mini",
        18: "GPT 5 Nano",
        19: "OpenAI",
        54: "Amdin model update",
        60: "123",
    };

    return id ? map[id] ?? "" : "";
}

export default function EditableHumorFlavorStepCard({
                                                        step,
                                                        updateHumorFlavorStepAction,
                                                        moveButtons,
                                                        deleteButton,
                                                    }: {
    step: HumorFlavorStep;
    updateHumorFlavorStepAction: (formData: FormData) => Promise<void>;
    moveButtons: ReactNode;
    deleteButton: ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const inputStyle = {
        width: "100%",
        padding: 12,
        borderRadius: 12,
        border: "1px solid var(--text)",
        boxSizing: "border-box" as const,
        fontSize: 14,
    };

    const labelStyle = {
        display: "block" as const,
        fontWeight: 700,
        marginBottom: 8,
    };

    const stepTypeLabel =
        step.humor_flavor_step_type_id === 1
            ? "celebrity-recognition"
            : step.humor_flavor_step_type_id === 2
                ? "image-description"
                : step.humor_flavor_step_type_id === 3
                    ? "general"
                    : "unknown";

    if (!isOpen) {
        return (
            <div
                style={{
                    padding: "16px 20px",
                    borderRadius: 16,
                    border: "1px solid var(--bg)",
                    background: "var(--stepcard)",
                    boxShadow: "0 4px 12px var(--bg)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 16,
                }}
            >
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    style={{
                        border: "none",
                        background: "transparent",
                        padding: 0,
                        margin: 0,
                        width: "100%",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        textAlign: "left",
                    }}
                >
                    <p
                        className={fors.className}
                        style={{ fontWeight: 700, margin: 0, fontSize: 18, color: "var(--text)" }}
                    >
                        Step {step.order_by ?? "—"}
                    </p>

                    <p
                        className={fors.className}
                        style={{ margin: 0, fontSize: 18, color: "var(--text)" }}
                    >
                        {stepTypeLabel}
                    </p>
                </button>

                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        flexShrink: 0,
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                    }}
                >
                    {moveButtons}
                    {deleteButton}
                </div>
            </div>
        );
    }

    return (
        <div
            style={{
                padding: 24,
                borderRadius: 20,
                background: "var(--stepcard)",
                border: "1px solid var(--bg)",
                boxShadow: "0 8px 24px var(--bg)",
                display: "grid",
                gap: 16,
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                }}
            >
                <p
                    className={fors.className}
                    style={{ fontWeight: 700, margin: 0 }}
                >
                    Edit Step {step.order_by ?? "—"}
                </p>

                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
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
                    CANCEL
                </button>
            </div>

            <form
                action={updateHumorFlavorStepAction}
                style={{
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
                        className={fors.className}
                        style={inputStyle}
                        defaultValue={getInputTypeValue(step.llm_input_type_id)}
                    >
                        <option value="" disabled>
                            Select input type
                        </option>
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
                        className={fors.className}
                        style={inputStyle}
                        defaultValue={getOutputTypeValue(step.llm_output_type_id)}
                    >
                        <option value="" disabled>
                            Select output type
                        </option>
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
                        className={fors.className}
                        style={inputStyle}
                        defaultValue={getLlmModelValue(step.llm_model_id)}
                    >
                        <option value="" disabled>
                            Select LLM model
                        </option>
                        <option value="GPT-4.1">GPT-4.1</option>
                        <option value="GPT-4.1-mini">GPT-4.1-mini</option>
                        <option value="GPT-4.1-nano">GPT-4.1-nano</option>
                        <option value="GPT-4.5-preview">GPT-4.5-preview</option>
                        <option value="GPT-4o">GPT-4o</option>
                        <option value="GPT-4o-mini">GPT-4o-mini</option>
                        <option value="o1">o1</option>
                        <option value="Grok-2-vision">Grok-2-vision</option>
                        <option value="Grok-3">Grok-3</option>
                        <option value="Grok-4">Grok-4</option>
                        <option value="Gemini 2.5 Pro (was 1.5 Pro)">Gemini 2.5 Pro (was 1.5 Pro)</option>
                        <option value="Gemini 2.5 Flash (was 1.5 Flash)">Gemini 2.5 Flash (was 1.5 Flash)</option>
                        <option value="Gemini 2.5 Pro">Gemini 2.5 Pro</option>
                        <option value="Gemini 2.5 Flash">Gemini 2.5 Flash</option>
                        <option value="Gemini 2.5 Flash Lite">Gemini 2.5 Flash Lite</option>
                        <option value="GPT 5">GPT 5</option>
                        <option value="GPT 5 Mini">GPT 5 Mini</option>
                        <option value="GPT 5 Nano">GPT 5 Nano</option>
                        <option value="OpenAI">OpenAI</option>
                        <option value="Amdin model update">Amdin model update</option>
                        <option value="123">123</option>
                    </select>
                </div>

                <div>
                    <label className={fors.className} style={labelStyle}>
                        Step Type
                    </label>
                    <select
                        name="step_type"
                        required
                        className={fors.className}
                        style={inputStyle}
                        defaultValue={getStepTypeValue(step.humor_flavor_step_type_id)}
                    >
                        <option value="" disabled>
                            Select step type
                        </option>
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
                        placeholder="e.g. 0.7"
                        className={fors.className}
                        style={inputStyle}
                        defaultValue={step.llm_temperature ?? ""}
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
                        className={fors.className}
                        style={{
                            ...inputStyle,
                            resize: "vertical",
                        }}
                        defaultValue={step.llm_system_prompt ?? ""}
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
                        className={fors.className}
                        style={{
                            ...inputStyle,
                            resize: "vertical",
                        }}
                        defaultValue={step.llm_user_prompt ?? ""}
                    />
                </div>

                <div>
                    <label className={fors.className} style={labelStyle}>
                        Description (optional)
                    </label>
                    <textarea
                        name="description"
                        rows={4}
                        className={fors.className}
                        style={{
                            ...inputStyle,
                            resize: "vertical",
                        }}
                        defaultValue={step.description ?? ""}
                    />
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
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
                        SAVE STEP
                    </button>

                    <div>{moveButtons}</div>
                    <div>{deleteButton}</div>
                </div>
            </form>
        </div>
    );
}