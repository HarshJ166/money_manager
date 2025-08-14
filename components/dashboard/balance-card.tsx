"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

export function BalanceCard() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { data: session } = useSession();
  const { toast } = useToast();

  const fetchBalance = async () => {
    try {
      const response = await fetch("/api/transactions/balance");
      const data = await response.json();
      setBalance(data.balance || 0);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      toast({
        title: "Error",
        description: "Failed to load balance",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!session) return;

    // Initial fetch
    fetchBalance();

    // Set up polling every 10 seconds
    const interval = setInterval(fetchBalance, 10000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [session]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchBalance();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-6 bg-gradient-to-br from-cyan-500 to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Current Balance</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-white hover:bg-white/20 transition-all duration-200"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBalanceVisible(!isBalanceVisible)}
              className="text-white hover:bg-white/20 transition-all duration-200"
            >
              {isBalanceVisible ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="mb-4">
          {isLoading ? (
            <div className="h-8 bg-white/20 rounded animate-pulse"></div>
          ) : (
            <motion.p
              className="text-3xl font-bold"
              key={isBalanceVisible ? "visible" : "hidden"}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isBalanceVisible ? formatCurrency(balance) : "••••••"}
            </motion.p>
          )}
        </div>

        <motion.div
          className="flex items-center text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {balance >= 0 ? (
            <>
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Looking good!</span>
            </>
          ) : (
            <>
              <TrendingDown className="w-4 h-4 mr-1" />
              <span>Keep track of your spending</span>
            </>
          )}
        </motion.div>
      </Card>
    </motion.div>
  );
}
