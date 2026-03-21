import { revalidatePath } from "next/cache";
import { createClient } from "../../../lib/supabase/server";
import { adelia } from "../fonts/fonts";
import HumorFlavorsClient from "./HumorFlavorsClient";
import SignOutButton from "../components/SignOutButton";


function formatUtcTimestamp() {
    const now = new Date();

    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");
    const hours = String(now.getUTCHours()).padStart(2, "0");
    const minutes = String(now.getUTCMinutes()).padStart(2, "0");
    const seconds = String(now.getUTCSeconds()).padStart(2, "0");

    const microseconds = String(now.getUTCMilliseconds() * 1000).padStart(6, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds}+00`;
}

export default async function HumorFlavorsPage() {
    const supabase = await createClient();

    async function createHumorFlavor(formData: FormData) {
        "use server";

        const supabase = await createClient();

        const slug = String(formData.get("slug") ?? "").trim();
        const description = String(formData.get("description") ?? "").trim();

        if (!slug || !description) {
            return;
        }

        const created_datetime_utc = formatUtcTimestamp();

        const { error } = await supabase.from("humor_flavors").insert([
            {
                slug,
                description,
                created_datetime_utc,
            },
        ]);

        if (error) {
            throw new Error(error.message);
        }

        revalidatePath("/admin/flavors");
    }

    const { data, error } = await supabase
        .from("humor_flavors")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        return (
            <main style={{ padding: 24 }}>
                <h1>Error</h1>
                <pre>{JSON.stringify(error, null, 2)}</pre>
            </main>
        );
    }

    const rows = data ?? [];

    return (
        <main style={{ padding: 24, minHeight: "100vh" }}>
            <h1
                className={adelia.className}
                style={{ textAlign: "center", fontSize: 48, marginBottom: 2 }}
            >
                Humor Flavors
            </h1>

            <div
                style={{
                    marginBottom: 20,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <SignOutButton />
            </div>

            <HumorFlavorsClient
                rows={rows}
                createHumorFlavor={createHumorFlavor}
            />
        </main>
    );
}