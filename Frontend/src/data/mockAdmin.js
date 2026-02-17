export const MOCK_USERS = [
  { id: "u1", name: "admin", email: "admin@bookstore.com", role: "admin", active: true },
  { id: "u2", name: "john", email: "john@example.com", role: "user", active: true },
  { id: "u3", name: "sarah", email: "sarah@example.com", role: "user", active: true },
  { id: "u4", name: "mike", email: "mike@example.com", role: "user", active: false },
  { id: "u5", name: "emma", email: "emma@example.com", role: "admin", active: true },
];

export const MOCK_ALL_ORDERS = [
  { id: "ORD-A1B2C", items: [], subtotal: 42.97, gst: 7.73, total: 50.70, status: "delivered", paymentStatus: "success", createdAt: "2025-12-01T10:00:00Z", userId: "u2", userName: "john" },
  { id: "ORD-D3E4F", items: [], subtotal: 29.98, gst: 5.40, total: 35.38, status: "confirmed", paymentStatus: "success", createdAt: "2025-12-15T14:30:00Z", userId: "u3", userName: "sarah" },
  { id: "ORD-G5H6I", items: [], subtotal: 16.99, gst: 3.06, total: 20.05, status: "pending", paymentStatus: "failed", createdAt: "2026-01-05T09:15:00Z", userId: "u2", userName: "john" },
  { id: "ORD-J7K8L", items: [], subtotal: 54.96, gst: 9.89, total: 64.85, status: "shipped", paymentStatus: "success", createdAt: "2026-01-20T16:45:00Z", userId: "u4", userName: "mike" },
  { id: "ORD-M9N0P", items: [], subtotal: 23.98, gst: 4.32, total: 28.30, status: "pending", paymentStatus: "refunded", createdAt: "2026-02-10T11:20:00Z", userId: "u3", userName: "sarah" },
];

export const MOCK_PAYMENTS = MOCK_ALL_ORDERS.map((o) => ({
  orderId: o.id,
  userName: o.userName ?? "Unknown",
  amount: o.total,
  status: o.paymentStatus,
  date: o.createdAt,
}));

export const ADMIN_STATS = {
  totalUsers: MOCK_USERS.length,
  totalBooks: 12,
  totalOrders: MOCK_ALL_ORDERS.length,
  totalRevenue: MOCK_ALL_ORDERS.filter((o) => o.paymentStatus === "success").reduce((s, o) => s + o.total, 0),
};
