"use client"

import dynamic from 'next/dynamic'

const CampaignDetailsClient = dynamic(() => import('./CampaignDetailsClient'), { ssr: false })

export default function CampaignDetails() {
    return <CampaignDetailsClient />
}
