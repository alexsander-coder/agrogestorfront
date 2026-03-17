import Link from "next/link"
import RegisterForm from "@/components/forms/RegisterForm"
import AuthCard from "@/components/ui/AuthCard"
import AuthSplitLayout from "@/components/ui/AuthSplitLayout"

export default function RegisterPage() {
  return (
    <AuthSplitLayout>
      <AuthCard title="Criar conta">
        <RegisterForm />
        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm">
          <Link
            href="/login"
            className="text-rocket-primary hover:text-rocket-dark transition-colors"
          >
            Já tenho conta
          </Link>
        </div>
      </AuthCard>
    </AuthSplitLayout>
  )
}
