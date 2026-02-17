import { forwardRef } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";

const CartItemRow = forwardRef(({ item }, ref) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      className="flex gap-4 rounded-lg border border-border bg-card p-4"
    >
      <img src={item.book.cover} alt={item.book.title} className="h-24 w-16 rounded object-cover" />
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-display text-sm font-semibold text-foreground">{item.book.title}</h3>
          <p className="text-xs text-muted-foreground">{item.book.author}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-foreground">
              ₹{(item.book.price * item.quantity).toFixed(2)}
            </span>
            <button
              onClick={() => removeFromCart(item.book.id)}
              className="text-muted-foreground transition-colors hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

CartItemRow.displayName = "CartItemRow";

export default CartItemRow;
