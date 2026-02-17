import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, BookOpen, User, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, { message: "Passwords don't match", path: ["confirmPassword"] });

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("user");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = registerSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach((err) => { fieldErrors[err.path[0]] = err.message; });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    // Determine role based on active tab
    const role = activeTab === "admin" ? "ADMIN" : "USER";

    const success = await register(form.name, form.email, form.password, role);
    if (success) {
      toast.success(`${activeTab === "admin" ? "Admin" : "User"} account created successfully!`);
      navigate("/login");
    } else {
      toast.error("Registration failed. Please try again.");
    }
  };

  const floatingInput = (id, label, type, value, onChange, extra) => (
    <div className="relative">
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder=" "
        className="peer w-full rounded-lg border border-input bg-background px-4 pb-2 pt-5 pr-11 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
      />
      <label htmlFor={id} className="absolute left-4 top-2 text-[11px] font-medium text-muted-foreground transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-accent">
        {label}
      </label>
      {extra}
      {errors[id] && <p className="mt-1 text-xs text-destructive">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="mb-6 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-accent" />
          <h1 className="font-display text-3xl font-bold text-foreground">Create Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Join our community of book lovers</p>
        </div>

        <Tabs defaultValue="user" value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="user" className="flex items-center gap-2">
              <User className="h-4 w-4" /> User
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Admin
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border bg-card p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-center mb-4">
            {activeTab === "admin" ? "Admin Registration" : "User Registration"}
          </h2>

          {floatingInput("name", "Full Name", "text", form.name, update("name"))}
          {floatingInput("email", "Email Address", "email", form.email, update("email"))}
          {floatingInput("password", "Password", showPw ? "text" : "password", form.password, update("password"),
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
          {floatingInput("confirmPassword", "Confirm Password", showPw ? "text" : "password", form.confirmPassword, update("confirmPassword"))}

          <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60">
            {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : `Create ${activeTab === "admin" ? "Admin" : "User"} Account`}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="font-medium text-accent hover:underline">Sign In</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
