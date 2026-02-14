import {  Route, Routes } from "react-router-dom";
import Auth from "./pages/Auth/Auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./utils/ProtectedRoutes";
import DashboardLayout from "./pages/Dashboard/layout";
import AdminHome from "./pages/Dashboard/Admin/AdminHome";
import SupervisorHome from "./pages/Dashboard/Supervisor/SupervisorHome";
import OperatorIndex from "./pages/Dashboard/Operator/OperatorIndex";
import OperatorExitCar from "./pages/Dashboard/Operator/OperatorExitCar";
import Profile from "./pages/Profile/Profile";
import AdminUsers from "./pages/Dashboard/Admin/AdminUsers";
import AdminParkingSessions from "./pages/Dashboard/Admin/AdminParkingSessions";
import AdminReports from "./pages/Dashboard/Admin/AdminGlobalReports";
import AdminDailyReports from "./pages/Dashboard/Admin/AdminDailyReports";
import SupervisorDailyReports from "./pages/Dashboard/Supervisor/SupervisorDailyReports";
import SupervisorGlobalReports from "./pages/Dashboard/Supervisor/SupervisorGlobalReports";
import SupervisorParking from "./pages/Dashboard/Supervisor/SupervisorParkingSession";

export default function App() {
  

  // useEffect(() => {
  //   if (!user) return; // اگر لاگین نیست، مسیر مشخص نیست

  //   // هدایت بر اساس رول کاربر
  //   if (user.role === "admin") navigate("/dashboard/admin", { replace: true });
  //   if (user.role === "operator")
  //     navigate("/dashboard/operator", { replace: true });
  //   if (user.role === "supervisor")
  //     navigate("/dashboard/supervisor", { replace: true });
  // }, [user, navigate]);
    return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={3000} rtl />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={ <DashboardLayout />}>
         <Route path="profile" element={<Profile/> } />

            {/* <Route index element={<div>Choose a dashboard</div>} /> */}

            {/* Admin-only routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin","superAdmin"]} />}>
              <Route path="admin" element={<AdminHome />} />
              <Route path="admin/users" element={<AdminUsers />} />
              <Route path="admin/parking" element={<AdminParkingSessions />} />
              <Route path="admin/global-reports" element={<AdminReports />} />  
              <Route path="admin/daily-reports" element={<AdminDailyReports />} />  
            </Route>

            {/* Operator-only routes */}
            <Route path="operator" element={<ProtectedRoute allowedRoles={["operator"]} />}>
              <Route path="operator-view" element={<OperatorIndex />} />
              <Route path="car-exit" element={<OperatorExitCar />} />
            </Route>

            {/* Supervisor-only routes */}
            <Route element={<ProtectedRoute allowedRoles={["supervisor"]} />}>
              <Route path="supervisor" element={<SupervisorHome />} />
              <Route path="supervisor/global-reports" element={<SupervisorGlobalReports />} />
              <Route path="supervisor/daily-reports" element={<SupervisorDailyReports />} />
              <Route path="supervisor/parking-sessions" element={<SupervisorParking />} />
            </Route>
          </Route>

          <Route path="/unauthorized" element={<div>Unauthorized</div>} />
        </Route>
      </Routes>
    </div>
  );
}
