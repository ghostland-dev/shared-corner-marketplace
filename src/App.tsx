
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import ListingDetail from "./pages/ListingDetail";
import CategoryPage from "./pages/CategoryPage";
import CategoriesList from "./pages/CategoriesList";
import CreateListing from "./pages/CreateListing";
import SearchResults from "./pages/SearchResults";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/annonces/:id" element={<ListingDetail />} />
          <Route path="/categories" element={<CategoriesList />} />
          <Route path="/categories/:categoryId" element={<CategoryPage />} />
          <Route path="/deposer-annonce" element={<CreateListing />} />
          <Route path="/recherche" element={<SearchResults />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
