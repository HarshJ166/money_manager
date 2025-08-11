import AddTransactionForm from "@/components/forms/add-transaction-form";
import TransactionList from "@/components/transactions/transaction-list";
import BalanceChart from "@/components/charts/balance-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <Card>
            <CardHeader>
              <CardTitle>Balance History</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <BalanceChart />
            </CardContent>
          </Card>
        </div>
        <div className="col-span-4 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Add Transaction</CardTitle>
            </CardHeader>
            <CardContent>
              <AddTransactionForm />
            </CardContent>
          </Card>
        </div>
        <div className="col-span-4 lg:col-span-7">
          <TransactionList />
        </div>
      </div>
    </div>
  );
}
