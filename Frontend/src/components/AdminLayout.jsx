import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => (
  <div className="flex">
    <AdminSidebar />
    <div className="flex-1 min-h-[calc(100vh-4rem)] p-6 lg:p-8 overflow-auto">
      <Outlet />
    </div>
  </div>
);

export default AdminLayout;
