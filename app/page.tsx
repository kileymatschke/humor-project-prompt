import { redirect } from "next/navigation";

export default function Home() {
    redirect("admin/flavors");
}



// import { createClient } from "../lib/supabase/server";
// import { redirect } from "next/navigation";
// import SignOutButton from "./admin/components/SignOutButton";
// import { adelia } from "./admin/fonts/fonts";
//
// import HumorFlavorsPage from "./admin/flavors/page";
// import HumorFlavorStepsPage from "./admin/flavor_steps/page";
// import HumorFlavorMixPage from "./admin/humor_flavor_mix/page";
//
// type Section =
//     | "humor-flavor-steps"
//     | "humor-flavor-mix"
//     | "humor-flavors";
//
// type DashboardSearchParams = {
//     section?: string;
//     page?: string;
//     lookup?: string;
// };
//
// type SectionPageProps = {
//     searchParams?: Promise<DashboardSearchParams>;
// };
//
// const sectionComponents: Record<
//     Section,
//     React.ComponentType<SectionPageProps>
// > = {
//     "humor-flavor-steps": HumorFlavorStepsPage,
//     "humor-flavor-mix": HumorFlavorMixPage,
//     "humor-flavors": HumorFlavorsPage,
// };
//
// export default async function Home({
//                                        searchParams,
//                                    }: {
//     searchParams?: Promise<DashboardSearchParams>;
// }) {
//     const resolvedSearchParams = (await searchParams) ?? {};
//
//     const rawSection = resolvedSearchParams.section;
//     const currentSection: Section =
//         rawSection && rawSection in sectionComponents
//             ? (rawSection as Section)
//             : "humor-flavors";
//
//     const supabase = await createClient();
//
//     const {
//         data: { user },
//     } = await supabase.auth.getUser();
//
//     if (!user) {
//         redirect("/login");
//     }
//
//     const SectionComponent = sectionComponents[currentSection];
//
//     return (
//         <main
//             style={{
//                 minHeight: "100vh",
//                 padding: 24,
//             }}
//         >
//             {/* Header */}
//             <div
//                 style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "center",
//                     marginBottom: 24,
//                 }}
//             >
//                 <h1 className={adelia.className}>Dashboard</h1>
//                 {/*<SignOutButton />*/}
//             </div>
//
//             {/* Page Content */}
//             <SectionComponent
//                 searchParams={Promise.resolve(resolvedSearchParams)}
//             />
//         </main>
//     );
// }