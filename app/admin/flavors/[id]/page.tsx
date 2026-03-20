import Link from "next/link";
import { createClient } from "../../../../lib/supabase/server";
import { redirect } from "next/navigation";
import { adelia, fors } from "../../fonts/fonts";

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

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("humor_flavors")
        .select("*")
        .eq("id", numericId)
        .single();

    if (error || !data) {
        redirect("/admin/flavors");
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
                        padding: 24,
                        borderRadius: 20,
                        background: "rgba(255,255,255,0.9)",
                        border: "1px solid rgba(0,0,0,0.1)",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
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
            </div>
        </main>
    );
}