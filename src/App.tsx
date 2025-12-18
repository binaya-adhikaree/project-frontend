import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";

import { AuthProvider } from "./context/AuthContext";
import { AuthContext } from "./context/AuthContext";

import PrivateRoute from "./components/PrivateRoute";
import { Navbar } from "./components/Navbar";
import PublicNavbar from "./pages/PublicNavbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Problems from "./pages/Problems";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import { AdminDashboard } from "./pages/AdminDashboard";
import { UserDashboard } from "./pages/UserDashboard";
import ExternalDashboard from "./pages/ExternalDashboard";

import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionManagement from "./components/SubscriptionManagement";

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  );
}

/* ---------------- PUBLIC ROUTE ---------------- */
function PublicRoute({ children }) {
  const { user } = useContext(AuthContext);

  if (user) {
    switch (user.role) {
      case "ADMIN":
        return <Navigate to="/admin" replace />;
      case "GASTRONOM":
        return <Navigate to="/user" replace />;
      case "EXTERNAL":
        return <Navigate to="/external" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
}

/* ---------------- MAIN LAYOUT ---------------- */
function MainLayout() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const publicRoutes = [
    "/",
    "/about",
    "/contact",
    "/problems",
    "/pricing",
    "/login",
    "/register",
  ];

  const showPublicNavbar = publicRoutes.includes(location.pathname) && !user;
  const showFooter = publicRoutes.includes(location.pathname) && !user;
  const showAuthNavbar = !!user;

  return (
    <>
      {showPublicNavbar && <PublicNavbar />}
      {showAuthNavbar && <Navbar />}

      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />

        {/* PUBLIC PAGES */}
        <Route path="/about" element={<PublicRoute><About /></PublicRoute>} />
        <Route path="/contact" element={<PublicRoute><Contact /></PublicRoute>} />
        <Route path="/problems" element={<PublicRoute><Problems /></PublicRoute>} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            user ? (
              user.role === "ADMIN" ? <Navigate to="/admin" replace /> :
              user.role === "GASTRONOM" ? <Navigate to="/user" replace /> :
              user.role === "EXTERNAL" ? <Navigate to="/external" replace /> :
              <Login />
            ) : (
              <Login />
            )
          }
        />

        {/* DASHBOARDS */}
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

        {/* SUBSCRIPTIONS */}
        <Route
          path="/dashboard/subscription/success"
          element={
            <PrivateRoute role="GASTRONOM">
              <SubscriptionSuccess />
            </PrivateRoute>
          }
        />

        <Route
          path="/user/subscription"
          element={
            <PrivateRoute role="GASTRONOM">
              <SubscriptionManagement />
            </PrivateRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showFooter && <Footer />}
    </>
  );
}

export default App;
