import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserDashboard } from "./pages/UserDashboard";
import PrivateRoute from "./components/PrivateRoute";
import { Navbar } from "./components/Navbar";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import ExternalDashboard from "./pages/ExternalDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  );
}

function MainLayout() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const hideNavbarRoutes = ["/", "/login"];
  const shouldShowNavbar = user && !hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/admin/*"
          element={
            <PrivateRoute role="ADMIN">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/user/*"
          element={
            <PrivateRoute role="GASTRONOM">
              <UserDashboard />
            </PrivateRoute>
          }
        />

          <Route
          path="/external/*"
          element={
            <PrivateRoute role="EXTERNAL">
              <ExternalDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
