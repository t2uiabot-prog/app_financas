'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { TrendingUp, Menu, X, LayoutDashboard, ArrowLeftRight, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transacoes', label: 'Transações', icon: ArrowLeftRight },
]

interface MobileHeaderProps {
  userEmail?: string
}

export function MobileHeader({ userEmail }: MobileHeaderProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Até logo!')
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 rounded-md p-1">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">Minhas Finanças</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />
      )}

      <nav
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-100 transition-transform duration-200 lg:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-md p-1">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Minhas Finanças</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <Icon className={cn('h-4 w-4', isActive ? 'text-blue-600' : 'text-gray-400')} />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 px-3 mb-3 truncate">{userEmail}</p>
          <Button variant="ghost" size="sm" className="w-full justify-start text-gray-500 hover:text-red-600" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </nav>
    </>
  )
}
