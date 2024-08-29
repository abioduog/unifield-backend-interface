import React, { useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import ProductCatalog from '../admin-app/components/ProductCatalog';
import OrderManagement from '../admin-app/components/OrderManagement';
import InventoryManagement from '../admin-app/components/InventoryManagement';
import CreditManagement from '../admin-app/components/CreditManagement';
import NotificationSystem from '../admin-app/components/NotificationSystem';

const RetailerInterface = () => {
  const [retailer, setRetailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('catalog');

  useEffect(() => {
    fetchRetailerData();
  }, []);

  const fetchRetailerData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('retailers')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setRetailer(data);
      }
    } catch (error) {
      console.error('Error fetching retailer data:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!retailer) return <div>Please log in or register as a retailer.</div>;

  return (
    <div className="retailer-interface">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Welcome, {retailer.name}</h1>
        <NotificationSystem retailerId={retailer.id} />
      </div>
      <div className="mb-4">
        <button
          className={`mr-2 ${activeTab === 'catalog' ? 'bg-blue-500 text-white' : 'bg-gray-200'} px-4 py-2 rounded`}
          onClick={() => setActiveTab('catalog')}
        >
          Product Catalog
        </button>
        <button
          className={`mr-2 ${activeTab === 'orders' ? 'bg-blue-500 text-white' : 'bg-gray-200'} px-4 py-2 rounded`}
          onClick={() => setActiveTab('orders')}
        >
          Order Management
        </button>
        <button
          className={`mr-2 ${activeTab === 'inventory' ? 'bg-blue-500 text-white' : 'bg-gray-200'} px-4 py-2 rounded`}
          onClick={() => setActiveTab('inventory')}
        >
          Inventory Management
        </button>
        <button
          className={`mr-2 ${activeTab === 'credit' ? 'bg-blue-500 text-white' : 'bg-gray-200'} px-4 py-2 rounded`}
          onClick={() => setActiveTab('credit')}
        >
          Credit Management
        </button>
      </div>
      {activeTab === 'catalog' && <ProductCatalog />}
      {activeTab === 'orders' && <OrderManagement retailerId={retailer.id} />}
      {activeTab === 'inventory' && <InventoryManagement retailerId={retailer.id} />}
      {activeTab === 'credit' && <CreditManagement retailerId={retailer.id} />}
    </div>
  );
};

export default RetailerInterface;