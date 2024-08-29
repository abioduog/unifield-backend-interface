import dynamic from 'next/dynamic'

const FieldAgentManagementPage = dynamic(() => import('@/components/admin/FieldAgentManagementPage'), { ssr: false })

export default function FieldAgentsPage() {
  return <FieldAgentManagementPage />
}