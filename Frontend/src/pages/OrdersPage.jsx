import { useEffect, useState } from "react";
import { useOrders } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Package, Loader2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

const statusBadge = (status) => {
  const styles = {
    PENDING: "bg-gold/15 text-gold",
    CONFIRMED: "bg-blue-500/15 text-blue-500",
    COMPLETED: "bg-green-500/15 text-green-500",
    FAILED: "bg-destructive/15 text-destructive",
    CANCELLED: "bg-gray-500/15 text-gray-500",
  };
  return styles[status] || "bg-muted text-muted-foreground";
};

const OrdersPage = () => {
  const { fetchOrders } = useOrders();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [myOrders, setMyOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);
        // 1. Fetch User ID
        const userRes = await axios.get(`/api/users/fetch/${user.email}`);
        const userId = userRes.data.id;

        // 2. Fetch All Orders
        // Note: In a real app, backend should filter. Here we filter on frontend.
        const allOrders = await fetchOrders();

        // 3. Filter My Orders
        const userOrders = allOrders.filter(o => o.userId === userId);

        // 4. Fetch Books to get details (image, title)
        // We need this because OrderDTO only has bookId
        const booksRes = await axios.get("/api/books/user-only");
        const booksMap = {};
        if (Array.isArray(booksRes.data)) {
          booksRes.data.forEach(b => {
            // Generate cover image like HomePage
            b.cover = `https://covers.openlibrary.org/b/title/${encodeURIComponent(b.title)}-M.jpg`;
            booksMap[b.id] = b;
          });
        }

        // 5. Map Data
        const mappedOrders = userOrders.map(order => ({
          ...order,
          items: order.orderItems.map(item => ({
            ...item,
            book: booksMap[item.bookId] || { title: "Unknown Book", cover: "", price: 0 }
          }))
        }));

        // Sort by ID desc (newest first) assuming ID increments
        mappedOrders.sort((a, b) => b.id - a.id);

        setMyOrders(mappedOrders);
      } catch (err) {
        console.error("Error loading orders:", err);
        setError("Failed to load your orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, fetchOrders]);

  if (loading) {
    return (
      <div className="page-container flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container flex flex-col items-center justify-center py-32 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
        <h2 className="text-lg font-semibold text-foreground">Error</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (myOrders.length === 0) {
    return (
      <div className="page-container flex flex-col items-center justify-center py-32 text-center">
        <Package className="mb-4 h-16 w-16 text-muted-foreground/40" />
        <h2 className="font-display text-2xl font-bold text-foreground">No orders yet</h2>
        <p className="mt-2 text-muted-foreground">Start shopping to see your orders here!</p>
        <Link to="/" className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="page-container py-8">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-3xl font-bold text-foreground">
        Your Orders
      </motion.h1>

      <div className="mt-8 space-y-4">
        {myOrders.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-sm font-bold text-foreground">Order #{order.id}</p>
                {/* Display Payment ID if available */}
                <p className="text-xs text-muted-foreground">Payment ID: {order.paymentId}</p>
              </div>
              <div className="flex items-center gap-2">
                {/* Status from Order (usually just Created, Backend might not have status on Order entity directly or it might be different) */}
                {/* If order has no status field, we might assume it based on payment or paymentId presence */}
                {order.paymentId ? (
                  <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusBadge("COMPLETED")}`}>
                    Paid
                  </span>
                ) : (
                  <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusBadge("PENDING")}`}>
                    Payment Pending
                  </span>
                )}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3 overflow-x-auto">
              {order.items.map((item, idx) => (
                <img key={idx} src={item.book.cover} alt={item.book.title} title={item.book.title} className="h-16 w-11 flex-shrink-0 rounded object-cover" />
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm text-muted-foreground">{order.items.reduce((s, i) => s + i.quantity, 0)} items</span>
              <span className="text-base font-bold text-foreground">₹{order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
