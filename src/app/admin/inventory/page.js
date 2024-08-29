import dynamic from 'next/dynamic';

const InventoryManagementPage = dynamic(() => import('@/components/admin/InventoryManagementPage'), { ssr: false });

export default function InventoryPage() {
  return <InventoryManagementPage />;
}