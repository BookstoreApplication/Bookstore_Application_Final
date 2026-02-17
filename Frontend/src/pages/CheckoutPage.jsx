import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrderContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

const CheckoutPage = () => {
  const { items, subtotal, gst, total, clearCart } = useCart();
  const { createOrder, processPayment, updatePayment } = useOrders();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  console.log("DEBUG: CheckoutPage User Context:", user);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // 1. Get User ID
      if (!user?.email) throw new Error("User email not found. Please login.");

      let userId = user.id || user.userId;
      if (!userId) {
        console.log("User ID not in context, fetching from API...");
        try {
          // User reported this is an unprotected route. 
          // Using a fresh axios instance to ensure NO Authorization header is sent.
          // Explicitly setting withCredentials: false to avoid sending cookies that might confuse the backend.
          const cleanAxios = axios.create({
            headers: {},
            withCredentials: false
          });
          // Also explicitly delete common headers just to be safe
          delete cleanAxios.defaults.headers.common["Authorization"];

          // Encode the email to handle special characters correctly
          const encodedEmail = encodeURIComponent(user.email);
          console.log(`Fetching User ID for: ${encodedEmail}`);

          const userResponse = await cleanAxios.get(`/api/users/fetch/${encodedEmail}`);
          userId = userResponse.data.id;
        } catch (fetchErr) {
          console.error("Fetch User ID failed:", fetchErr);
          if (fetchErr.response) {
            console.error("Error Response Data:", fetchErr.response.data);
            console.error("Error Response Status:", fetchErr.response.status);
            console.error("Error Response Headers:", fetchErr.response.headers);
          }

          // Fallback: Try WITH header just in case, or throw
          try {
            console.log("Retrying with Auth header...");
            const retryRes = await axios.get(`/api/users/fetch/${user.email}`);
            userId = retryRes.data.id;
          } catch (retryErr) {
            throw new Error("Could not retrieve user details. Please try logging in again.");
          }
        }
      }
      if (!userId) throw new Error("Could not resolve User ID.");

      // 2. Check Stock
      for (const item of items) {
        const bookResponse = await axios.get(`/api/books/user-only/${item.book.id}`);
        const currentStock = bookResponse.data.stockQuantity;
        if (currentStock < item.quantity) {
          throw new Error(`Insufficient stock for "${item.book.title}". Available: ${currentStock}`);
        }
      }

      // 3. Create Order
      const orderPayload = {
        userId: userId,
        paymentId: null, // Backend handles payment creation
        orderItems: items.map(item => ({
          bookId: Number(item.book.id),
          quantity: item.quantity
        }))
      };

      console.log("DEBUG: Sending Order Payload:", JSON.stringify(orderPayload, null, 2));

      const newOrder = await createOrder(orderPayload);
      if (!newOrder || !newOrder.id) throw new Error("Failed to create order.");

      console.log("DEBUG: Order created. Simulating Payment Gateway...", newOrder);

      // 4. Simulate Payment Gateway Delay
      // Show "Processing Payment" state
      toast.info("Redirecting to Payment Gateway...");

      // Wait for 3 seconds to simulate user entering details/processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      if (newOrder.paymentId) {
        // Payment exists (PENDING). Update it to COMPLETED.
        console.log("Updating Payment Status for ID: " + newOrder.paymentId);

        const now = new Date().toISOString();
        const transactionId = "TXN_" + Date.now();

        const updatePayload = {
          status: "COMPLETED", // Simulating success. Could be FAILED or CANCELLED too.
          transactionId: transactionId,
          updatedAt: now
        };

        await updatePayment(newOrder.paymentId, updatePayload);
        toast.success("Payment Successful!");
      }

      // Success
      clearCart();
      navigate("/");

    } catch (error) {
      console.error("Checkout Failed:", error);
      toast.error(error.message || "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container py-8">
      <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-display text-3xl font-bold text-foreground">
        Checkout
      </motion.h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg font-semibold text-foreground">Order Items</h2>
            <div className="mt-4 divide-y divide-border">
              {items.map((item) => (
                <div key={item.book.id} className="flex items-center gap-4 py-3">
                  <img src={item.book.cover} alt={item.book.title} className="h-16 w-11 rounded object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{item.book.title}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">₹{(item.book.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="h-fit rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-foreground">Payment Summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>GST (18%)</span><span>₹{gst.toFixed(2)}</span></div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between text-base font-bold text-foreground"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
            </div>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-bold text-accent-foreground transition-all hover:bg-accent/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Processing Payment...</> : <><CreditCard className="h-4 w-4" /> Place Order</>}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutPage;
