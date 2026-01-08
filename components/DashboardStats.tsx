import React from 'react';
import { Customer } from '../types.ts';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CheckCircle2, PhoneOff, Clock } from 'lucide-react';

interface DashboardStatsProps {
  customers: Customer[];
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b']; // Green, Red, Amber

export const DashboardStats: React.FC<DashboardStatsProps> = ({ customers }) => {
  const total = customers.length;
  const called = customers.filter(c => c.callStatus === 'Called').length;
  const notCalled = customers.filter(c => c.callStatus === 'Not Called').length;
  const pending = customers.filter(c => c.callStatus === 'Pending Follow-up').length;

  const data = [
    { name: 'Called', value: called },
    { name: 'Not Called', value: notCalled },
    { name: 'Pending', value: pending },
  ];

  // Group by Staff
  const staffDataRaw: Record<string, number> = {};
  customers.forEach(c => {
      if(c.calledBy) {
          staffDataRaw[c.calledBy] = (staffDataRaw[c.calledBy] || 0) + 1;
      } else {
          staffDataRaw['Unassigned'] = (staffDataRaw['Unassigned'] || 0) + 1;
      }
  });
  
  const staffChartData = Object.keys(staffDataRaw).map(key => ({
      name: key,
      calls: staffDataRaw[key]
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Summary Cards */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Called Successfully</p>
            <p className="text-2xl font-bold text-gray-800">{called}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-red-100 rounded-full">
            <PhoneOff className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Not Called</p>
            <p className="text-2xl font-bold text-gray-800">{notCalled}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-100 rounded-full">
            <Clock className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending Follow-up</p>
            <p className="text-2xl font-bold text-gray-800">{pending}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Call Status Overview</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Activity by Staff</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={staffChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip cursor={{fill: 'transparent'}} />
            <Bar dataKey="calls" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};