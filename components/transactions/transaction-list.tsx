"use client";

import useSWRInfinite from "swr/infinite";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Pencil, Search, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddTransactionForm from "../forms/add-transaction-form";

type Tx = {
  _id: string;
  type: "credit" | "debit";
  amount: number;
  description: string;
  category: string;
  paymentMethod: string;
  date: string;
  balanceAfter: number;
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function TransactionList() {
  const { toast } = useToast();
  const [q, setQ] = useState("");
  const [type, setType] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<string>("-date");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingTx, setEditingTx] = useState<Tx | null>(null);

  const key = (pageIndex: number, prev: any) => {
    if (prev && prev.items && !prev.hasMore) return null;
    const page = pageIndex + 1;
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "10");
    params.set("sort", sort);
    if (q) params.set("q", q);
    if (type !== "all") params.set("type", type);
    if (category !== "all") params.set("category", category);
    return `/api/transactions?${params.toString()}`;
  };

  const { data, size, setSize, mutate } = useSWRInfinite(key, fetcher, {
    revalidateOnFocus: false,
    revalidateFirstPage: true,
  });

  const items: Tx[] = useMemo(
    () => (data ? data.flatMap((d: any) => d.items as Tx[]) : []),
    [data]
  );
  const isLoadingMore =
    (data && typeof data[size - 1] === "undefined") || false;
  const hasMore = data ? data[data.length - 1]?.hasMore : false;

  useEffect(() => {
    const onRefresh = () => mutate();
    document.addEventListener("transactions:refresh", onRefresh);
    return () =>
      document.removeEventListener("transactions:refresh", onRefresh);
  }, [mutate]);

  const remove = async (id: string) => {
    const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast({ title: "Delete failed", variant: "destructive" });
      return;
    }
    toast({ title: "Transaction deleted" });
    mutate();
    setDeleteId(null);
    document.dispatchEvent(new CustomEvent("transactions:refresh"));
  };

  return (
    <>
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-base">Transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search description..."
                  className="pl-8"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") mutate();
                  }}
                />
              </div>
            </div>
            <Select value={type} onValueChange={(v) => setType(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={(v) => setCategory(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "all",
                  "Food",
                  "Transport",
                  "Entertainment",
                  "Shopping",
                  "Bills",
                  "Other",
                ].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={(v) => setSort(v)}>
              <SelectTrigger className="sm:col-span-1">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-date">Newest</SelectItem>
                <SelectItem value="date">Oldest</SelectItem>
                <SelectItem value="-amount">Amount (High)</SelectItem>
                <SelectItem value="amount">Amount (Low)</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="sm:col-span-1 bg-emerald-600 hover:bg-emerald-500"
              onClick={() => mutate()}
            >
              Apply
            </Button>
          </div>

          <div className="divide-y divide-border rounded-md border">
            {items.length === 0 && !isLoadingMore && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                No transactions found
              </div>
            )}
            {items.map((tx) => (
              <div
                key={tx._id}
                className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`grid size-8 shrink-0 place-items-center rounded text-xs ${
                      tx.type === "credit"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-rose-500/10 text-rose-400"
                    }`}
                  >
                    {tx.type === "credit" ? "+" : "-"}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{tx.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {tx.category} • {tx.paymentMethod} •{" "}
                      {new Date(tx.date).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-center">
                  <div className="tabular-nums text-sm">
                    {tx.type === "credit" ? "+" : "-"}
                    {new Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency: "INR",
                    }).format(tx.amount)}
                  </div>
                  <Dialog
                    open={editingTx?._id === tx._id}
                    onOpenChange={(open) => !open && setEditingTx(null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-muted-foreground"
                        onClick={() => setEditingTx(tx)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Transaction</DialogTitle>
                      </DialogHeader>
                      <AddTransactionForm
                        transaction={tx}
                        onFinish={() => setEditingTx(null)}
                      />
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-rose-400"
                    onClick={() => setDeleteId(tx._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {hasMore && (
            <Button
              className="w-full bg-transparent"
              variant="outline"
              disabled={isLoadingMore}
              onClick={() => setSize(size + 1)}
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                </>
              ) : (
                "Load more"
              )}
            </Button>
          )}
        </CardContent>
      </Card>
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => remove(deleteId!)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
