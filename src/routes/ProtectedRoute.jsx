import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const isAuth = useSelector((state) => state.isAuth);
  const authProcess = useSelector((state) => state.authProcess);

  // Если пользователь не авторизован, перенаправляем на главную
  if (!authProcess && !isAuth) {
    return <Navigate to="/" />;
  }

  // Если авторизован, показываем защищенный контент
  return children;
};

export default ProtectedRoute;
