import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "../../../../lib/supabase/server";
import { redirect } from "next/navigation";
import { adelia, fors } from "../../fonts/fonts";
import DeleteHumorFlavorForm from "./DeleteHumorFlavorForm";
import EditHumorFlavorForm from "./EditHumorFlavorForm";
import AddHumorFlavorStepForm from "./AddHumorFlavorStepForm";
import DeleteHumorFlavorStepForm from "./DeleteHumorFlavorStepForm";
import EditableHumorFlavorStepCard from "./EditableHumorFlavorStepCard";
import MoveHumorFlavorStepForm from "./MoveHumorFlavorStepForm";

const llmModelMap: Record<string, number> = {
    "GPT-4.1": 1,
    "GPT-4.1-mini": 2,
    "GPT-4.1-nano": 3,
    "GPT-4.5-preview": 4,
    "GPT-4o": 5,
    "GPT-4o-mini": 6,
    "o1": 7,
    "Grok-2-vision": 8,
    "Grok-3": 9,
    "Grok-4": 10,
    "Gemini 2.5 Pro (was 1.5 Pro)": 11,
    "Gemini 2.5 Flash (was 1.5 Flash)": 12,
    "Gemini 2.5 Pro": 13,
    "Gemini 2.5 Flash": 14,
    "Gemini 2.5 Flash Lite": 15,
    "GPT 5": 16,
    "GPT 5 Mini": 17,
    "GPT 5 Nano": 18,
    "OpenAI": 19,
    "Amdin model update": 54,
    "123": 60,
};

function parseHumorFlavorStepFormData(formData: FormData) {
    const inputType = String(formData.get("input_type") ?? "").trim();
    const outputType = String(formData.get("output_type") ?? "").trim();
    const llmModel = String(formData.get("llm_model") ?? "").trim();
    const stepType = String(formData.get("step_type") ?? "").trim();
    const temperatureRaw = String(formData.get("temperature") ?? "").trim();
    const systemPrompt = String(formData.get("system_prompt") ?? "").trim();
    const userPrompt = String(formData.get("user_prompt") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (
        !inputType ||
        !outputType ||
        !llmModel ||
        !stepType ||
        !systemPrompt ||
        !userPrompt
    ) {
        throw new Error("All step fields are required except temperature and description.");
    }

    const llm_input_type_id =
        inputType === "image-and-text"
            ? 1
            : inputType === "text-only"
                ? 2
                : null;

    const llm_output_type_id =
        outputType === "string"
            ? 1
            : outputType === "array"
                ? 2
                : null;

    const llm_model_id = llmModelMap[llmModel] ?? null;

    const humor_flavor_step_type_id =
        stepType === "celebrity-recognition"
            ? 1
            : stepType === "image-description"
                ? 2
                : stepType === "general"
                    ? 3
                    : null;

    if (llm_input_type_id === null) {
        throw new Error("Invalid input type selected.");
    }

    if (llm_output_type_id === null) {
        throw new Error("Invalid output type selected.");
    }

    if (llm_model_id === null) {
        throw new Error("Invalid LLM model selected.");
    }

    if (humor_flavor_step_type_id === null) {
        throw new Error("Invalid step type selected.");
    }

    const llm_temperature =
        temperatureRaw === "" ? null : Number(temperatureRaw);

    if (temperatureRaw !== "" && Number.isNaN(llm_temperature)) {
        throw new Error("Temperature must be a valid number.");
    }

    return {
        llm_input_type_id,
        llm_output_type_id,
        llm_model_id,
        humor_flavor_step_type_id,
        llm_temperature,
        llm_system_prompt: systemPrompt,
        llm_user_prompt: userPrompt,
        description: description === "" ? null : description,
    };
}

export default async function HumorFlavorDetailPage({
                                                        params,
                                                    }: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const numericId = Number(id);

    if (Number.isNaN(numericId)) {
        redirect("/admin/flavors");
    }

    async function deleteHumorFlavor() {
        "use server";

        const supabase = await createClient();

        const { error } = await supabase
            .from("humor_flavors")
            .delete()
            .eq("id", numericId);

        if (error) {
            throw new Error(error.message);
        }

        revalidatePath("/admin/flavors");
        redirect("/admin/flavors");
    }

    async function updateHumorFlavor(formData: FormData) {
        "use server";

        const supabase = await createClient();

        const slug = String(formData.get("slug") ?? "").trim();
        const description = String(formData.get("description") ?? "").trim();

        if (!slug || !description) {
            throw new Error("Slug and description are required.");
        }

        const { error } = await supabase
            .from("humor_flavors")
            .update({
                slug,
                description,
            })
            .eq("id", numericId);

        if (error) {
            throw new Error(error.message);
        }

        revalidatePath("/admin/flavors");
        revalidatePath(`/admin/flavors/${numericId}`);
        redirect(`/admin/flavors/${numericId}`);
    }

    async function addHumorFlavorStep(formData: FormData) {
        "use server";

        const supabase = await createClient();
        const parsedStep = parseHumorFlavorStepFormData(formData);

        const { data: existingSteps, error: existingStepsError } = await supabase
            .from("humor_flavor_steps")
            .select("order_by")
            .eq("humor_flavor_id", numericId)
            .order("order_by", { ascending: false })
            .limit(1);

        if (existingStepsError) {
            throw new Error(existingStepsError.message);
        }

        const nextOrderBy =
            existingSteps && existingSteps.length > 0
                ? (existingSteps[0].order_by ?? 0) + 1
                : 1;

        const now = new Date().toISOString();

        const { error } = await supabase.from("humor_flavor_steps").insert({
            humor_flavor_id: numericId,
            created_datetime_utc: now,
            order_by: nextOrderBy,
            ...parsedStep,
        });

        if (error) {
            throw new Error(error.message);
        }

        revalidatePath("/admin/flavors");
        revalidatePath(`/admin/flavors/${numericId}`);
        redirect(`/admin/flavors/${numericId}`);
    }

    async function updateHumorFlavorStep(formData: FormData) {
        "use server";

        const supabase = await createClient();

        const stepId = Number(String(formData.get("step_id") ?? "").trim());

        if (Number.isNaN(stepId)) {
            throw new Error("Invalid step id.");
        }

        const parsedStep = parseHumorFlavorStepFormData(formData);

        const { error } = await supabase
            .from("humor_flavor_steps")
            .update(parsedStep)
            .eq("id", stepId)
            .eq("humor_flavor_id", numericId);

        if (error) {
            throw new Error(error.message);
        }

        revalidatePath("/admin/flavors");
        revalidatePath(`/admin/flavors/${numericId}`);
        redirect(`/admin/flavors/${numericId}`);
    }

    async function moveHumorFlavorStep(formData: FormData) {
        "use server";

        const supabase = await createClient();

        const stepId = Number(String(formData.get("stepId") ?? "").trim());
        const direction = String(formData.get("direction") ?? "").trim();

        if (Number.isNaN(stepId)) {
            throw new Error("Invalid step id.");
        }

        if (direction !== "up" && direction !== "down") {
            throw new Error("Invalid direction.");
        }

        const { data: currentStep, error: currentStepError } = await supabase
            .from("humor_flavor_steps")
            .select("id, order_by")
            .eq("id", stepId)
            .eq("humor_flavor_id", numericId)
            .single();

        if (currentStepError || !currentStep) {
            throw new Error(currentStepError?.message ?? "Step not found.");
        }

        const currentOrder = currentStep.order_by ?? 0;
        const targetOrder = direction === "up" ? currentOrder - 1 : currentOrder + 1;

        if (targetOrder < 1) {
            revalidatePath(`/admin/flavors/${numericId}`);
            redirect(`/admin/flavors/${numericId}`);
        }

        const { data: otherStep, error: otherStepError } = await supabase
            .from("humor_flavor_steps")
            .select("id, order_by")
            .eq("humor_flavor_id", numericId)
            .eq("order_by", targetOrder)
            .single();

        if (otherStepError || !otherStep) {
            revalidatePath(`/admin/flavors/${numericId}`);
            redirect(`/admin/flavors/${numericId}`);
        }

        const { error: updateCurrentError } = await supabase
            .from("humor_flavor_steps")
            .update({ order_by: targetOrder })
            .eq("id", currentStep.id);

        if (updateCurrentError) {
            throw new Error(updateCurrentError.message);
        }

        const { error: updateOtherError } = await supabase
            .from("humor_flavor_steps")
            .update({ order_by: currentOrder })
            .eq("id", otherStep.id);

        if (updateOtherError) {
            throw new Error(updateOtherError.message);
        }

        revalidatePath("/admin/flavors");
        revalidatePath(`/admin/flavors/${numericId}`);
        redirect(`/admin/flavors/${numericId}`);
    }

    async function deleteHumorFlavorStep(formData: FormData) {
        "use server";

        const supabase = await createClient();

        const stepIdRaw = String(formData.get("stepId") ?? "").trim();
        const stepId = Number(stepIdRaw);

        if (Number.isNaN(stepId)) {
            throw new Error("Invalid step id.");
        }

        const { error: deleteError } = await supabase
            .from("humor_flavor_steps")
            .delete()
            .eq("id", stepId)
            .eq("humor_flavor_id", numericId);

        if (deleteError) {
            throw new Error(deleteError.message);
        }

        const { data: remainingSteps, error: fetchError } = await supabase
            .from("humor_flavor_steps")
            .select("id, order_by")
            .eq("humor_flavor_id", numericId)
            .order("order_by", { ascending: true });

        if (fetchError) {
            throw new Error(fetchError.message);
        }

        for (let index = 0; index < (remainingSteps?.length ?? 0); index++) {
            const step = remainingSteps![index];
            const newOrder = index + 1;

            if (step.order_by !== newOrder) {
                const { error: updateError } = await supabase
                    .from("humor_flavor_steps")
                    .update({ order_by: newOrder })
                    .eq("id", step.id);

                if (updateError) {
                    throw new Error(updateError.message);
                }
            }
        }

        revalidatePath("/admin/flavors");
        revalidatePath(`/admin/flavors/${numericId}`);
        redirect(`/admin/flavors/${numericId}`);
    }

    const supabase = await createClient();

    const [{ data, error }, { data: steps, error: stepsError }] = await Promise.all([
        supabase.from("humor_flavors").select("*").eq("id", numericId).single(),
        supabase
            .from("humor_flavor_steps")
            .select("*")
            .eq("humor_flavor_id", numericId)
            .order("order_by", { ascending: true }),
    ]);

    if (error || !data) {
        redirect("/admin/flavors");
    }

    if (stepsError) {
        throw new Error(stepsError.message);
    }

    return (
        <main
            style={{
                minHeight: "100vh",
                padding: 24,
            }}
        >
            <div
                style={{
                    width: "100%",
                    maxWidth: 800,
                    margin: "0 auto",
                }}
            >
                <div style={{ marginBottom: 20 }}>
                    <Link
                        href="/admin/flavors"
                        className={fors.className}
                        style={{
                            textDecoration: "none",
                            color: "black",
                            fontWeight: 700,
                        }}
                    >
                        ← Back to Humor Flavors
                    </Link>
                </div>

                <h1
                    className={adelia.className}
                    style={{ textAlign: "center", marginBottom: 24 }}
                >
                    Humor Flavor
                </h1>

                <div
                    style={{
                        marginBottom: 16,
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        flexWrap: "wrap",
                    }}
                >
                    <DeleteHumorFlavorForm
                        deleteHumorFlavor={deleteHumorFlavor}
                        slug={data.slug}
                    />

                    <EditHumorFlavorForm
                        slug={data.slug}
                        description={data.description}
                        updateHumorFlavor={updateHumorFlavor}
                    />
                </div>

                <div
                    style={{
                        padding: 24,
                        borderRadius: 20,
                        background: "rgba(255,255,255,0.9)",
                        border: "1px solid rgba(0,0,0,0.1)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                        marginBottom: 28,
                    }}
                >
                    <div style={{ marginBottom: 20 }}>
                        <p className={fors.className} style={{ fontWeight: 700 }}>
                            Slug
                        </p>
                        <p className={fors.className}>{data.slug ?? "—"}</p>
                    </div>

                    <div style={{ marginBottom: 20 }}>
                        <p className={fors.className} style={{ fontWeight: 700 }}>
                            Description
                        </p>
                        <p className={fors.className}>{data.description ?? "—"}</p>
                    </div>

                    <div>
                        <p className={fors.className} style={{ fontWeight: 700 }}>
                            Created
                        </p>
                        <p className={fors.className}>
                            {data.created_datetime_utc ?? "—"}
                        </p>
                    </div>
                </div>

                <AddHumorFlavorStepForm addHumorFlavorStep={addHumorFlavorStep} />

                <div
                    style={{
                        padding: 24,
                        borderRadius: 20,
                        background: "rgba(255,255,255,0.9)",
                        border: "1px solid rgba(0,0,0,0.1)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    }}
                >
                    <h2
                        className={adelia.className}
                        style={{ textAlign: "center", marginBottom: 24 }}
                    >
                        Humor Flavor Steps
                    </h2>

                    {!steps || steps.length === 0 ? (
                        <p className={fors.className}>No steps yet.</p>
                    ) : (
                        <div style={{ display: "grid", gap: 20 }}>
                            {steps.map((step) => (
                                <EditableHumorFlavorStepCard
                                    key={step.id}
                                    step={step}
                                    updateHumorFlavorStepAction={updateHumorFlavorStep}
                                    moveButtons={
                                        <MoveHumorFlavorStepForm
                                            stepId={step.id}
                                            stepNumber={step.order_by}
                                            moveHumorFlavorStepAction={moveHumorFlavorStep}
                                        />
                                    }
                                    deleteButton={
                                        <DeleteHumorFlavorStepForm
                                            stepId={step.id}
                                            stepNumber={step.order_by ?? "—"}
                                            deleteHumorFlavorStep={deleteHumorFlavorStep}
                                        />
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}