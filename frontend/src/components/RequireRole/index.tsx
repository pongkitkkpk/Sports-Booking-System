import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

interface RequireRoleProps {
  roles: string[];
  children: ReactNode;
}

// ใช้ภายใน <Authenticated> เท่านั้น (สมมติว่า login แล้ว) — ปิดกั้นหน้าที่จำกัด
// เฉพาะบาง role เช่น admin โดย role อื่นที่หลงเข้ามาทาง URL ตรง ๆ จะถูกเด้งกลับไปหน้าจองสนาม
const RequireRole: FC<RequireRoleProps> = ({ roles, children }) => {
  const { user } = useAuth();

  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/extended-sidebar/dashboards/reserve" replace />;
  }

  return <>{children}</>;
};

export default RequireRole;
