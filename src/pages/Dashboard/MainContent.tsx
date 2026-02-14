
// import AdminContent from '@/components/RoleBasedContent/AdminContent';
// import UserContent from '@/components/RoleBasedContent/UserContent';
// import GuestContent from '@/components/RoleBasedContent/GuestContent';

import { useAuth } from "../../context/useAuth";

const MainContent = ({ children }) => {
  const { user } = useAuth(); // فرض می‌کنیم هوک useAuth داریم
//   const role = user?.role || 'guest';

//   const renderContent = () => {
//     switch (role) {
//       case 'admin':
//         return <AdminContent />;
//       case 'user':
//         return <UserContent />;
//       default:
//         return <GuestContent />;
//     }
//   };

//   return <div>{children ? children : renderContent()}</div>;
return ""
};

export default MainContent;
