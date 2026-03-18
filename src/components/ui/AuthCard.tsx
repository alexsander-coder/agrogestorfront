interface AuthCardProps {
  title: string
  children: React.ReactNode
}

export default function AuthCard({ title, children }: AuthCardProps) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-[#0d2418] mb-8 text-center min-[701px]:text-center">
        {title}
      </h1>
      {children}
    </div>
  )
}
