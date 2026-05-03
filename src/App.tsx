import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import PublicLayout from "@/components/PublicLayout";
import AdminLayout from "@/components/AdminLayout";
import HomePage from "@/pages/HomePage";
import RoomsPage from "@/pages/RoomsPage";
import BookingPage from "@/pages/BookingPage";
import PromosPage from "@/pages/PromosPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminBookings from "@/pages/admin/AdminBookings";
import AdminReceipts from "@/pages/admin/AdminReceipts";
import AdminRooms from "@/pages/admin/AdminRooms";
import AdminSnacksDrinks from "@/pages/admin/AdminSnacksDrinks";
import FoodsPage from "@/pages/FoodsPage";
import NotFound from "./pages/NotFound.tsx";

import LogoSplash from "@/components/LogoSplash";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <LogoSplash />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/rooms" element={<PublicLayout><RoomsPage /></PublicLayout>} />
            <Route path="/booking" element={<PublicLayout><BookingPage /></PublicLayout>} />
            <Route path="/promos" element={<PublicLayout><PromosPage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/foods" element={<PublicLayout><FoodsPage /></PublicLayout>} />

            {/* Admin */}

            <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
            <Route path="/admin/bookings" element={<AdminLayout><AdminBookings /></AdminLayout>} />
            <Route path="/admin/receipts" element={<AdminLayout><AdminReceipts /></AdminLayout>} />
            <Route path="/admin/rooms" element={<AdminLayout><AdminRooms /></AdminLayout>} />
            <Route path="/admin/snacks-drinks" element={<AdminLayout><AdminSnacksDrinks /></AdminLayout>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

