import logo from "../../assets/logo.jpg";
import { LockIcon, Phone, Eye, EyeOff } from "lucide-react";
import useFormFields from "../../utils/hooks/UseFormFields";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { login as apiLogin } from "../../api/auth";
import { toast } from "react-toastify";

export default function Auth() {
  const { fields, handleChange } = useFormFields({ username: "", password: "" });
  const auth = useContext(AuthContext);
  
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiLogin(fields.username, fields.password);
      const successFlag = res?.success === true || res?.success === "true";
      if (!successFlag) {
        const msg = res?.message || "خطا در ورود";
        toast.error(msg);
        throw new Error(msg);
      }
      const payload = res.data || {};
      const token: string = payload.token;
      const user = {
        id: payload.id ?? payload.username ?? "unknown",
        name: payload.username ?? payload.name ?? "",
        role: (payload.role as any) ?? "operator",
      };
      auth.login({ user, token });
      toast.success(res?.message ?? "ورود موفقیت‌آمیز بود");
      setTimeout(() => {
        switch(user.role) {
          case 'admin':
          case 'superAdmin':
            navigate("/dashboard/admin");
            break;
          case 'operator':
            navigate("/dashboard/operator/operator-view");
            break;
          default:
            navigate("/dashboard/supervisor");
            break;
        }
      }, 1000);
    } catch (err: any) {
      toast.error(err?.message ?? "خطای شبکه");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full justify-center items-center md:flex-row-reverse" dir="rtl">
      {/* بخش تصویر - سمت راست */}
      <div className="hidden md:block w-1/2 h-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="relative w-full h-full">
          <img 
            className="w-full h-full  rounded-lg object-cover object-center" 
            src={logo} 
            alt="لوگوی پارکینگ"
            style={{ minHeight: '100svh', minWidth: '100%' }}
          />
          {/* اویرلی گرادینت برای زیبایی */}
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent"></div>
        </div>
      </div>

      {/* بخش فرم - سمت چپ */}
      <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center bg-white p-4">
        <div className="w-full max-w-md">
          {/* لوگوی کوچک برای موبایل */}
          <div className="md:hidden flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 shadow-lg">
              <img src={logo} alt="لوگو" className="w-full h-full object-cover" />
            </div>
          </div>

          <form onSubmit={handleSubmit} autoComplete="on" className="w-full">
            <h2 className="text-3xl md:text-4xl text-gray-900 font-danaMedium text-center">صفحه ورود</h2>
            <p className="text-sm text-gray-500/90 font-danaLight mt-3 text-center">
              خوش آمدید! برای ادامه وارد شوید
            </p>

            <div className="flex items-center gap-4 w-full my-5">
              <div className="w-full h-px bg-gray-300/90"></div>
            </div>

            <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden px-4 gap-2">
              <Phone className="text-gray-500/80 flex-shrink-0" size={20} />
              <input
                name="username"
                value={fields.username}
                autoComplete="username"
                onChange={handleChange}
                type="text"
                placeholder="نام کاربری"
                className="bg-transparent text-gray-800/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
              />
            </div>

            <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden px-4 gap-2">
              <LockIcon className="text-gray-500/80 flex-shrink-0" size={20} />
              <input
                name="password"
                autoComplete="current-password"
                value={fields.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="رمز عبور"
                className="bg-transparent text-gray-800/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "پنهان‌کردن رمز" : "نمایش رمز"}
                className="flex items-center justify-center text-gray-500/80 hover:text-gray-700 flex-shrink-0"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full h-12 rounded-full text-white bg-gradient-to-l from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-60 shadow-lg hover:shadow-xl"
            >
              {loading ? "در حال ورود..." : "ورود"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}