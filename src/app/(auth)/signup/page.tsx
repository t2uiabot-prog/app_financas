import { SignupForm } from '@/components/auth/signup-form'
import { TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">Minhas Finanças</span>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Criar conta</h1>
          <p className="text-gray-500 mb-8 text-sm">
            Comece a controlar suas finanças gratuitamente
          </p>
          <SignupForm />
          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
