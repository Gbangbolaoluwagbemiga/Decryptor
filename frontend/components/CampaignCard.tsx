import Link from "next/link"

interface CampaignProps {
  id: number
  title: string
  description?: string
  category?: string
  goal: number
  pledged: number
  deadline: number
  owner: string
  status?: number // 0=Active, 1=Funded, 2=Cancelled
}

export default function CampaignCard({ id, title, description, category, goal, pledged, deadline, owner, status = 0 }: CampaignProps) {
  const progress = Math.min((pledged / goal) * 100, 100)
  const isCancelled = status === 2
  
  return (
    <div className={`border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full ${isCancelled ? 'opacity-75 bg-gray-50' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold">{title}</h3>
        {category && (
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-200">
                {category}
            </span>
        )}
      </div>
      
      {description && <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>}
      
      <p className="text-xs text-gray-400 mb-4 truncate font-mono">{owner}</p>
      
      <div className="space-y-2 mb-6 mt-auto">
        <div className="flex justify-between text-sm font-medium">
            <span>{pledged} STX raised</span>
            <span>{goal} STX goal</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
                className={`h-2 rounded-full transition-all duration-500 ${isCancelled ? 'bg-red-500' : 'bg-black'}`}
                style={{ width: `${progress}%` }}
            ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
            <span>{progress.toFixed(0)}% funded</span>
            {isCancelled && <span className="text-red-600 font-bold">CANCELLED</span>}
        </div>
      </div>
      
      <Link 
        href={`/campaign/${id}`}
        className={`block w-full text-center py-2 rounded-md transition-colors ${isCancelled ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
      >
        {isCancelled ? 'View Details' : 'View Campaign'}
      </Link>
    </div>
  )
}
