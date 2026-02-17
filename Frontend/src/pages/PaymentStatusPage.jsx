import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertTriangle, RotateCcw } from "lucide-react";

const statusConfig = {
  success: {
    icon: <CheckCircle2 className="h-20 w-20 text-success" />,
    title: "Payment Successful!",
    subtitle: "Your order has been confirmed. Happy reading!",
    color: "text-success",
  },
  failed: {
    icon: <XCircle className="h-20 w-20 text-destructive" />,
    title: "Payment Failed",
    subtitle: "Something went wrong. Please try again.",
    color: "text-destructive",
  },
  cancelled: {
    icon: <AlertTriangle className="h-20 w-20 text-gold" />,
    title: "Payment Cancelled",
    subtitle: "Your payment was cancelled. No charges were made.",
    color: "text-gold",
  },
  refunded: {
    icon: <RotateCcw className="h-20 w-20 text-muted-foreground" />,
    title: "Payment Refunded",
    subtitle: "Your refund has been processed successfully.",
    color: "text-muted-foreground",
  },
};

const PaymentStatusPage = () => {
  const { orderId, status } = useParams();
  const config = statusConfig[status || "failed"];

  return (
    <div className="page-container flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
          className="mx-auto mb-6"
        >
          {config.icon}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`font-display text-3xl font-bold ${config.color}`}
        >
          {config.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-muted-foreground"
        >
          {config.subtitle}
        </motion.p>

        {orderId && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-3 font-mono text-sm text-muted-foreground"
          >
            Order: {orderId}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 flex justify-center gap-3"
        >
          <Link to="/" className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Continue Shopping
          </Link>
          <Link to="/orders" className="rounded-lg border border-border px-6 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
            View Orders
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentStatusPage;
