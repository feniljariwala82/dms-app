import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import APIInstance from "../config/APIInstance";
import { useGetUserQuery, useLogoutMutation } from "../features/auth/authApi";
import {
  logout as logoutAction,
  setLoading,
  setUser,
} from "../features/auth/authSlice";

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
}

const drawerWidth = 240;
const navItems: { label: string; isGuest: boolean; redirect?: string }[] = [
  { label: "Home", isGuest: false, redirect: "/" },
  { label: "Login", isGuest: true, redirect: "/login" },
  { label: "Signup", isGuest: true, redirect: "/signup" },
  { label: "Logout", isGuest: false },
];

const MainLayout = (props: Props) => {
  // hooks
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const { data, isLoading, isError } = useGetUserQuery("User");

  // states
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    if (!isLoading && !isError) {
      dispatch(setUser(data));
      dispatch(setLoading(false));

      // setting axios token on each server get user request
      const token = localStorage.getItem("auth_token");
      if (token) {
        // alter defaults after instance has been created
        APIInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;
      }
    } else if (isError) {
      dispatch(setLoading(false));
      dispatch(logoutAction());
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isError, dispatch]);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const logoutHandler = async () => {
    await logout("logout").unwrap();
    dispatch(logoutAction());
    navigate("/login");
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        {navItems.map(({ label, isGuest, redirect }) => {
          if (isLoggedIn && !isGuest) {
            return (
              <ListItem
                key={label}
                disablePadding
                onClick={label === "Logout" ? logoutHandler : undefined}
              >
                <ListItemButton
                  sx={{ textAlign: "center" }}
                  onClick={() => {
                    if (redirect) {
                      navigate(redirect);
                    }
                  }}
                >
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            );
          } else if (!isLoggedIn && isGuest) {
            return (
              <ListItem key={label} disablePadding>
                <ListItemButton
                  sx={{ textAlign: "center" }}
                  onClick={() => {
                    if (redirect) {
                      navigate(redirect);
                    }
                  }}
                >
                  <ListItemText primary={label} />
                </ListItemButton>
              </ListItem>
            );
          }
        })}
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar component="nav">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              DMS
            </Typography>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              {navItems.map(({ label, isGuest, redirect }) => {
                if (isLoggedIn && !isGuest) {
                  return (
                    <Button
                      key={label}
                      sx={{ color: "#fff" }}
                      onClick={label === "Logout" ? logoutHandler : undefined}
                    >
                      {label}
                    </Button>
                  );
                } else if (!isLoggedIn && isGuest) {
                  return (
                    <Button
                      key={label}
                      sx={{ color: "#fff" }}
                      onClick={() => {
                        if (redirect) {
                          navigate(redirect);
                        }
                      }}
                    >
                      {label}
                    </Button>
                  );
                }
              })}
            </Box>
          </Toolbar>
        </AppBar>
        <nav>
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        </nav>
      </Box>

      <Box component="main">
        <Toolbar />
        {/* main outlet */}
        <Outlet />
      </Box>
    </>
  );
};

export default MainLayout;
