import './globals.css'

export const metadata = {
  title: 'Student Result Management System',
  description: 'Academic administration portal for managing student results',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}