import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";

export default async function AdminLayout({
                                              children,
                                          }: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    // Get authenticated user
    const { data: auth, error: authError } = await supabase.auth.getUser();

    // If not logged in OR auth failed → go to login page
    if (authError || !auth?.user) {
        redirect("/login");
    }

    // Fetch profile with both role flags
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_superadmin, is_matrix_admin")
        .eq("id", auth.user.id)
        .single();

    // If profile missing or query failed → deny access
    if (profileError || !profile) {
        redirect("/");
    }

    // ✅ Allow if EITHER role is true
    const isAuthorized =
        profile.is_superadmin || profile.is_matrix_admin;

    // If neither role → block access
    if (!isAuthorized) {
        redirect("/");
    }

    return <>{children}</>;
}