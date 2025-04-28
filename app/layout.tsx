import './ui/global.css';
import { Inter } from 'next/font/google';
import {
  ClerkProvider,
  SignInButton,
  SignUp,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './ui/global.css'
import { ModalProvider } from '@/providers/modal-provider';
import { ToasterProvider } from '@/providers/toast-provider';
const inter = Inter ({subsets:['latin']})
export const metadata = {
  title:"Admin Dashboard",
  description:"Admin Dashboard"

}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <ClerkProvider>
      <html lang="en">
        <body >
          <ToasterProvider/>
          <ModalProvider/>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
