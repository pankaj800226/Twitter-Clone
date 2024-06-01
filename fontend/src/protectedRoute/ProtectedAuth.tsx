import { Navigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
}

export const ProtectedAuth = ({ children }: { children: React.ReactNode }) => {
  const userString = localStorage.getItem("user");
  const user: User = userString ? JSON.parse(userString) : null;

  if (user) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login" />;
  }
};
