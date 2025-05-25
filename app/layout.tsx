import './globals.css';
import Header from './components/Header';

export const metadata = {
  title: 'SenacAir',
  description: 'Sistema de venda de passagens aéreas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-gradient-to-b from-[#e3eaf5] to-[#cfd8e6] min-h-screen">
        <Header />
        {children}
      </body>
    </html>
  )
}
