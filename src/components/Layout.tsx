import { useEffect, useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Linkedin, Mail, Phone, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import logoImg from '@/assets/logo-2dhsf2-christofolli-consultoria-a4665.png'

export default function Layout() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (location.hash) {
      const scrollToElement = (attempts: number) => {
        const element = document.querySelector(location.hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        } else if (attempts > 0) {
          setTimeout(() => scrollToElement(attempts - 1), 100)
        }
      }
      scrollToElement(10)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [location.pathname, location.hash])

  const navItems = [
    { name: 'Início', path: '/' },
    { name: 'Para Construtoras', path: '/construtoras' },
    { name: 'Para Concreteiras', path: '/concreteiras' },
    { name: 'Portfólio', path: '/portfolio' },
    { name: 'Blog', path: '/blog' },
    { name: 'Sobre', path: '/sobre' },
  ]

  const mobileNavItems = [
    { name: 'Início', path: '/' },
    { name: 'Para Construtoras', path: '/construtoras' },
    { name: 'Para Concreteiras', path: '/concreteiras' },
    { name: 'Portfólio', path: '/portfolio' },
    { name: 'Blog', path: '/blog' },
    { name: 'Sobre', path: '/sobre' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pattern-grid">
      <header className="sticky top-0 z-50 glass-header">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={logoImg}
              alt="Christófolli Consultoria de Engenharia"
              className="h-[5.625rem] w-auto md:h-[6.75rem]"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-accent relative py-2',
                  location.pathname === item.path ? 'text-accent' : 'text-secondary',
                )}
              >
                {item.name}
                {location.pathname === item.path && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent rounded-full animate-fade-in" />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button asChild className="bg-accent hover:bg-accent/90 text-white font-semibold">
              <Link to="/#contato">Solicitar Consultoria</Link>
            </Button>
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Abrir menu de navegação"
              >
                <Menu className="h-6 w-6 text-secondary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[340px] p-0">
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
                <img
                  src={logoImg}
                  alt="Christófolli Consultoria de Engenharia"
                  className="h-12 w-auto"
                />
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" aria-label="Fechar menu">
                    <X className="h-5 w-5 text-secondary" />
                  </Button>
                </SheetClose>
              </div>
              <nav className="flex flex-col px-6 py-6 gap-1">
                {mobileNavItems.map((item) => (
                  <SheetClose asChild key={item.path}>
                    <Link
                      to={item.path}
                      className={cn(
                        'flex items-center min-h-[44px] px-4 py-3 rounded-lg text-base font-medium transition-colors hover:bg-accent/10 hover:text-accent',
                        location.pathname === item.path.split('#')[0] &&
                          (item.path.includes('#') ? false : true)
                          ? 'text-accent bg-accent/5'
                          : 'text-secondary',
                      )}
                    >
                      {item.name}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="px-6 mt-4">
                <SheetClose asChild>
                  <Button
                    asChild
                    className="w-full bg-accent hover:bg-accent/90 text-white font-semibold"
                  >
                    <Link to="/#contato">Solicitar Consultoria</Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      <footer className="bg-slate-100 text-slate-700 py-12 border-t border-slate-200">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <img
                src={logoImg}
                alt="Christófolli Consultoria de Engenharia"
                className="h-[5.625rem] w-auto md:h-[6.75rem] transition-opacity hover:opacity-80"
              />
            </Link>
            <p className="text-sm text-slate-600 max-w-sm mb-6">
              Engenharia de Resultados. Consultoria técnica e operacional especializada em centrais
              de concreto, focada em produtividade e excelência.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/jorge-christofolli-4b4aaa73/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-700 hover:text-accent transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:jorge@christofolli.com.br"
                className="text-slate-700 hover:text-accent transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="tel:+5541999211183"
                className="text-slate-700 hover:text-accent transition-colors"
              >
                <Phone className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-primary mb-4">Serviços</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/construtoras"
                  className="text-slate-600 hover:text-accent transition-colors"
                >
                  Para Construtoras
                </Link>
              </li>
              <li>
                <Link
                  to="/concreteiras"
                  className="text-slate-600 hover:text-accent transition-colors"
                >
                  Para Concreteiras
                </Link>
              </li>
              <li>
                <Link
                  to="/portfolio"
                  className="text-slate-600 hover:text-accent transition-colors"
                >
                  Portfólio
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-primary mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:jorge@christofolli.com.br"
                  className="flex items-center gap-2 text-slate-600 hover:text-accent transition-colors"
                >
                  <Mail className="h-4 w-4 text-accent" /> jorge@christofolli.com.br
                </a>
              </li>
              <li>
                <a
                  href="tel:+5541999211183"
                  className="flex items-center gap-2 text-slate-600 hover:text-accent transition-colors"
                >
                  <Phone className="h-4 w-4 text-accent" /> (41) 99921-1183
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/jorge-christofolli-4b4aaa73/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-slate-600 hover:text-accent transition-colors"
                >
                  <Linkedin className="h-4 w-4 text-accent" /> Jorge Christofolli
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-200 text-sm text-slate-500 text-center">
          © {new Date().getFullYear()} Christófolli Consultoria de Engenharia Ltda. Todos os
          direitos reservados.
        </div>
      </footer>
    </div>
  )
}
