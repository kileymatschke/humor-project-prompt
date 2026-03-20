import Link from "next/link";
import { revalidatePath } from "next/cache";
import { createClient } from "../../../../lib/supabase/server";
import { redirect } from "next/navigation";
import { adelia, fors } from "../../fonts/fonts";
import DeleteHumorFlavorForm from "./DeleteHumorFlavorForm";
import EditHumorFlavorForm from "./EditHumorFlavorForm";
import AddHumorFlavorStepForm from "./AddHumorFlavorStepForm";

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

        const input_type = String(formData.get("input_type") ?? "").trim();
        const output_type = String(formData.get("output_type") ?? "").trim();
        const llm_model = String(formData.get("llm_model") ?? "").trim();
        const step_type = String(formData.get("step_type") ?? "").trim();
        const temperatureRaw = String(formData.get("temperature") ?? "").trim();
        const system_prompt = String(formData.get("system_prompt") ?? "").trim();
        const user_prompt = String(formData.get("user_prompt") ?? "").trim();

        if (
            !input_type ||
            !output_type ||
            !llm_model ||
            !step_type ||
            !system_prompt ||
            !user_prompt
        ) {
            throw new Error("All step fields are required (except temperature).");
        }

        const temperature =
            temperatureRaw === "" ? null : Number(temperatureRaw);

        if (temperatureRaw !== "" && Number.isNaN(temperature)) {
            throw new Error("Temperature must be a valid number.");
        }

        const now = new Date().toISOString();

        const { error } = await supabase.from("humor_flavor_steps").insert({
            humor_flavor_id: numericId,
            input_type,
            output_type,
            llm_model,
            step_type,
            temperature, // 👈 now nullable
            system_prompt,
            user_prompt,
            created_datetime_utc: now,
            modified_datetime_utc: now,
        });

        if (error) {
            throw new Error(error.message);
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
            .order("id", { ascending: true }),
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
                                <div
                                    key={step.id}
                                    style={{
                                        padding: 20,
                                        borderRadius: 16,
                                        border: "1px solid rgba(0,0,0,0.08)",
                                        background: "rgba(255,255,255,0.8)",
                                    }}
                                >
                                    <p className={fors.className}>
                                        <strong>Step ID:</strong> {step.id}
                                    </p>
                                    <p className={fors.className}>
                                        <strong>Temperature:</strong>{" "}
                                        {step.temperature ?? "NULL"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}