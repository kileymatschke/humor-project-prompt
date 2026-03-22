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
import TestHumorFlavorSets, {
    type TestHumorFlavorState,
} from "./TestHumorFlavorSets";
import { TEST_IMAGE_SETS } from "./testSets";
import HumorFlavorCaptionsGallery, {
    type HumorFlavorCaptionGalleryItem,
} from "./HumorFlavorCaptionsGallery";

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

function normalizeContentType(contentType: string | null) {
    if (!contentType) return null;
    return contentType.split(";")[0].trim().toLowerCase();
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

    async function testHumorFlavorSet(
        _previousState: TestHumorFlavorState,
        formData: FormData
    ): Promise<TestHumorFlavorState> {
        "use server";

        try {
            const supabase = await createClient();

            const {
                data: { session },
                error: sessionError,
            } = await supabase.auth.getSession();

            if (sessionError) {
                return {
                    success: false,
                    error: sessionError.message,
                    results: [],
                };
            }

            const accessToken = session?.access_token;

            if (!accessToken) {
                return {
                    success: false,
                    error: "No valid JWT found. Please sign in again.",
                    results: [],
                };
            }

            const humorFlavorId = Number(
                String(formData.get("humorFlavorId") ?? "").trim()
            );
            const rawImageUrls = String(formData.get("imageUrls") ?? "").trim();

            if (Number.isNaN(humorFlavorId)) {
                return {
                    success: false,
                    error: "Invalid humor flavor id.",
                    results: [],
                };
            }

            let imageUrls: string[] = [];

            try {
                const parsed = JSON.parse(rawImageUrls);
                imageUrls = Array.isArray(parsed) ? parsed : [];
            } catch {
                return {
                    success: false,
                    error: "Invalid image URL payload.",
                    results: [],
                };
            }

            if (imageUrls.length === 0) {
                return {
                    success: false,
                    error: "No image URLs were provided.",
                    results: [],
                };
            }

            const API_BASE_URL = "https://api.almostcrackd.ai";

            const SUPPORTED_TYPES = new Set([
                "image/jpeg",
                "image/jpg",
                "image/png",
                "image/webp",
                "image/gif",
                "image/heic",
            ]);

            const results: {
                sourceImageUrl: string;
                imageId: string;
                captions: unknown[];
            }[] = [];

            for (const imageUrl of imageUrls) {
                const sourceImageResponse = await fetch(imageUrl);

                if (!sourceImageResponse.ok) {
                    return {
                        success: false,
                        error: `Failed to fetch source image: ${imageUrl}`,
                        results: [],
                    };
                }

                const contentType = normalizeContentType(
                    sourceImageResponse.headers.get("content-type")
                );

                if (!contentType || !SUPPORTED_TYPES.has(contentType)) {
                    return {
                        success: false,
                        error: `Unsupported content type for image: ${imageUrl}. Found: ${contentType ?? "unknown"}`,
                        results: [],
                    };
                }

                const imageBytes = await sourceImageResponse.arrayBuffer();

                const presignedResponse = await fetch(
                    `${API_BASE_URL}/pipeline/generate-presigned-url`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            contentType,
                        }),
                    }
                );

                if (!presignedResponse.ok) {
                    return {
                        success: false,
                        error: `Failed to generate presigned URL: ${await presignedResponse.text()}`,
                        results: [],
                    };
                }

                const presignedData: {
                    presignedUrl: string;
                    cdnUrl: string;
                } = await presignedResponse.json();

                const uploadResponse = await fetch(presignedData.presignedUrl, {
                    method: "PUT",
                    headers: {
                        "Content-Type": contentType,
                    },
                    body: imageBytes,
                });

                if (!uploadResponse.ok) {
                    return {
                        success: false,
                        error: `Failed to upload image bytes: ${await uploadResponse.text()}`,
                        results: [],
                    };
                }

                const registerResponse = await fetch(
                    `${API_BASE_URL}/pipeline/upload-image-from-url`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            imageUrl: presignedData.cdnUrl,
                            isCommonUse: false,
                        }),
                    }
                );

                if (!registerResponse.ok) {
                    return {
                        success: false,
                        error: `Failed to register uploaded image: ${await registerResponse.text()}`,
                        results: [],
                    };
                }

                const registerData: {
                    imageId: string;
                    now: number;
                } = await registerResponse.json();

                const captionsResponse = await fetch(
                    `${API_BASE_URL}/pipeline/generate-captions`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            imageId: registerData.imageId,
                            humorFlavorId,
                        }),
                    }
                );

                if (!captionsResponse.ok) {
                    return {
                        success: false,
                        error: `Failed to generate captions: ${await captionsResponse.text()}`,
                        results: [],
                    };
                }

                const captions = await captionsResponse.json();

                results.push({
                    sourceImageUrl: imageUrl,
                    imageId: registerData.imageId,
                    captions: Array.isArray(captions) ? captions : [],
                });
            }

            return {
                success: true,
                error: null,
                results,
            };
        } catch (error) {
            return {
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Unexpected server error.",
                results: [],
            };
        }
    }

    const supabase = await createClient();

    const [
        { data, error },
        { data: steps, error: stepsError },
        { data: captionsData, error: captionsError },
    ] = await Promise.all([
        supabase.from("humor_flavors").select("*").eq("id", numericId).single(),
        supabase
            .from("humor_flavor_steps")
            .select("*")
            .eq("humor_flavor_id", numericId)
            .order("order_by", { ascending: true }),
        supabase
            .from("captions")
            .select(
                `
                id,
                content,
                created_datetime_utc,
                image_id,
                images (
                    id,
                    url
                )
            `
            )
            .eq("humor_flavor_id", numericId)
            .order("created_datetime_utc", { ascending: false }),
    ]);

    if (error || !data) {
        redirect("/admin/flavors");
    }

    if (stepsError) {
        throw new Error(stepsError.message);
    }

    if (captionsError) {
        throw new Error(captionsError.message);
    }

    const captionsGalleryItems: HumorFlavorCaptionGalleryItem[] = Object.values(
        (captionsData ?? []).reduce(
            (
                acc: Record<string, HumorFlavorCaptionGalleryItem>,
                row: any
            ) => {
                const imageId = row.image_id;
                const imageUrl = row.images?.url ?? "";

                if (!imageId || !imageUrl) {
                    return acc;
                }

                if (!acc[imageId]) {
                    acc[imageId] = {
                        imageId,
                        imageUrl,
                        captions: [],
                    };
                }

                acc[imageId].captions.push({
                    id: row.id,
                    content: row.content,
                    created_datetime_utc: row.created_datetime_utc,
                });

                return acc;
            },
            {}
        )
    );

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
                    maxWidth: 1000,
                    margin: "0 auto",
                }}
            >
                <div style={{ marginBottom: 20 }}>
                    <Link
                        href="/admin/flavors"
                        className={fors.className}
                        style={{
                            textDecoration: "none",
                            color: "var(--text)",
                            fontWeight: 700,
                            fontSize: 14
                        }}
                    >
                        ← BACK TO HUMOR FLAVORS
                    </Link>
                </div>



                <div
                    style={{
                        padding: 24,
                        borderRadius: 20,
                        background: "var(--field)",
                        border: "1px solid var(--bg)",
                        boxShadow: "0 8px 24px var(--bg)",
                        marginBottom: 28,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 12,
                            marginBottom: 10,
                            flexWrap: "wrap",
                        }}
                    >
                        <div>
                            <p
                                className={fors.className}
                                style={{ textAlign: "left", fontSize: 14, margin: 0 }}
                            >
                                HUMOR FLAVOR
                            </p>

                            <p
                                className={fors.className}
                                style={{ textAlign: "left", fontSize: 14, margin: 0 }}
                            >
                                CREATED {data.created_datetime_utc
                                    ? new Date(data.created_datetime_utc).toLocaleString()
                                    : "—"}
                            </p>
                        </div>

                        {/*<div*/}
                        {/*    style={{*/}
                        {/*        display: "flex",*/}
                        {/*        gap: 12,*/}
                        {/*        alignItems: "center",*/}
                        {/*        flexWrap: "wrap",*/}
                        {/*        justifyContent: "flex-end",*/}
                        {/*    }}*/}
                        {/*>*/}

                        {/*    <EditHumorFlavorForm*/}
                        {/*        slug={data.slug}*/}
                        {/*        description={data.description}*/}
                        {/*        updateHumorFlavor={updateHumorFlavor}*/}
                        {/*    />*/}

                        {/*    <DeleteHumorFlavorForm*/}
                        {/*        deleteHumorFlavor={deleteHumorFlavor}*/}
                        {/*        slug={data.slug}*/}
                        {/*    />*/}


                        {/*</div>*/}
                    </div>

                    <p
                        className={adelia.className}
                        style={{
                            textAlign: "left",
                            marginBottom: 10,
                            marginTop: 2,
                            fontSize: 36,
                        }}
                    >
                        {data.slug ?? "—"}
                    </p>

                    <p
                        className={fors.className}
                        style={{
                            textAlign: "left",
                            marginBottom: 20,
                            marginTop: 2,
                            fontSize: 18,
                        }}
                    >
                        {data.description ?? "—"}
                    </p>


                    <div
                        style={{
                            display: "flex",
                            gap: 12,            // 👈 horizontal space between buttons
                            alignItems: "center",
                            flexWrap: "wrap",   // 👈 keeps it responsive
                        }}
                    >

                        <EditHumorFlavorForm
                            slug={data.slug}
                            description={data.description}
                            updateHumorFlavor={updateHumorFlavor}
                        />

                        <DeleteHumorFlavorForm
                            deleteHumorFlavor={deleteHumorFlavor}
                            slug={data.slug}
                        />

                        <HumorFlavorCaptionsGallery items={captionsGalleryItems} />

                        <TestHumorFlavorSets
                            humorFlavorId={numericId}
                            testSets={TEST_IMAGE_SETS}
                            testHumorFlavorSetAction={testHumorFlavorSet}
                        />
                    </div>


                    {/*<TestHumorFlavorSets*/}
                    {/*    humorFlavorId={numericId}*/}
                    {/*    testSets={TEST_IMAGE_SETS}*/}
                    {/*    testHumorFlavorSetAction={testHumorFlavorSet}*/}
                    {/*/>*/}
                </div>

                <div
                    style={{
                        padding: 24,
                        borderRadius: 20,
                        background: "var(--field)",
                        border: "1px solid var(--bg)",
                        boxShadow: "0 8px 24px var(--bg)",
                        marginBottom: 28
                    }}
                >
                    <h2
                        className={adelia.className}
                        style={{ textAlign: "left", marginBottom: 24, fontSize: 28 }}
                    >
                        Steps
                    </h2>

                    <AddHumorFlavorStepForm addHumorFlavorStep={addHumorFlavorStep} />

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