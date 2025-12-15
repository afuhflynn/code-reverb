import { requireAuth } from "@/lib/auth-utils";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default async function DashboardPage() {
  const session = await requireAuth();

  return (
    <div className="container mx-auto p-6">
      <h1>Code Reverb</h1>
    </div>
  );
}
