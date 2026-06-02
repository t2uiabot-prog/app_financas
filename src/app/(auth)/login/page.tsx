import { LoginForm } from '@/components/auth/login-form'
import { TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 flex-col justify-between p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-xl p-2">
            <TrendingUp className="h-7 w-7" />
          </div>
          <span className="text-2xl font-bold">Minhas Finanças</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold mb-4 leading-tight">
            Controle seu dinheiro com clareza e simplicidade
          </h2>
          <p className="text-blue-100 text-lg">
            Registre receitas e despesas, visualize gráficos e tenha sempre uma visão clara das suas finanças.
          </p>
        </div>
        <div className="flex gap-8">
          <div>
            <div className="text-3xl font-bold">100%</div>
            <div className="text-blue-200 text-sm">Gratuito</div>
          </div>
          <div>
            <div className="text-3xl font-bold">Seguro</div>
            <div className="text-blue-200 text-sm">Seus dados protegidos</div>
          </div>
          <div>
            <div className="text-3xl font-bold">Visual</div>
            <div className="text-blue-200 text-sm">Dashboard em tempo real</div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Minhas Finanças</span>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Bem-vindo de volta</h1>
            <p className="text-gray-500 mb-8 text-sm">
              Entre para acessar seu dashboard financeiro
            </p>
            <LoginForm />
            <p className="text-center text-sm text-gray-500 mt-6">
              Não tem uma conta?{' '}
              <Link href="/signup" className="text-blue-600 hover:underline font-medium">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
