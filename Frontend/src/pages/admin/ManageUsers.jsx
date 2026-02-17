import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import axios from "axios";

const emptyUser = { name: "", email: "", role: "USER", password: "" };

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [open, setOpen] = useState(false);

  // Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/users/user-only");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openNew = () => {
    setEditing({ ...emptyUser });
    setIsNew(true);
    setOpen(true);
  };

  const openEdit = (user) => {
    setEditing({ ...user, password: "" }); // Don't show existing hash, allow setting new one
    setIsNew(false);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/api/users/admin-only/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted");
    } catch (error) {
      console.error("Delete failed:", error);
      if (error.response && error.response.status === 403) {
        // Try to show specific message from backend if available
        const msg = error.response.data && (typeof error.response.data === 'string' ? error.response.data : error.response.data.message);
        toast.error(msg || "Permission denied. You cannot delete this user.");
      } else {
        toast.error("Failed to delete user. They might have active orders.");
      }
    }
  };

  const handleSave = async () => {
    if (!editing) return;

    // Basic validation
    if (!editing.name || !editing.email) {
      toast.error("Name and Email are required");
      return;
    }
    if (isNew && !editing.password) {
      toast.error("Password is required for new users");
      return;
    }

    const payload = { ...editing };
    // If not new and no password entered, remove it from payload to avoid overwriting with empty
    if (!isNew && !payload.password) {
      delete payload.password;
    }

    try {
      if (isNew) {
        // Use admin-only endpoint for creation if exists, or auth register
        // Assuming /api/users/admin-only for consistency with books, or /api/users/auth/register
        // Let's try standard CRUD endpoint first
        const res = await axios.post("/api/users/auth/register", payload);
        // Note: Register usually returns success or token, might not return full user object like admin CRUD.
        // If it's pure register, we might need to fetch users again or manually add to list.
        // Let's refetch to be safe.
        await fetchUsers();
        toast.success("User added successfully");
      } else {
        await axios.put(`/api/users/admin-only/${editing.id}`, payload);
        // Optimistic update or refetch
        setUsers((prev) => prev.map((u) => (u.id === editing.id ? { ...u, ...payload } : u)));
        toast.success("User updated successfully");
      }
      setOpen(false);
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save user. Ensure email is unique.");
    }
  };

  const update = (field, val) => setEditing((prev) => prev ? { ...prev, [field]: val } : prev);

  if (loading) return <div className="flex h-40 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Manage Users</h1>
          <p className="mt-1 text-sm text-muted-foreground">{users.length} registered users</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Add User</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b">
                  <TableCell className="font-mono text-sm">{u.id}</TableCell>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={u.role === "ADMIN" ? "default" : "secondary"}>
                      {u.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(u)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{isNew ? "Add User" : "Edit User"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <Input placeholder="Full Name" value={editing.name} onChange={(e) => update("name", e.target.value)} />
              <Input placeholder="Email Address" type="email" value={editing.email} onChange={(e) => update("email", e.target.value)} />
              <Input
                placeholder={isNew ? "Password" : "New Password (leave blank to keep)"}
                type="password"
                value={editing.password}
                onChange={(e) => update("password", e.target.value)}
              />
              <Select value={editing.role} onValueChange={(v) => update("role", v)}>
                <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="USER" disabled={!isNew && users.find(u => u.id === editing.id)?.role === "ADMIN"}>User</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter><Button onClick={handleSave}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageUsers;
