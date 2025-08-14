"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TransactionSkeleton } from "@/components/ui/loading-skeleton"
import { Plus, Search, Trash2, Edit } from "lucide-react"
import { AddTransactionModal } from "./add-transaction-modal"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"

interface Transaction {
  id: string
  description: string
  amount: number
  type: "CREDIT" | "DEBIT"
  category: string
  dateTime: string
  createdAt: string
}

export function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { data: session } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/transactions")
        const data = await response.json()
        setTransactions(data.transactions || [])
      } catch (error) {
        console.error("Failed to fetch transactions:", error)
        toast({
          title: "Error",
          description: "Failed to load transactions",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchTransactions()
    }
  }, [session, toast])

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || transaction.category === categoryFilter
    const matchesType = typeFilter === "all" || transaction.type === typeFilter
    return matchesSearch && matchesCategory && matchesType
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
      Bills: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
      Entertainment: "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
      Shopping: "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
      Income: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300",
      Other: "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-300",
    }
    return colors[category] || colors.Other
  }

  const handleTransactionAdded = (newTransaction: Transaction) => {
    setTransactions((prev) => [newTransaction, ...prev])
    toast({
      title: "Success",
      description: "Transaction added successfully!",
    })
  }

  const handleDeleteTransaction = async (id: string) => {
    setDeletingId(id)
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete transaction")
      }

      setTransactions((prev) => prev.filter((t) => t.id !== id))
      toast({
        title: "Success",
        description: "Transaction deleted successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete transaction",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden">
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold font-sans">Recent Transactions</h3>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-cyan-600 hover:bg-cyan-700 transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Bills">Bills</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Income">Income</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="CREDIT">Credit</SelectItem>
                <SelectItem value="DEBIT">Debit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6">
              <TransactionSkeleton />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {searchTerm || categoryFilter !== "all" || typeFilter !== "all"
                          ? "No transactions match your filters"
                          : "No transactions found. Add your first transaction to get started!"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="group hover:bg-muted/50 transition-colors duration-200"
                      >
                        <TableCell>
                          <div className="text-sm">
                            <div>{format(new Date(transaction.dateTime), "MMM dd, yyyy")}</div>
                            <div className="text-muted-foreground">
                              {format(new Date(transaction.dateTime), "hh:mm a")}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell>
                          <Badge
                            className={`${getCategoryColor(transaction.category)} transition-all duration-200 hover:scale-105`}
                          >
                            {transaction.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={transaction.type === "CREDIT" ? "default" : "secondary"}
                            className={`transition-all duration-200 hover:scale-105 ${
                              transaction.type === "CREDIT"
                                ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                            }`}
                          >
                            {transaction.type === "CREDIT" ? "Credit" : "Debit"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <motion.span
                            className={transaction.type === "CREDIT" ? "text-green-600" : "text-red-600"}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            {transaction.type === "CREDIT" ? "+" : "-"}
                            {formatCurrency(Math.abs(transaction.amount))}
                          </motion.span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTransaction(transaction.id)}
                              disabled={deletingId === transaction.id}
                              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 transition-colors duration-200"
                            >
                              {deletingId === transaction.id ? (
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          )}
        </div>
      </Card>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onTransactionAdded={handleTransactionAdded}
      />
    </motion.div>
  )
}
