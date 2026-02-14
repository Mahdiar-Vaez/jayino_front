import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const DefaultDashboard = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" replace />;

  if (user.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
  if (user.role === 'operator') return <Navigate to="/dashboard/operator" replace />;
  if (user.role === 'supervisor') return <Navigate to="/dashboard/supervisor" replace />;

  return <Navigate to="/dashboard" replace />;
};

export default DefaultDashboard;
