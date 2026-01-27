import { useState } from "react";
import { toast , Toaster } from "sonner";
import axios from "axios"; 
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/bg.jpeg"

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const isValid = validateForm();
    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        username: formData.username,
        password: formData.password,
      });

      // Assuming the response structure is the same as before
      const data = response.data;

      if (response.status === 200) {
        // Save token to cookies
        document.cookie = `token=${data.token}; path=/`;
        document.cookie = `userID=${data.data._id}; path=/;`
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!formData.username || !formData.password) {
      toast.error("Please fill in both username and password.");
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen flex">
        <Toaster />
      {/* Left side - Branding (Placeholder for future use) */}
      <div className="w-full lg:w-1/2 hidden lg:block bg-gray-800 flex items-center justify-center">
        <img src={bgImage} alt="" className="w-full h-full object-cover"/>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-red-700 via-red-900 to-[#1a1a1a] p-4">
        <div className="w-full max-w-[400px] p-8 bg-[#242424] rounded-lg shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-gray-300 mb-1.5 block">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white 
                         focus:outline-none focus:border-red-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-300 mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white 
                         focus:outline-none focus:border-red-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg 
                       transition-colors duration-200 font-medium"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-gray-400 text-sm">
              Don't have an account?{" "}
              <a 
                href="/signup" 
                className="text-red-500 hover:text-red-400 transition-colors"
              >
                Sign Up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
