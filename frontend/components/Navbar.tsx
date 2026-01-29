"use client"

import { AppConfig, UserSession, showConnect } from "@stacks/connect"
import { useEffect, useState } from "react"
import Link from "next/link"
import { getUserSession } from "@/lib/userSession"

export default function Navbar() {
  const [userData, setUserData] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const userSession = getUserSession()
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData)
      })
    } else if (userSession.isUserSignedIn()) {
      setUserData(userSession.loadUserData())
    }
  }, [])

  const connectWallet = () => {
    const userSession = getUserSession()
    showConnect({
      appDetails: {
        name: "ImpactStarter",
        icon: window.location.origin + "/favicon.ico",
      },
      redirectTo: "/",
      onFinish: () => {
        window.location.reload()
      },
      userSession,
    })
  }

  const disconnectWallet = () => {
    const userSession = getUserSession()
    userSession.signUserOut("/")
    setUserData(null)
  }

  if (!mounted) return null

  return (
    <nav className="flex items-center justify-between p-4 border-b bg-white">
      <Link href="/" className="text-xl font-bold">ImpactStarter</Link>
      <div className="flex items-center gap-4">
        <Link href="/create" className="text-sm font-medium hover:underline">
            Start Campaign
        </Link>
        {userData ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 truncate max-w-[150px]">
              {userData.profile.stxAddress.testnet}
            </span>
            <button
              onClick={disconnectWallet}
              className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="px-4 py-2 text-sm text-white bg-black rounded-md hover:bg-gray-800"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  )
}
