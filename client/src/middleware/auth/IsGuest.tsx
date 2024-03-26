import { LinearProgress } from "@mui/material";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";

const IsGuest = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const { isLoggedIn, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return <LinearProgress color="primary" />;
  }

  if (isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default IsGuest;
