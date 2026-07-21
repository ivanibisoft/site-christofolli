import { useEffect } from 'react'
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom'
import {
  FileText,
  Mail,
  LogOut,
  Menu,
  Image as ImageIcon,
  Building2,
  Tag,
  Server,
  BarChart3,
  ClipboardList,
  Clock,
} from 'lucide-react'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Perfil da Empresa', href: '/admin/company-profile', icon: Building2 },
  { name: 'Publicações', href: '/admin/publications', icon: FileText },
  { name: 'Galeria', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Resultados Estatísticos', href: '/admin/statistical-results', icon: BarChart3 },
  { name: 'Trajetória', href: '/admin/timeline', icon: Clock },
  { name: 'Serviços de Auditoria', href: '/admin/audit-services', icon: ClipboardList },
  { name: 'Categorias', href: '/admin/categories', icon: Tag },

  { name: 'Contatos', href: '/admin/contacts', icon: Mail },
  { name: 'Configurações de E-mail', href: '/admin/smtp-settings', icon: Server },
]

export default function AdminLayout() {
  const { user, isAuthenticated, loading, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login')
    }
  }, [loading, isAuthenticated, navigate])

  if (loading || !isAuthenticated) {
    return null
  }

  const handleSignOut = () => {
    signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-slate-900 border-r border-slate-800">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <span className="text-lg font-bold text-white tracking-tight">Admin Panel</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href)
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 mb-4">
            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-primary font-bold text-sm uppercase">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-50 flex items-center justify-between px-4">
        <span className="text-lg font-bold text-white tracking-tight">Admin Panel</span>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 bg-slate-900 border-r-slate-800 p-0 text-slate-300"
          >
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
              <span className="text-lg font-bold text-white tracking-tight">Menu</span>
            </div>
            <nav className="p-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0 md:pt-0 pt-16">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
