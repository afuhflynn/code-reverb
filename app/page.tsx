import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth-utils";

export default async function Home() {
  const session = await requireAuth();

  if (session) redirect("/app");
}
