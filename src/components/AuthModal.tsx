import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { registerUser, loginUser } from "../api/auth.api";
import { validateRegister, validateLogin } from "../utils/validators";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const AuthModal = ({ isOpen, onClose }: Props) => {
  const [tab, setTab] = useState<"login" | "register">("login");
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    gender: "",
    dob: "",
    password: "",
    foodPreference: "",
    liking: "",
  });

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* LOGIN */
  const handleLogin = async () => {
    const error = validateLogin(form.phone, form.password);
    if (error) return toast.error(error);

    try {
      setLoading(true);
      const res = await loginUser({
        phone: form.phone,
        password: form.password,
      });

      login(res.user, res.token);
      toast.success("Logged in successfully");
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* REGISTER */
  const handleRegister = async () => {
    const error = validateRegister(form);
    if (error) return toast.error(error);

    try {
      setLoading(true);
      const res = await registerUser(form);

      login(res.user, res.token);
      toast.success("Registration successful 🎉");
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="auth-close" onClick={onClose}>
          <X />
        </button>

        <div className="auth-tabs">
          <button
            className={tab === "login" ? "active" : ""}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={tab === "register" ? "active" : ""}
            onClick={() => setTab("register")}
          >
            Register
          </button>
        </div>

        {tab === "login" && (
          <div className="auth-form">
            <input name="phone" placeholder="Phone" onChange={handleChange} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
            <button onClick={handleLogin} disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        )}

        {tab === "register" && (
          <div className="auth-form">
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
            />
            <input name="phone" placeholder="Phone" onChange={handleChange} />
            <select name="gender" onChange={handleChange}>
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input type="date" name="dob" onChange={handleChange} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
            <input
              name="foodPreference"
              placeholder="Food Preference"
              onChange={handleChange}
            />
            <input name="liking" placeholder="Liking" onChange={handleChange} />
            <button onClick={handleRegister} disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
