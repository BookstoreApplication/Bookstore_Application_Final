import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

const BookCard = ({ book, index }) => {
  const { addToCart } = useCart();
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleAdd = () => {
    addToCart(book);
    toast.success(`"${book.title}" added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group glass-card hover-lift overflow-hidden rounded-lg"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {!imgLoaded && <div className="absolute inset-0 animate-pulse bg-muted" />}
        <img
          src={imgLoaded ? book.cover : book.cover} // Keep original src, but rely on onError for fallback if needed. Actually logic below handles fallback.
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=300&h=400"; // Fallback book image
          }}
          alt={book.title}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <button
          onClick={handleAdd}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-3 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-accent/90 active:scale-95"
        >
          <ShoppingCart className="mr-1.5 inline-block h-4 w-4" />
          Add to Cart
        </button>
      </div>
      <div className="p-4">
        <p className="mb-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {book.genre}
        </p>
        <h3 className="font-display text-base font-semibold leading-tight text-foreground line-clamp-1">
          {book.title}
        </h3>
        <p className="mt-0.5 text-sm text-muted-foreground">{book.author}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">₹{book.price.toFixed(2)}</span>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-gold text-gold" />
            <span className="text-sm font-medium text-muted-foreground">{book.rating}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
