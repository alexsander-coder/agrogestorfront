interface AuthSplitLayoutProps {
  children: React.ReactNode
}

export default function AuthSplitLayout({ children }: AuthSplitLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-rocket-bg px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex">
        {/* Painel esquerdo: branding — mesmo tamanho do formulário, some abaixo de 700px */}
        <aside className="hidden min-[701px]:flex w-1/2 items-center justify-center bg-rocket-dark text-white p-8 border-r border-white/10">
          <div className="max-w-sm space-y-4">
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.25em] text-rocket-light">
                Agro Gestor
              </p>
            </div>
            <h2 className="text-3xl font-bold leading-tight">
              Tecnologia que impulsiona o campo.
            </h2>
            <p className="text-rocket-light text-base leading-relaxed">
              Centralize operações, acompanhe safras e tome decisões com dados em tempo real.
            </p>
          </div>
        </aside>

        {/* Painel direito: formulário — ocupa toda a largura abaixo de 700px */}
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
