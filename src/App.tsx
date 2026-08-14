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
import Blog from './pages/Blog'
import Sobre from './pages/Sobre'
import PublicationDetail from './pages/PublicationDetail'
import NotFound from './pages/NotFound'
import Login from './pages/admin/Login'
import ForgotPassword from './pages/admin/ForgotPassword'
import PublicationsList from './pages/admin/PublicationsList'
import PublicationForm from './pages/admin/PublicationForm'
import ContactsList from './pages/admin/ContactsList'
import GalleryList from './pages/admin/GalleryList'
import GalleryForm from './pages/admin/GalleryForm'
import StatisticalResultsList from './pages/admin/StatisticalResultsList'
import StatisticalResultsForm from './pages/admin/StatisticalResultsForm'
import AuditServicesList from './pages/admin/AuditServicesList'
import AuditServiceForm from './pages/admin/AuditServiceForm'
import BuilderServicesList from './pages/admin/BuilderServicesList'
import BuilderServiceForm from './pages/admin/BuilderServiceForm'
import CustomIconsList from './pages/admin/CustomIconsList'
import PageSettingsPage from './pages/admin/PageSettings'
import TimelineList from './pages/admin/TimelineList'
import TimelineForm from './pages/admin/TimelineForm'
import CategoriesList from './pages/admin/CategoriesList'
import UsersList from './pages/admin/UsersList'

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
            <Route path="/blog" element={<Blog />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/publicacoes/:id" element={<PublicationDetail />} />
          </Route>

          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
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
            <Route path="audit-services" element={<AuditServicesList />} />
            <Route path="audit-services/new" element={<AuditServiceForm />} />
            <Route path="audit-services/:id" element={<AuditServiceForm />} />
            <Route path="builder-services" element={<BuilderServicesList />} />
            <Route path="builder-services/new" element={<BuilderServiceForm />} />
            <Route path="builder-services/:id" element={<BuilderServiceForm />} />
            <Route path="custom-icons" element={<CustomIconsList />} />
            <Route path="page-settings" element={<PageSettingsPage />} />
            <Route path="timeline" element={<TimelineList />} />{' '}
            <Route path="timeline/new" element={<TimelineForm />} />
            <Route path="timeline/:id" element={<TimelineForm />} />
            <Route path="categories" element={<CategoriesList />} />
            <Route path="users" element={<UsersList />} />
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
