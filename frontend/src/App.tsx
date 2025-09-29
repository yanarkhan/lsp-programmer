import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import PemesananPage from "./pages/pelanggan/PemesananPage";
import KeranjangPage from "./pages/pelanggan/KeranjangPage";
import PesananSayaPage from "./pages/pelanggan/PesananSayaPage";
import StokPage from "./pages/admin/StokPage";
import PesananAdminPage from "./pages/admin/PesananAdminPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import HistoriPembayaranPage from "./pages/admin/HistoriPembayaranPage";

function HomeRedirect() {
  const { pengguna } = useAuth();
  if (!pengguna) return <Navigate to="/login" replace />;
  return pengguna.peran === "admin" ? (
    <Navigate to="/admin/stok" replace />
  ) : (
    <Navigate to="/menu" replace />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/menu"
          element={
            <ProtectedRoute role="pelanggan">
              <PemesananPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/keranjang"
          element={
            <ProtectedRoute role="pelanggan">
              <KeranjangPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pesanan-saya"
          element={
            <ProtectedRoute role="pelanggan">
              <PesananSayaPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/stok"
          element={
            <ProtectedRoute role="admin">
              <StokPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pesanan"
          element={
            <ProtectedRoute role="admin">
              <PesananAdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/pembayaran"
          element={
            <ProtectedRoute role="admin">
              <HistoriPembayaranPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
