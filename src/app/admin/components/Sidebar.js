import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, UserCheck, Package, ShoppingCart, BarChart2, DollarSign, Target, Settings, HelpCircle } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, href, active }) => (
  <li className={`flex items-center p-2 rounded-lg cursor-pointer ${
    active ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
  }`}>
    <Link href={href}>
      <div className="flex items-center">
        <Icon size={20} className="mr-3" />
        <span>{label}</span>
      </div>
    </Link>
  </li>
);

const Sidebar = () => {
  const pathname = usePathname();

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', href: '/' },
    { icon: Users, label: 'Retailer Management', href: '/retailer-management' },
    { icon: UserCheck, label: 'Field Agents', href: '/field-agents' },
    { icon: Package, label: 'Inventory', href: '/inventory' },
    { icon: ShoppingCart, label: 'Orders', href: '/orders' },
    { icon: BarChart2, label: 'Analytics', href: '/analytics' },
    { icon: DollarSign, label: 'Finance', href: '/finance' },
    { icon: Target, label: 'Marketing', href: '/marketing' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: HelpCircle, label: 'Help & Support', href: '/help-support' },
  ];

  return (
    <aside className="bg-white w-64 min-h-screen p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-blue-700">UniField Admin</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={pathname === item.href}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;