
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import ListingDetail from "./pages/ListingDetail";
import CategoryPage from "./pages/CategoryPage";
import CategoriesList from "./pages/CategoriesList";
import CreateListing from "./pages/CreateListing";
import SearchResults from "./pages/SearchResults";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Help from "./pages/Help";
import Dashboard from "./pages/Dashboard";
import MyListings from "./pages/MyListings";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import TermsOfService from "./pages/legal/TermsOfService";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import LegalNotice from "./pages/legal/LegalNotice";
import CookiePolicy from "./pages/legal/CookiePolicy";
import { Messages } from "./pages/Messages";
import MyReservations from "./pages/MyReservations";



const App = () => (
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/annonces/:id" element={<ListingDetail />} />
            <Route path="/categories" element={<CategoriesList />} />
            <Route path="/categories/:categoryId" element={<CategoryPage />} />
            <Route path="/deposer-annonce" element={<CreateListing />} />
            <Route path="/recherche" element={<SearchResults />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:conversationId" element={<Messages />} />
            <Route path="/mes-reservations" element={<MyReservations />} />
            <Route path="/tableau-de-bord" element={<Dashboard />} />
            <Route path="/mes-annonces" element={<MyListings />} />
            <Route path="/favoris" element={<Favorites />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/profil/:userId" element={<Profile />} />
            <Route path="/parametres" element={<Settings />} />
            <Route path="/a-propos" element={<About />} />
            <Route path="/aide" element={<Help />} />
            <Route path="/comment-ca-marche" element={<HowItWorks />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/conditions-generales" element={<TermsOfService />} />
            <Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
            <Route path="/mentions-legales" element={<LegalNotice />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

export default App;
