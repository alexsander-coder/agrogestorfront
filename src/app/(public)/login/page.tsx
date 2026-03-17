import Link from "next/link"
import LoginForm from "@/components/forms/LoginForm"
import AuthCard from "@/components/ui/AuthCard"
import AuthSplitLayout from "@/components/ui/AuthSplitLayout"

export default function LoginPage() {
  return (
    <AuthSplitLayout>
      <AuthCard title="Agro Gestor">
        <LoginForm />
        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-center items-center gap-6 text-sm">
          <Link
            href="/register"
            className="text-rocket-primary underline underline-offset-4 hover:decoration-2"
          >
            Criar conta
          </Link>

          <Link
            href="/forgot-password"
            className="underline text-rocket-muted hover:text-rocket-dark transition-colors"
          >
            Recuperar senha
          </Link>
        </div>
      </AuthCard>
    </AuthSplitLayout>
  )
}
