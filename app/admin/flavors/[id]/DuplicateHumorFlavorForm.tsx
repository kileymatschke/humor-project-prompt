"use client";

import { useFormStatus } from "react-dom";
import { fors } from "../../fonts/fonts";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className={fors.className}
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
            {pending ? "DUPLICATING..." : "DUPLICATE"}
        </button>
    );
}

export default function DuplicateHumorFlavorForm({
                                                     duplicateHumorFlavor,
                                                 }: {
    duplicateHumorFlavor: () => Promise<void>;
}) {
    return (
        <form action={duplicateHumorFlavor}>
            <SubmitButton />
        </form>
    );
}