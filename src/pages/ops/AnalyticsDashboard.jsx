import { motion } from 'framer-motion';
import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { shipments } from '../../data/shipments';
import { carriers } from '../../data/carriers';
import { TrendingUp, Package, AlertTriangle, CheckCircle, DollarSign, Download, Calendar, Plane, Ship, Truck, Train } from 'lucide-react';
import KPICard from '../../components/shared/KPICard';
import { useToast } from '../../context/ToastContext';

const modeIcons = {
  Air: Plane,
  Sea: Ship,
  Road: Truck,
  Rail: Train,
};

export default function AnalyticsDashboard() {
  const [selectedRange, setSelectedRange] = useState('30d');
  const toast = useToast();

  const dailyData = [
    { date: 'Mar 1', shipments: 15, excursions: 0 },
    { date: 'Mar 2', shipments: 12, excursions: 0 },
    { date: 'Mar 3', shipments: 18, excursions: 0 },
    { date: 'Mar 4', shipments: 14, excursions: 0 },
    { date: 'Mar 5', shipments: 16, excursions: 1 },
    { date: 'Mar 6', shipments: 13, excursions: 0 },
    { date: 'Mar 7', shipments: 17, excursions: 0 },
    { date: 'Mar 8', shipments: 15, excursions: 0 },
    { date: 'Mar 9', shipments: 14, excursions: 2 },
    { date: 'Mar 10', shipments: 16, excursions: 0 },
    { date: 'Mar 11', shipments: 18, excursions: 0 },
    { date: 'Mar 12', shipments: 15, excursions: 1 },
    { date: 'Mar 13', shipments: 13, excursions: 0 },
    { date: 'Mar 14', shipments: 17, excursions: 0 }
  ];

  const modeData = [
    { name: 'Air', value: 68, color: 'rgb(14,165,233)' },
    { name: 'Sea', value: 18, color: 'rgb(245,158,11)' },
    { name: 'Road', value: 9, color: 'rgb(16,185,129)' },
    { name: 'Rail', value: 5, color: 'rgb(168,85,247)' }
  ];

  const tenantData = [
    { name: 'PharmaCold', value: 8, fill: 'rgb(16,185,129)' },
    { name: 'NovaBio', value: 7, fill: 'rgb(245,158,11)' },
    { name: 'CryoMed', value: 5, fill: 'rgb(14,165,233)' }
  ];

  const carrierData = carriers.map(carrier => ({
    name: carrier.name,
    rate: carrier.onTimeRate,
    fill: carrier.onTimeRate >= 95 ? 'rgb(16,185,129)' : carrier.onTimeRate >= 90 ? 'rgb(245,158,11)' : 'rgb(239,68,68)'
  }));

  const complianceData = [
    { week: 'W1', compliance: 98.5 },
    { week: 'W2', compliance: 97.8 },
    { week: 'W3', compliance: 98.2 },
    { week: 'W4', compliance: 99.1 },
    { week: 'W5', compliance: 98.9 },
    { week: 'W6', compliance: 97.2 },
    { week: 'W7', compliance: 98.6 },
    { week: 'W8', compliance: 99.4 },
    { week: 'W9', compliance: 99.8 },
    { week: 'W10', compliance: 99.2 },
    { week: 'W11', compliance: 98.7 },
    { week: 'W12', compliance: 99.5 }
  ];

  const costData = [
    { mode: 'Air', cost: 5200, fill: 'rgb(14,165,233)' },
    { mode: 'Sea', cost: 920, fill: 'rgb(245,158,11)' },
    { mode: 'Road', cost: 2100, fill: 'rgb(16,185,129)' },
    { mode: 'Rail', cost: 1450, fill: 'rgb(168,85,247)' }
  ];

  const routeData = [
    { route: 'AMS → BOM', mode: 'Air', count: 12, avgCost: '$4,850', avgTransit: '2.1 days', excursionRate: '0%', onTime: '100%' },
    { route: 'JFK → SIN', mode: 'Air', count: 8, avgCost: '$6,200', avgTransit: '1.5 days', excursionRate: '0%', onTime: '100%' },
    { route: 'CDG → KUL', mode: 'Sea', count: 5, avgCost: '$890', avgTransit: '20 days', excursionRate: '4%', onTime: '80%' },
    { route: 'FRA → NRT', mode: 'Air', count: 9, avgCost: '$5,100', avgTransit: '1.8 days', excursionRate: '0%', onTime: '100%' },
    { route: 'MUM → DXB', mode: 'Road', count: 6, avgCost: '$2,100', avgTransit: '6 days', excursionRate: '2%', onTime: '83%' },
    { route: 'SYD → LAX', mode: 'Air', count: 7, avgCost: '$5,800', avgTransit: '2.0 days', excursionRate: '0%', onTime: '100%' }
  ];

  const totalValue = modeData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Analytics & Reporting</h1>
          <p className="text-secondary">Operational insights across all tenants and transport modes</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-surface border border-border rounded-lg p-1">
            {[
              { label: 'Last 7 Days', value: '7d' },
              { label: 'Last 30 Days', value: '30d' },
              { label: 'Last 90 Days', value: '90d' }
            ].map(range => (
              <button
                key={range.value}
                onClick={() => setSelectedRange(range.value)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedRange === range.value
                    ? 'bg-accent text-white'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => toast.success('Report queued. You will receive an email when ready.')}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        <KPICard icon={Package} label="Total Shipments" value={247} change="+12%" trend="up" delay={0} />
        <KPICard icon={CheckCircle} label="On-Time Rate" value="94.2%" format="string" change="+1.2%" trend="up" delay={1} />
        <KPICard icon={TrendingUp} label="Temp Compliance" value="98.7%" format="string" change="+0.3%" trend="up" delay={2} />
        <KPICard icon={DollarSign} label="Value Shipped" value="$8.4M" format="string" change="+18%" trend="up" delay={3} />
        <KPICard icon={AlertTriangle} label="Active Alerts" value={14} change="+4" trend="down" delay={4} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="bg-surface border border-border rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-primary mb-1">Shipment Volume & Excursions</h2>
        <p className="text-sm text-secondary mb-6">Daily tracking over the last 14 days</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
              <XAxis dataKey="date" stroke="rgb(var(--text-secondary))" fontSize={12} />
              <YAxis yAxisId="left" stroke="rgb(var(--text-secondary))" fontSize={12} domain={[0, 25]} />
              <YAxis yAxisId="right" orientation="right" stroke="rgb(var(--text-secondary))" fontSize={12} domain={[0, 5]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(var(--surface))',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '13px'
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="shipments" fill="rgb(14,165,233)" opacity={0.8} name="Shipments" />
              <Line yAxisId="right" type="monotone" dataKey="excursions" stroke="rgb(239,68,68)" strokeWidth={2} dot={{ r: 4 }} name="Excursions" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold text-primary mb-6">Transport Mode Mix</h2>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {modeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="text-3xl font-bold text-primary">{totalValue}</div>
              <div className="text-sm text-secondary">Total</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {modeData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-secondary">
                  {item.name} <span className="font-semibold text-primary">{((item.value / totalValue) * 100).toFixed(0)}%</span>
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold text-primary mb-6">Shipments by Tenant</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tenantData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                <XAxis type="number" stroke="rgb(var(--text-secondary))" fontSize={12} domain={[0, 12]} />
                <YAxis dataKey="name" type="category" width={90} stroke="rgb(var(--text-secondary))" fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {tenantData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold text-primary mb-6">Carrier On-Time Rate %</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={carrierData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                <XAxis dataKey="name" stroke="rgb(var(--text-secondary))" fontSize={12} />
                <YAxis stroke="rgb(var(--text-secondary))" fontSize={12} domain={[80, 100]} />
                <Tooltip />
                <ReferenceLine
                  y={95}
                  stroke="rgb(239,68,68)"
                  strokeDasharray="4 4"
                  label={{ value: 'Target 95%', position: 'insideTopRight', fontSize: 11, fill: 'rgb(239,68,68)' }}
                />
                <Bar dataKey="rate">
                  {carrierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.48 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold text-primary mb-1">Weekly Temp Compliance Trend</h2>
          <p className="text-sm text-secondary mb-6">12 week performance tracking</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                <XAxis dataKey="week" stroke="rgb(var(--text-secondary))" fontSize={12} />
                <YAxis stroke="rgb(var(--text-secondary))" fontSize={12} domain={[96, 100.5]} />
                <Tooltip />
                <ReferenceLine
                  y={99}
                  stroke="rgb(245,158,11)"
                  strokeDasharray="4 4"
                  label={{ value: 'Target 99%', position: 'insideTopRight', fontSize: 11, fill: 'rgb(245,158,11)' }}
                />
                <Area type="monotone" dataKey="compliance" fill="rgb(16,185,129)" fillOpacity={0.15} stroke="rgb(16,185,129)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.56 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold text-primary mb-6">Avg Cost per Shipment by Mode</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                <XAxis dataKey="mode" stroke="rgb(var(--text-secondary))" fontSize={12} />
                <YAxis stroke="rgb(var(--text-secondary))" fontSize={12} tickFormatter={(v) => '$' + v.toLocaleString()} />
                <Tooltip formatter={(value) => ['$' + value.toLocaleString(), 'Avg Cost']} />
                <Bar dataKey="cost">
                  {costData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.64 }}
        className="bg-surface border border-border rounded-xl overflow-hidden"
      >
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-primary mb-1">Top Routes by Volume</h2>
          <p className="text-sm text-secondary">Based on shipment history across all tenants</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase">Route</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase">Mode</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase">Shipments</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase">Avg Cost</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase">Avg Transit</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase">Excursion Rate</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase">On-Time Rate</th>
              </tr>
            </thead>
            <tbody>
              {routeData.map((route, index) => {
                const ModeIcon = modeIcons[route.mode];
                return (
                  <tr key={index} className="border-b border-border hover:bg-border/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono font-semibold text-primary">{route.route}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ModeIcon className="w-4 h-4 text-muted" />
                        <span className="text-sm text-secondary">{route.mode}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-primary font-semibold">{route.count}</td>
                    <td className="px-6 py-4 text-sm text-secondary">{route.avgCost}</td>
                    <td className="px-6 py-4 text-sm text-secondary">{route.avgTransit}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${route.excursionRate === '0%' ? 'text-success' : 'text-danger'}`}>
                        {route.excursionRate}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${route.onTime === '100%' ? 'text-success' : parseFloat(route.onTime) < 90 ? 'text-warning' : 'text-primary'}`}>
                        {route.onTime}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
