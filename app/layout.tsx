import '../styles/globals.css'
import NavBar from '../components/NavBar'

export const metadata = {
  title: 'Uber Clean — Hospitals',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <main style={{ padding: 24 }}>{children}</main>
      </body>
    </html>
  )
}
