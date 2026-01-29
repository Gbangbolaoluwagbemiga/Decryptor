"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { userSession } from "@/components/Navbar"
import { openContractCall } from "@stacks/connect"
import { fetchCallReadOnlyFunction, uintCV } from "@stacks/transactions"
import { STACKS_MAINNET } from "@stacks/network"

export default function CampaignDetails() {
    const { id } = useParams()
    const [campaign, setCampaign] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [amount, setAmount] = useState("")

    useEffect(() => {
        if (id) fetchCampaign()
    }, [id])

    const fetchCampaign = async () => {
        const network = STACKS_MAINNET
        const result = await fetchCallReadOnlyFunction({
            contractAddress: "SP2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA516AKZP",
            contractName: "crowdfunding-v2",
            functionName: "get-campaign",
            functionArgs: [uintCV(parseInt(id as string))],
            senderAddress: "SP2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA516AKZP",
            network,
        })
        
        // This needs parsing of the returned Clarity Value
        // For simplicity, we assume result is accessible or mock for now if parsing is complex without CV helper
        // But let's try to log it
        console.log(result)
        // In a real app, you would use cvToValue(result) or similar
        setCampaign(result) // Placeholder
        setLoading(false)
    }

    const handlePledge = async () => {
        if (!userSession.isUserSignedIn()) return alert("Connect wallet")
        
        const options = {
            contractAddress: "SP2QNSNKR3NRDWNTX0Q7R4T8WGBJ8RE8RA516AKZP",
            contractName: "crowdfunding-v2",
            functionName: "pledge",
            functionArgs: [uintCV(parseInt(id as string)), uintCV(parseInt(amount))],
            onFinish: (data: any) => alert("Pledged!"),
        }
        openContractCall(options)
    }

    if (loading) return <div className="p-12 text-center">Loading campaign...</div>

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-4">Campaign #{id}</h1>
            <div className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="mb-4">
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">Category: Tech</span>
                    <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Active</span>
                </div>
                <p className="text-gray-600 mb-6">Campaign Description goes here...</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <p className="text-sm text-gray-500">Goal</p>
                        <p className="text-xl font-bold">1000 STX</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Raised</p>
                        <p className="text-xl font-bold">0 STX</p>
                    </div>
                </div>

                <div className="border-t pt-6">
                    <label className="block text-sm font-medium mb-2">Pledge Amount (STX)</label>
                    <div className="flex gap-2">
                        <input 
                            type="number" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="flex-1 border rounded-md p-2"
                            placeholder="Amount"
                        />
                        <button 
                            onClick={handlePledge}
                            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
                        >
                            Pledge
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
