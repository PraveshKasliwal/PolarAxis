import { motion } from 'framer-motion';
import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, AreaChart, Area } from 'recharts';
import { shipments } from '../../data/shipments';
import { Leaf, TrendingDown, Award, Zap, AlertCircle, CheckCircle, ArrowRight, Plane, Ship, Truck, Train } from 'lucide-react';
import KPICard from '../../components/shared/KPICard';
import { useToast } from '../../context/ToastContext';

const modeIcons = {
  air: Plane,
  sea: Ship,
  road: Truck,
  rail: Train,
};

export default function SustainabilityDashboard() {
  const toast = useToast();
  const [appliedRecs, setAppliedRecs] = useState([]);

  const monthlyData = [
    { month: 'Oct', air: 18200, sea: 3100, road: 3800, rail: 1600 },
    { month: 'Nov', air: 19100, sea: 3400, road: 4100, rail: 1700 },
    { month: 'Dec', air: 21000, sea: 2900, road: 3600, rail: 1500 },
    { month: 'Jan', air: 17800, sea: 3200, road: 3900, rail: 1800 },
    { month: 'Feb', air: 16900, sea: 3000, road: 3500, rail: 1600 },
    { month: 'Mar', air: 19200, sea: 3400, road: 3920, rail: 1680 }
  ];

  const co2Data = [
    { name: 'Air', value: 19200, color: 'rgb(14,165,233)' },
    { name: 'Sea', value: 3400, color: 'rgb(20,184,166)' },
    { name: 'Road', value: 3920, color: 'rgb(16,185,129)' },
    { name: 'Rail', value: 1680, color: 'rgb(168,85,247)' }
  ];

  const trendData = [
    { week: 'W1', actual: 138 },
    { week: 'W2', actual: 132 },
    { week: 'W3', actual: 129 },
    { week: 'W4', actual: 125 },
    { week: 'W5', actual: 123 },
    { week: 'W6', actual: 119 },
    { week: 'W7', actual: 118 },
    { week: 'W8', actual: 115 },
    { week: 'W9', actual: 113 },
    { week: 'W10', actual: 111 },
    { week: 'W11', actual: 110 },
    { week: 'W12', actual: 108 }
  ];

  const totalCO2 = co2Data.reduce((sum, item) => sum + item.value, 0);

  const sortedShipments = [...shipments]
    .sort((a, b) => (b.carbonKg || 0) - (a.carbonKg || 0))
    .slice(0, 10);

  const recommendations = [
    {
      id: 1,
      icon: Zap,
      title: 'Consolidate Amsterdam Hub Departures',
      description: 'Shifting 3 non-urgent sea shipments to depart on Tuesdays reduces cold-storage dwell time and hub emissions.',
      saving: '↓ 95 kg CO₂/week'
    },
    {
      id: 2,
      icon: ArrowRight,
      title: 'Switch 3 Road Shipments to Rail',
      description: 'Vienna → Istanbul and 2 similar routes qualify for rail substitution with comparable transit times.',
      saving: '↓ 180 kg CO₂'
    },
    {
      id: 3,
      icon: Leaf,
      title: 'Optimize PX-2024-0887 Backup Route',
      description: 'Replace air contingency with sea backup for this JFK → SIN shipment. Backup rarely activates but reservation causes emissions.',
      saving: '↓ 214 kg CO₂'
    }
  ];

  const handleApplyRec = (recId) => {
    if (!appliedRecs.includes(recId)) {
      setAppliedRecs([...appliedRecs, recId]);
      toast.success('Recommendation applied to route queue');
    }
  };

  const handleOptimize = (shipmentId) => {
    toast.success(`Route optimization queued for ${shipmentId}`);
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}
      >
        <h1 className="text-3xl font-bold text-primary mb-2">Carbon & Sustainability</h1>
        <p className="text-secondary">Tracking environmental impact across all cold-chain operations</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        <KPICard icon={Leaf} label="Total CO₂ This Month" value="28,400 kg" format="string" change="-8.2%" trend="up" delay={0} />
        <KPICard icon={TrendingDown} label="Avg CO₂ per Shipment" value="115 kg" format="string" change="-12%" trend="up" delay={1} />
        <KPICard icon={Zap} label="Green Route Rate" value="34%" format="string" change="+5%" trend="up" delay={2} />
        <KPICard icon={Award} label="Carbon Offset Credits" value="12.4 t" format="string" change="+2.1 t" trend="up" delay={3} />
        <KPICard icon={AlertCircle} label="Projected Year-End" value="342k kg" format="string" change="+3%" trend="down" delay={4} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface border border-border rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-primary mb-1">Monthly CO₂ by Transport Mode</h2>
        <p className="text-sm text-secondary mb-6">Stacked emissions across air, sea, road, and rail (Last 6 Months)</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
              <XAxis dataKey="month" stroke="rgb(var(--text-secondary))" fontSize={12} />
              <YAxis stroke="rgb(var(--text-secondary))" fontSize={12} tickFormatter={(v) => (v / 1000).toFixed(0) + 'k'} />
              <Tooltip formatter={(value, name) => [value.toLocaleString() + ' kg', name]} />
              <Legend />
              <Bar dataKey="air" name="Air" stackId="a" fill="rgb(14,165,233)" />
              <Bar dataKey="sea" name="Sea" stackId="a" fill="rgb(20,184,166)" />
              <Bar dataKey="road" name="Road" stackId="a" fill="rgb(16,185,129)" />
              <Bar dataKey="rail" name="Rail" stackId="a" fill="rgb(168,85,247)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold text-primary mb-6">CO₂ by Mode — March</h2>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={co2Data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {co2Data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="text-2xl font-bold text-primary">{(totalCO2 / 1000).toFixed(1)}k</div>
              <div className="text-sm text-secondary">kg CO₂</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            {co2Data.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-secondary">
                  {item.name} <span className="font-semibold text-primary">{((item.value / totalCO2) * 100).toFixed(0)}%</span>
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold text-primary mb-1">CO₂ per Shipment — 12 Week Trend</h2>
          <p className="text-sm text-secondary mb-6">Target: 100 kg per shipment</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                <XAxis dataKey="week" stroke="rgb(var(--text-secondary))" fontSize={12} />
                <YAxis stroke="rgb(var(--text-secondary))" fontSize={12} domain={[80, 150]} />
                <Tooltip />
                <ReferenceLine
                  y={100}
                  stroke="rgb(16,185,129)"
                  strokeDasharray="4 4"
                  label={{ value: 'Target 100kg', position: 'insideTopRight', fontSize: 11, fill: 'rgb(16,185,129)' }}
                />
                <Area type="monotone" dataKey="actual" fill="rgb(14,165,233)" fillOpacity={0.1} stroke="rgb(14,165,233)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-surface border border-border rounded-xl overflow-hidden"
      >
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-primary mb-1">Shipment Carbon Impact</h2>
          <p className="text-sm text-secondary">Sorted by CO₂ footprint — highest first</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase">Shipment ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase">Route</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase">Mode</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase">CO₂ ↓</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase">Alt. Air Est.</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase">Savings</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-secondary uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedShipments.map((shipment, index) => {
                const ModeIcon = modeIcons[shipment.mode];
                const carbonKg = shipment.carbonKg || 0;
                const altAir = shipment.mode === 'air' ? null : Math.round(carbonKg * 4.2);
                const savings = shipment.mode === 'air' ? null : Math.round(carbonKg * 3.2);

                return (
                  <tr key={index} className="border-b border-border hover:bg-border/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-primary">{shipment.id}</td>
                    <td className="px-6 py-4 text-sm text-secondary">
                      {shipment.origin.code} → {shipment.destination.code}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 capitalize">
                        <ModeIcon className="w-4 h-4 text-muted" />
                        <span className="text-sm text-secondary">{shipment.mode}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-primary">{carbonKg} kg</td>
                    <td className="px-6 py-4 text-sm text-secondary">
                      {altAir ? `${altAir} kg` : <span className="text-muted">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      {savings ? (
                        <span className="text-sm font-semibold text-success">↓ {savings} kg saved</span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {shipment.mode === 'air' ? (
                        <button disabled className="px-3 py-1.5 bg-border text-muted rounded-lg text-xs font-medium cursor-not-allowed">
                          Optimal
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOptimize(shipment.id)}
                          className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-medium hover:bg-emerald-500/20 transition-colors"
                        >
                          Optimize
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Leaf className="w-6 h-6 text-emerald-500" />
            <h2 className="text-xl font-semibold text-primary">Sustainability Recommendations</h2>
            <span className="ml-auto bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-full px-2 py-0.5">
              AI-powered
            </span>
          </div>
          <div className="space-y-4">
            {recommendations.map((rec) => {
              const RecIcon = rec.icon;
              const isApplied = appliedRecs.includes(rec.id);

              return (
                <div
                  key={rec.id}
                  className={`bg-white/50 dark:bg-black/20 border border-emerald-500/15 rounded-xl p-4 transition-opacity ${
                    isApplied ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <RecIcon className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary mb-1">{rec.title}</h3>
                      <p className="text-sm text-secondary mb-3">{rec.description}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap">
                        {rec.saving}
                      </div>
                      {isApplied ? (
                        <div className="bg-emerald-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                          Applied ✓
                        </div>
                      ) : (
                        <button
                          onClick={() => handleApplyRec(rec.id)}
                          className="px-3 py-1.5 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-medium hover:bg-emerald-500/10 transition-colors"
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-surface border border-border rounded-xl p-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-semibold text-primary">Carbon Offset Progress</h2>
          </div>
          <p className="text-sm text-secondary mb-6">Monthly target: 20 tonnes</p>

          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-primary">12.4 / 20.0 tonnes</div>
            <div className="text-sm text-secondary mt-1">62% of monthly target</div>
          </div>

          <div className="w-full h-4 bg-border rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000"
              style={{ width: '62%' }}
            />
          </div>

          <div className="space-y-2 mb-6 text-sm">
            <div className="flex justify-between">
              <span className="text-secondary">Direct offsets purchased:</span>
              <span className="font-semibold text-primary">8.2 t</span>
            </div>
            <div className="flex justify-between">
              <span className="text-secondary">Route optimization savings:</span>
              <span className="font-semibold text-primary">4.2 t</span>
            </div>
          </div>

          <button
            onClick={() => toast.info('Redirecting to carbon offset marketplace...')}
            className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium text-sm"
          >
            Purchase Additional Offsets
          </button>

          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
            <div>
              <div className="text-xs text-secondary mb-1">Last Month Offset</div>
              <div className="text-lg font-bold text-primary">10.8 t</div>
            </div>
            <div>
              <div className="text-xs text-secondary mb-1">YTD Total</div>
              <div className="text-lg font-bold text-primary">28.4 t</div>
            </div>
            <div>
              <div className="text-xs text-secondary mb-1">Cost per Tonne</div>
              <div className="text-lg font-bold text-primary">$18.50</div>
            </div>
            <div>
              <div className="text-xs text-secondary mb-1">Total Spent</div>
              <div className="text-lg font-bold text-primary">$525</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
