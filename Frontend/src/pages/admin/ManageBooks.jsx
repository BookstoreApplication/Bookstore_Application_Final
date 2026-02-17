import { useState, useEffect } from "react";
import { GENRES } from "@/data/books";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import axios from "axios";

const emptyBook = { title: "", author: "", price: "", category: "Fiction", stockQuantity: 20, isbn: "" };

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [open, setOpen] = useState(false);

  // Fetch Books
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/books/user-only");
      if (Array.isArray(response.data)) {
        const mapped = response.data.map(b => ({
          ...b,
          stockQuantity: b.stockQuantity || b.stock || 0, // Handle potential key difference
          cover: b.cover || `https://covers.openlibrary.org/b/title/${encodeURIComponent(b.title)}-M.jpg`
        }));
        setBooks(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch books:", error);
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const openNew = () => {
    setEditing({ ...emptyBook });
    setIsNew(true);
    setOpen(true);
  };

  const openEdit = (b) => {
    setEditing({ ...emptyBook, ...b, category: b.category || b.genre || "Fiction" });
    setIsNew(false);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await axios.delete(`/api/books/admin-only/${id}`);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      toast.success("Book deleted");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete book");
    }
  };

  const handleSave = async () => {
    if (!editing) return;

    // Prepare strict payload matching backend requirements
    const payload = {
      title: editing.title,
      author: editing.author,
      category: editing.category,
      isbn: editing.isbn || `ISBN-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Random ISBN
      price: Number(editing.price),
      stockQuantity: Number(editing.stockQuantity)
    };

    try {
      if (isNew) {
        const res = await axios.post("/api/books/admin-only", payload);
        // Add locally with generated cover for immediate UI update
        const newBook = {
          ...res.data,
          cover: `https://covers.openlibrary.org/b/title/${encodeURIComponent(payload.title)}-M.jpg`,
          stockQuantity: payload.stockQuantity
        };
        setBooks((prev) => [...prev, newBook]);
        toast.success("Book added successfully");
      } else {
        await axios.put(`/api/books/admin-only/${editing.id}`, payload);
        const updatedBook = {
          ...editing,
          ...payload,
          cover: editing.cover || `https://covers.openlibrary.org/b/title/${encodeURIComponent(payload.title)}-M.jpg`
        };
        setBooks((prev) => prev.map((b) => (b.id === editing.id ? updatedBook : b)));
        toast.success("Book updated successfully");
      }
      setOpen(false);
    } catch (error) {
      console.error("Save failed:", error);
      toast.error("Failed to save book. Check console for details.");
    }
  };

  const update = (field, val) => setEditing((prev) => prev ? { ...prev, [field]: val } : prev);

  if (loading) return <div className="flex h-40 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Manage Books</h1>
          <p className="mt-1 text-sm text-muted-foreground">{books.length} books in catalog</p>
        </div>
        <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Add Book</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cover</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book, i) => (
                <motion.tr key={book.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b">
                  <TableCell><img src={book.cover} alt={book.title} className="h-12 w-9 rounded object-cover" /></TableCell>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.category || book.genre}</TableCell>
                  <TableCell>₹{Number(book.price).toFixed(2)}</TableCell>
                  <TableCell>{book.stockQuantity}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(book)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(book.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{isNew ? "Add Book" : "Edit Book"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <Input placeholder="Title" value={editing.title} onChange={(e) => update("title", e.target.value)} />
              <Input placeholder="Author" value={editing.author} onChange={(e) => update("author", e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Price" type="number" value={editing.price} onChange={(e) => update("price", e.target.value)} />
                <Input placeholder="Stock Quantity" type="number" value={editing.stockQuantity} onChange={(e) => update("stockQuantity", e.target.value)} />
              </div>
              <Input placeholder="Category" value={editing.category} onChange={(e) => update("category", e.target.value)} />

            </div>
          )}
          <DialogFooter><Button onClick={handleSave}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageBooks;
