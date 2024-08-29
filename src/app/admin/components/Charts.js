'use client'
import Link from 'next/link';

const Charts = () => {
  return (
    <>
      <section>
        <h2 className="text-2xl font-bold mb-4 px-4">Overview Dashboard</h2>
        <div className="flex m-4 gap-2">
          <div className="flex-1 px-2 justify-center w-16 bg-gray-700 shadow rounded h-300px">
            <div className="">
              <p className="text-gray-900 font-bold">Total Sales</p>
              <p className="py-4 font-bold">₦15,678,900</p>
              <p className="text-green-300">+12% from last month</p>
            </div>
          </div>
          <div className="flex-1 px-2 justify-center w-16 bg-gray-700 shadow rounded max-h-300px">
            <div className="">
              <p className="text-gray-900 font-bold">Active Retailers</p>
              <p className="py-4 font-bold">1,234</p>
              <p className="text-green-300">+5% from last month</p>
            </div>
          </div>
          <div className="flex-1 px-2 justify-center w-16  bg-gray-700 shadow rounded max-h-300px">
            <div className="">
              <p className="text-gray-900 font-bold">Credit Utilization</p>
              <p className="py-4 font-bold">65%</p>
              <p className="text-green-300">+3% from last month</p>
            </div>
          </div>
          <div className="flex-1 px-2 justify-center w-16  bg-gray-700 shadow rounded h-300px">
            <div className="">
              <p className="text-gray-900 font-bold">Inventory Levels</p>
              <p className="py-4 font-bold">12,345</p>
              <p className="text-green-300">+2% from last week</p>
            </div>
          </div>
        </div>
      </section>

      <section className="flex my-4 px-4 gap-3">
        <div className="w-1/2 h-[300px] bg-gray-700 rounded p-4">
          <h3 className="text-xl font-bold mb-2">Real-time Updates</h3>
          <ul className="list-disc list-inside">
            <li>New retailer signed up: Electronics Plus (2 minutes ago)</li>
            <li>Large order placed: ₦500,000 by Supermart Store (15 minutes ago)</li>
            <li>Low stock alert: Coca-Cola 500ml (1 hour ago)</li>
          </ul>
        </div>

        <div className="w-1/2 h-[300px] bg-gray-700 rounded p-4">
          <h3 className="text-xl font-bold mb-2">Quick Links</h3>
          <div className="flex flex-col space-y-2">
            <Link href="/retailer-management" className="bg-blue-500 text-white px-4 py-2 rounded">
              Add New Retailer
            </Link>
            <Link href="/order-processing" className="bg-green-500 text-white px-4 py-2 rounded">
              Process Order
            </Link>
            <Link href="/inventory-management" className="bg-yellow-500 text-white px-4 py-2 rounded">
              Update Inventory
            </Link>
            <Link href="/credit-management" className="bg-purple-500 text-white px-4 py-2 rounded">
              Manage Credits
            </Link>
          </div>
        </div>
      </section>

      <section className="flex my-4 px-4 gap-2">
        <div className=" w-1/3 h-[250px] bg-gray-700 rounded"></div>
        <div className=" w-1/3 h-[250px] bg-gray-700 rounded"></div>
        <div className=" w-1/3 h-[250px] bg-gray-700 rounded"></div>
      </section>
    </>
  );
};

export default Charts;