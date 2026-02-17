import { Users, BookOpen, ShoppingBag, TrendingUp } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="rounded-xl border border-border bg-card p-6 shadow-sm"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
      </div>
      <div className={`rounded-full p-3 ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  </motion.div>
);

const DashboardOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalBooks: 0,
    totalUsers: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, usersRes, booksRes, paymentsRes] = await Promise.all([
          axios.get("/api/orders/user-only"),
          axios.get("/api/users/user-only"),
          axios.get("/api/books/user-only"),
          axios.get("/api/payment/admin-only")
        ]);

        const totalSales = paymentsRes.data
          .filter(p => p.status === "COMPLETED")
          .reduce((acc, curr) => acc + (curr.amount || 0), 0);

        setStats({
          totalSales: totalSales,
          totalOrders: ordersRes.data.length,
          totalUsers: usersRes.data.length,
          totalBooks: booksRes.data.length
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };

    if (user?.role === "ADMIN" || user?.role?.includes("ADMIN")) {
      fetchStats();
    }
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name || "Admin"}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sales"
          value={`₹${stats.totalSales.toFixed(2)}`}
          icon={TrendingUp}
          color="bg-green-500/10 text-green-500"
          delay={0}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="bg-blue-500/10 text-blue-500"
          delay={0.1}
        />
        <StatCard
          title="Total Books"
          value={stats.totalBooks}
          icon={BookOpen}
          color="bg-purple-500/10 text-purple-500"
          delay={0.2}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-orange-500/10 text-orange-500"
          delay={0.3}
        />
      </div>
    </div>
  );
};

export default DashboardOverview;
