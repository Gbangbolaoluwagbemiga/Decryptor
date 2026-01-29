"use client"

import dynamic from 'next/dynamic'

const CreateCampaignClient = dynamic(() => import('./CreateCampaignClient'), { ssr: false })

export default function CreateCampaign() {
  return <CreateCampaignClient />
}
