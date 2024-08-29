import dynamic from 'next/dynamic';

const RetailerManagementPage = dynamic(() => import('@/components/admin/RetailerManagementPage'), { ssr: false });

export default function RetailerManagementPageWrapper() {
  return <RetailerManagementPage />;
}