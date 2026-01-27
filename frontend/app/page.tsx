import CampaignCard from "@/components/CampaignCard"

export default function Home() {
  // Mock data
  const campaigns = [
    { id: 1, title: "Save the Oceans", goal: 1000, pledged: 450, deadline: 10000, owner: "SP3..." },
    { id: 2, title: "Decentralized WiFi", goal: 5000, pledged: 1200, deadline: 12000, owner: "SP1..." },
    { id: 3, title: "Indie Game", goal: 500, pledged: 500, deadline: 9000, owner: "SP2..." },
  ]

  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-gray-50 rounded-2xl">
        <h1 className="text-4xl font-bold mb-4">Fund the Future on Stacks</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            ImpactStarter is the first decentralized crowdfunding platform secured by Bitcoin.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Trending Campaigns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((c) => (
                <CampaignCard key={c.id} {...c} />
            ))}
        </div>
      </section>
    </div>
  )
}
