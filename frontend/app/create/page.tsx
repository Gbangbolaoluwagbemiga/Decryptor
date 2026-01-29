"use client"

import { useState } from "react"
import { userSession } from "@/components/Navbar"
import { openContractCall } from "@stacks/connect"
import { uintCV, stringAsciiCV } from "@stacks/transactions"

export default function CreateCampaign() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Tech")
  const [goal, setGoal] = useState("")
  const [deadline, setDeadline] = useState("")
  
  const categories = ["Tech", "Art", "Community", "Environment", "Other"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userSession.isUserSignedIn()) {
      alert("Please connect wallet")
      return
    }

    const options = {
      contractAddress: "SP2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA516AKZP",
      contractName: "crowdfunding-v2",
      functionName: "create-campaign",
      functionArgs: [
        stringAsciiCV(title),
        stringAsciiCV(description),
        stringAsciiCV(category),
        uintCV(parseInt(goal)),
        uintCV(parseInt(deadline))
      ],
      appDetails: {
        name: "ImpactStarter",
        icon: window.location.origin + "/favicon.ico",
      },
      onFinish: (data: any) => {
        console.log("TxId:", data.txId)
        alert("Transaction broadcasted!")
      },
    }

    openContractCall(options)
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Create a Campaign</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-md p-2"
                required
                maxLength={50}
            />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-md p-2"
                required
                maxLength={256}
                rows={3}
            />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-md p-2"
            >
                {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Goal (STX)</label>
            <input 
                type="number" 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full border rounded-md p-2"
                required
            />
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Deadline (Block Height)</label>
            <input 
                type="number" 
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full border rounded-md p-2"
                required
            />
        </div>
        <button 
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
        >
            Create Campaign
        </button>
      </form>
    </div>
  )
}
