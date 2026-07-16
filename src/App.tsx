import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/use-auth'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import Index from './pages/Index'
import Construtoras from './pages/Construtoras'
import Concreteiras from './pages/Concreteiras'
import Portfolio from './pages/Portfolio'
import Sobre from './pages/Sobre'
import NotFound from './pages/NotFound'
import Login from './pages/admin/Login'
import PublicationsList from './pages/admin/PublicationsList'
import PublicationForm from './pages/admin/PublicationForm'
import ContactsList from './pages/admin/ContactsList'
import GalleryList from './pages/admin/GalleryList'
import GalleryForm from './pages/admin/GalleryForm'
import StatisticalResultsList from './pages/admin/StatisticalResultsList'
import StatisticalResultsForm from './pages/admin/StatisticalResultsForm'
import CategoriesList from './pages/admin/CategoriesList'
import CompanyProfilePage from './pages/admin/CompanyProfile'
import SmtpSettingsPage from './pages/admin/SmtpSettings'

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/construtoras" element={<Construtoras />} />
            <Route path="/concreteiras" element={<Concreteiras />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/sobre" element={<Sobre />} />
          </Route>

          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/publications" replace />} />
            <Route path="publications" element={<PublicationsList />} />
            <Route path="publications/new" element={<PublicationForm />} />
            <Route path="publications/:id" element={<PublicationForm />} />
            <Route path="gallery" element={<GalleryList />} />
            <Route path="gallery/new" element={<GalleryForm />} />
            <Route path="gallery/:id" element={<GalleryForm />} />
            <Route path="statistical-results" element={<StatisticalResultsList />} />
            <Route path="statistical-results/new" element={<StatisticalResultsForm />} />
            <Route path="statistical-results/:id" element={<StatisticalResultsForm />} />
            <Route path="categories" element={<CategoriesList />} />
            <Route path="company-profile" element={<CompanyProfilePage />} />
            <Route path="smtp-settings" element={<SmtpSettingsPage />} />
            <Route path="contacts" element={<ContactsList />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
