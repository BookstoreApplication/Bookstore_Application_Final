import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, BookOpen, User, LogOut, Menu, X, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `relative px-3 py-2 font-body text-sm font-medium transition-colors duration-200 ${
      isActive(path) ? "text-accent" : "text-foreground/80 hover:text-foreground"
    }`;

  const navLinks = (
    <>
      <Link to="/" className={linkClass("/")} onClick={() => setMobileOpen(false)}>Home</Link>
      {(!isAuthenticated || !isAdmin) && (
        <Link to="/cart" className={linkClass("/cart")} onClick={() => setMobileOpen(false)}>
          <span className="flex items-center gap-1.5">
            <ShoppingCart className="h-4 w-4" />Cart
            {itemCount > 0 && (
              <motion.span key={itemCount} initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">
                {itemCount}
              </motion.span>
            )}
          </span>
        </Link>
      )}
      {isAuthenticated && !isAdmin && (
        <Link to="/orders" className={linkClass("/orders")} onClick={() => setMobileOpen(false)}>Orders</Link>
      )}
      {isAuthenticated && isAdmin && (
        <Link to="/admin" className={linkClass("/admin")} onClick={() => setMobileOpen(false)}>
          <span className="flex items-center gap-1.5"><Shield className="h-4 w-4" />Admin</span>
        </Link>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="page-container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <BookOpen className="h-7 w-7 text-accent" />
          <span className="font-display text-xl font-bold tracking-tight text-foreground">The Book Nook</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks}
          <div className="ml-4 border-l border-border pl-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  {user?.name}
                  <Badge variant="outline" className="ml-1 text-[10px] px-1.5 py-0">{user?.role}</Badge>
                </span>
                <button onClick={logout} className="flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="rounded-md px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary">Sign In</Link>
                <Link to="/register" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Register</Link>
              </div>
            )}
          </div>
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-border md:hidden">
            <div className="flex flex-col gap-1 p-4">
              {navLinks}
              <div className="mt-3 border-t border-border pt-3">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{user?.name} <Badge variant="outline" className="ml-1 text-[10px]">{user?.role}</Badge></span>
                    <button onClick={() => { logout(); setMobileOpen(false); }} className="text-sm text-muted-foreground">Logout</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 rounded-md bg-secondary py-2 text-center text-sm font-medium">Sign In</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 rounded-md bg-primary py-2 text-center text-sm font-medium text-primary-foreground">Register</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
