import { Navigate } from 'react-router-dom';

const AdminRoute = ({ user, children }) => {
  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
