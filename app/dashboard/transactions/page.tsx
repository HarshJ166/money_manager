import { TransactionTable } from "@/components/dashboard/transaction-table";

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      <TransactionTable />
    </div>
  );
}
