"use client"

import { useState } from "react"
import CampaignCard from "@/components/CampaignCard"

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All")

  // Mock data - in real app, fetch from contract
  const campaigns = [
    { id: 1, title: "Save the Oceans", description: "Cleaning up plastic from the Pacific Ocean.", category: "Environment", goal: 1000, pledged: 450, deadline: 10000, owner: "SP3...", status: 0 },
    { id: 2, title: "Decentralized WiFi", description: "Mesh network for free internet access.", category: "Tech", goal: 5000, pledged: 1200, deadline: 12000, owner: "SP1...", status: 0 },
    { id: 3, title: "Indie Game", description: "A pixel art RPG built on Stacks.", category: "Art", goal: 500, pledged: 500, deadline: 9000, owner: "SP2...", status: 1 },
    { id: 4, title: "Community Garden", description: "Local food for local people.", category: "Community", goal: 200, pledged: 50, deadline: 11000, owner: "SP4...", status: 0 },
    { id: 5, title: "Failed Project", description: "This one didn't make it.", category: "Other", goal: 100, pledged: 0, deadline: 8000, owner: "SP5...", status: 2 },
  ]

  const categories = ["All", "Tech", "Art", "Community", "Environment", "Other"]

  const filteredCampaigns = activeCategory === "All" 
    ? campaigns 
    : campaigns.filter(c => c.category === activeCategory)

  return (
    <div className="space-y-8">
      <section className="text-center py-20 bg-gradient-to-b from-gray-50 to-white rounded-3xl border border-gray-100">
        <h1 className="text-5xl font-extrabold mb-6 tracking-tight">Fund the Future on Stacks</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            ImpactStarter is the first decentralized crowdfunding platform secured by Bitcoin. 
            Launch your idea with confidence.
        </p>
        <a href="/create" className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all">
            Start a Campaign
        </a>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Trending Campaigns</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                            activeCategory === cat 
                                ? "bg-black text-white" 
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>
        
        {filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((c) => (
                    <CampaignCard key={c.id} {...c} />
                ))}
            </div>
        ) : (
            <div className="text-center py-12 text-gray-500">
                No campaigns found in this category.
            </div>
        )}
      </section>
    </div>
  )
}
