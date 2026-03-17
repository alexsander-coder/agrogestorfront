import Link from "next/link"
import RecoverPasswordForm from "@/components/forms/RecoverPasswordForm"
import AuthCard from "@/components/ui/AuthCard"
import AuthSplitLayout from "@/components/ui/AuthSplitLayout"

export default function ForgotPasswordPage() {
  return (
    <AuthSplitLayout>
      <AuthCard title="Recuperar acesso">
        <RecoverPasswordForm />
        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm">
          <Link
            href="/login"
            className="text-rocket-primary hover:text-rocket-dark transition-colors"
          >
            Voltar para login
          </Link>
        </div>
      </AuthCard>
    </AuthSplitLayout>
  )
}
