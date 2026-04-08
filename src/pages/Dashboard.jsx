import React, { useState, useEffect } from 'react';
import { 
  Package, 
  LifeBuoy, 
  MessageSquare, 
  UserPlus, 
  TrendingUp, 
  AlertCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import api from '../api/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    inventoryCount: 0,
    openTickets: 0,
    announcements: 0,
    pendingRegistrations: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [inv, tickets, comm, reg] = await Promise.all([
          api.get('/inventory'),
          api.get('/support?status=Open'),
          api.get('/communication/announcements'),
          api.get('/registration?status=Pending')
        ]);

        setStats({
          inventoryCount: inv.data.length,
          openTickets: tickets.data.length,
          announcements: comm.data.length,
          pendingRegistrations: reg.data.length
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Inventory', value: stats.inventoryCount, icon: Package, color: 'bg-blue-500', trend: '+12%' },
    { title: 'Open Tickets', value: stats.openTickets, icon: LifeBuoy, color: 'bg-amber-500', trend: '-5%' },
    { title: 'Announcements', value: stats.announcements, icon: MessageSquare, color: 'bg-purple-500', trend: 'Global' },
    { title: 'Pending Registrations', value: stats.pendingRegistrations, icon: UserPlus, color: 'bg-emerald-500', trend: '+8%' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Real-time performance and operational metrics for School ERP.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 group hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl text-white ${card.color} shadow-lg shadow-gray-200`}>
                <card.icon size={24} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${card.trend.includes('+') ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'}`}>
                {card.trend}
              </span>
            </div>
            <h3 className="text-gray-500 font-medium text-sm">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="card h-fit">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Clock className="text-indigo-600" size={24} />
              Recent Activities
            </h2>
            <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View all</button>
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-indigo-600 mt-2"></div>
                <div>
                  <p className="text-sm text-gray-900 font-medium leading-relaxed">
                    New student registration form submitted by <span className="text-indigo-600">John Doe</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="text-indigo-600" size={24} />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-6 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 hover:bg-indigo-100 transition-all gap-2">
              <UserPlus size={24} />
              <span className="font-bold whitespace-nowrap">Add Registration</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 hover:bg-amber-100 transition-all gap-2">
              <LifeBuoy size={24} />
              <span className="font-bold whitespace-nowrap">Create Ticket</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 hover:bg-emerald-100 transition-all gap-2">
              <Package size={24} />
              <span className="font-bold whitespace-nowrap">New Inventory</span>
            </button>
            <button className="flex flex-col items-center justify-center p-6 rounded-2xl bg-purple-50 border border-purple-100 text-purple-700 hover:bg-purple-100 transition-all gap-2">
              <MessageSquare size={24} />
              <span className="font-bold whitespace-nowrap">Broadcast Info</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
