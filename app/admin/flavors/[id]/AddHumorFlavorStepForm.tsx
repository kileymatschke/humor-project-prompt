"use client";

import { useState } from "react";
import { fors } from "../../fonts/fonts";

export default function AddHumorFlavorStepForm({
                                                   addHumorFlavorStep,
                                               }: {
    addHumorFlavorStep: (formData: FormData) => Promise<void>;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const inputStyle = {
        width: "100%",
        padding: 12,
        borderRadius: 12,
        border: "1px solid rgba(0,0,0,0.15)",
        boxSizing: "border-box" as const,
        fontSize: 14,
    };

    const labelStyle = {
        display: "block" as const,
        fontWeight: 700,
        marginBottom: 8,
    };

    return (
        <div style={{ marginBottom: 16 }}>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                className={fors.className}
                style={{
                    border: "none",
                    borderRadius: 999,
                    padding: "10px 18px",
                    background: "black",
                    color: "white",
                    fontWeight: 700,
                    cursor: "pointer",
                    marginBottom: isOpen ? 16 : 0,
                }}
            >
                {isOpen ? "CANCEL" : "+ ADD STEP"}
            </button>

            {isOpen && (
                <form
                    action={addHumorFlavorStep}
                    style={{
                        padding: 24,
                        borderRadius: 20,
                        background: "rgba(255,255,255,0.9)",
                        border: "1px solid rgba(0,0,0,0.1)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                        display: "grid",
                        gap: 16,
                    }}
                >
                    <div>
                        <label className={fors.className} style={labelStyle}>
                            Input Type
                        </label>
                        <select
                            name="input_type"
                            required
                            className={fors.className}
                            style={inputStyle}
                            defaultValue=""
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
                            defaultValue=""
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
                            defaultValue=""
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
                            defaultValue=""
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
                                background: "black",
                                color: "white",
                                fontWeight: 700,
                                cursor: "pointer",
                            }}
                        >
                            SAVE STEP
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}