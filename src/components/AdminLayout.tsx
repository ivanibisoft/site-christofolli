import { Navigate, Outlet, Link } from 'react-router-dom'
import { LogOut, LayoutDashboard, Globe } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'

export default function AdminLayout() {
  const { isAuthenticated, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-500">Carregando painel...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/admin" className="font-bold text-xl text-primary flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-accent" />
              Admin
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
              <Link
                to="/admin/publications"
                className="text-slate-600 hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-slate-100"
              >
                Publicações
              </Link>
              <Link
                to="/admin/contacts"
                className="text-slate-600 hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-slate-100"
              >
                Contatos
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
              <Link to="/">
                <Globe className="h-4 w-4 mr-2 text-slate-500" />
                Ver Site
              </Link>
            </Button>
            <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
            <Button variant="outline" size="sm" onClick={signOut} className="text-slate-600">
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <Outlet />
      </main>
    </div>
  )
}
