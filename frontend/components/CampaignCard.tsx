import Link from "next/link"

interface CampaignProps {
  id: number
  title: string
  goal: number
  pledged: number
  deadline: number
  owner: string
}

export default function CampaignCard({ id, title, goal, pledged, deadline, owner }: CampaignProps) {
  const progress = Math.min((pledged / goal) * 100, 100)
  
  return (
    <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4 truncate">by {owner}</p>
      
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm font-medium">
            <span>{pledged} STX raised</span>
            <span>{goal} STX goal</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
                className="bg-black h-2 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
            ></div>
        </div>
        <p className="text-xs text-right text-gray-500">{progress.toFixed(0)}% funded</p>
      </div>
      
      <Link 
        href={`/campaign/${id}`}
        className="block w-full text-center bg-black text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
      >
        View Campaign
      </Link>
    </div>
  )
}
