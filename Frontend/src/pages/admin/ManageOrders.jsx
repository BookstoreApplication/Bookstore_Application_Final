import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  COMPLETED: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-800"
};

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, usersRes] = await Promise.all([
          axios.get("/api/orders/user-only"),
          axios.get("/api/users/user-only")
        ]);

        const usersMap = {};
        if (Array.isArray(usersRes.data)) {
          usersRes.data.forEach(u => usersMap[u.id] = u.name || u.email);
        }

        const mappedOrders = ordersRes.data.map(order => ({
          ...order,
          userName: usersMap[order.userId] || "Unknown User",
          // If order doesn't have status, use paymentStatus or default to PENDING
          status: order.status || (order.paymentId ? "CONFIRMED" : "PENDING")
        }));

        // Sort by ID desc
        mappedOrders.sort((a, b) => b.id - a.id);

        setOrders(mappedOrders);
      } catch (error) {
        console.error("Failed to load orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete Order #${id}?`)) return;
    try {
      await axios.delete(`/api/orders/user-only/${id}`);
      setOrders(prev => prev.filter(o => o.id !== id));
      toast.success("Order deleted");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete order");
    }
  };

  if (loading) return <div className="flex h-40 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Manage Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">{orders.length} total orders</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o, i) => (
                <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b">
                  <TableCell className="font-mono text-sm">{o.id}</TableCell>
                  <TableCell>{o.userName}</TableCell>
                  <TableCell>₹{o.totalPrice ? o.totalPrice.toFixed(2) : "0.00"}</TableCell>
                  <TableCell><Badge className={statusColors[o.status] || "bg-gray-100"}>{o.status}</Badge></TableCell>
                  <TableCell className="font-mono text-xs">{o.paymentId || "-"}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(o.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageOrders;
