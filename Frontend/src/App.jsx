import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/AdminLayout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderSummaryPage from "@/pages/OrderSummaryPage";
import PaymentStatusPage from "@/pages/PaymentStatusPage";
import OrdersPage from "@/pages/OrdersPage";
import DashboardOverview from "@/pages/admin/DashboardOverview";
import ManageBooks from "@/pages/admin/ManageBooks";
import ManageOrders from "@/pages/admin/ManageOrders";
import ManageUsers from "@/pages/admin/ManageUsers";
import PaymentsOverview from "@/pages/admin/PaymentsOverview";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <Navbar />
              <main className="min-h-[calc(100vh-4rem)]">
                <Routes>
                  <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<ProtectedRoute allowedRoles={["user", "admin", "USER", "ADMIN"]}><CheckoutPage /></ProtectedRoute>} />
                  <Route path="/order/:orderId" element={<ProtectedRoute><OrderSummaryPage /></ProtectedRoute>} />
                  <Route path="/payment-status/:orderId/:status" element={<ProtectedRoute><PaymentStatusPage /></ProtectedRoute>} />
                  <Route path="/orders" element={<ProtectedRoute allowedRoles={["user", "admin", "USER", "ADMIN"]}><OrdersPage /></ProtectedRoute>} />

                  {/* Admin routes */}
                  <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin", "ADMIN", "ROLE_ADMIN"]}><AdminLayout /></ProtectedRoute>}>
                    <Route index element={<DashboardOverview />} />
                    <Route path="books" element={<ManageBooks />} />
                    <Route path="orders" element={<ManageOrders />} />
                    <Route path="users" element={<ManageUsers />} />
                    <Route path="payments" element={<PaymentsOverview />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
