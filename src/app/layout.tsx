import "./globals.css"
import { AuthProvider } from "@/hooks/useAuth"
import { Plus_Jakarta_Sans } from "next/font/google"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap"
})

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (

    <html lang="pt-BR" className={plusJakarta.variable}>

      <body className="font-sans">

        <AuthProvider>
          {children}
        </AuthProvider>

      </body>

    </html>

  )

}