"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { AddTransactionModal } from "@/components/dashboard/add-transaction-modal";

export function QuickActions() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"CREDIT" | "DEBIT">(
    "CREDIT"
  );

  const handleAddIncome = () => {
    setTransactionType("CREDIT");
    setIsAddModalOpen(true);
  };

  const handleExportData = async () => {
    try {
      toast({
        title: "Preparing export...",
        description: "Your transaction data is being prepared for download.",
      });

      const response = await fetch("/api/transactions");
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const { transactions } = await response.json();
      const csvContent = convertToCSV(transactions);
      downloadCSV(csvContent, "transactions-export.csv");

      toast({
        title: "Export successful",
        description: "Your transaction data has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Could not export your transaction data.",
        variant: "destructive",
      });
    }
  };

  const convertToCSV = (transactions: any[]) => {
    const headers = ["Date", "Description", "Amount", "Type", "Category"];
    const rows = transactions.map((t) => [
      new Date(t.dateTime).toLocaleDateString(),
      t.description,
      t.amount,
      t.type,
      t.category,
    ]);

    return [headers, ...rows].map((row) => row.join(",")).join("\n");
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = () => {
    // TODO: Implement CSV import functionality
    toast({
      title: "Coming soon",
      description: "CSV import functionality is under development.",
    });
  };

  const handleSettings = () => {
    router.push("/dashboard/settings");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50">
          <h3 className="text-lg font-semibold font-sans mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent hover:bg-muted/50"
              onClick={handleAddIncome}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Income
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent hover:bg-muted/50"
              onClick={handleExportData}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent hover:bg-muted/50"
              onClick={handleImportCSV}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import CSV
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start bg-transparent hover:bg-muted/50"
              onClick={handleSettings}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </Card>
      </motion.div>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onTransactionAdded={() => {
          toast({
            title: "Transaction added",
            description: "Your transaction has been recorded successfully.",
          });
        }}
        initialType={transactionType}
      />
    </>
  );
}
