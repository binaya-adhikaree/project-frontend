import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import { AdminDashboard } from "./pages/AdminDashboard";
import { UserDashboard } from "./pages/UserDashboard";
import PrivateRoute from "./components/PrivateRoute";
import { Navbar } from "./components/Navbar";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import ExternalDashboard from "./pages/ExternalDashboard";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PublicNavbar from "./pages/PublicNavbar";
import Pricing from "./pages/Pricing";
import Problems from "./pages/Problems";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionManagement from "./components/SubscriptionManagement";
import Footer from "./components/Footer";

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  );
}


function AuthenticatedRedirect() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Home />;
  }

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


function PublicRoute({ children }: { children: React.ReactNode }) {
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

  return <>{children}</>;
}

function MainLayout() {
  const { user } = useContext(AuthContext);
  const location = useLocation();

  const publicRoutesWithNavbar = ["/", "/home", "/about", "/contact", "/problems", "/login"];
  const shouldShowPublicNavbar = publicRoutesWithNavbar.includes(location.pathname) && !user;
  const shouldShowFooter = publicRoutesWithNavbar.includes(location.pathname) && !user;

  const shouldShowAuthNavbar = user !== null;

  return (
    <>
      {shouldShowPublicNavbar && <PublicNavbar />}
      {shouldShowAuthNavbar && <Navbar />}

      <Routes>

        <Route path="/" element={<AuthenticatedRedirect />} />
        <Route
          path="/home"
          element={
            <PublicRoute>
              <Home />
            </PublicRoute>
          }
        />
        <Route
          path="/about"
          element={
            <PublicRoute>
              <About />
            </PublicRoute>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicRoute>
              <Contact />
            </PublicRoute>
          }
        />
        <Route
          path="/problems"
          element={
            <PublicRoute>
              <Problems />
            </PublicRoute>
          }
        />


        <Route path="/pricing" element={<Pricing />} />


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


        <Route
          path="*"
          element={
            user ? (
              user.role === "ADMIN" ? <Navigate to="/admin" replace /> :
                user.role === "GASTRONOM" ? <Navigate to="/user" replace /> :
                  user.role === "EXTERNAL" ? <Navigate to="/external" replace /> :
                    <Navigate to="/" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>

      {shouldShowFooter && <Footer />}
    </>
  );
}

export default App;