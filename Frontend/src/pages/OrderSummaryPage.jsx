import { useParams, useNavigate } from "react-router-dom";
import { useOrders } from "@/contexts/OrderContext";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import { useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Package } from "lucide-react";

const OrderSummaryPage = () => {
  const { orderId } = useParams();
  const { orders, processPayment } = useOrders();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="page-container py-20 text-center">
        <p className="text-muted-foreground">Order not found.</p>
      </div>
    );
  }

  const handlePay = async () => {
    setPaying(true);
    const status = await processPayment(order.id);
    clearCart();
    navigate(`/payment-status/${order.id}/${status}`);
  };

  if (paying) return <LoadingSpinner text="Processing your payment..." />;

  return (
    <div className="page-container py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center gap-3">
          <Package className="h-6 w-6 text-accent" />
          <h1 className="font-display text-3xl font-bold text-foreground">Order Summary</h1>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Order ID</span>
            <span className="font-mono text-sm font-bold text-foreground">{order.id}</span>
          </div>

          <div className="divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.book.id} className="flex items-center gap-4 py-3">
                <img src={item.book.cover} alt={item.book.title} className="h-14 w-10 rounded object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.book.title}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold">₹{(item.book.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{order.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>GST (18%)</span><span>₹{order.gst.toFixed(2)}</span></div>
            <div className="flex justify-between pt-2 text-lg font-bold text-foreground"><span>Total</span><span>₹{order.total.toFixed(2)}</span></div>
          </div>

          <button onClick={handlePay} className="mt-6 w-full rounded-lg bg-accent py-3 text-sm font-bold text-accent-foreground transition-all hover:bg-accent/90 active:scale-[0.98]">
            Pay Now — ₹{order.total.toFixed(2)}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSummaryPage;
