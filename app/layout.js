import './globals.css'

export const metadata = {
  title: 'zhngs blog',
  description: 'zhngs blog',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
