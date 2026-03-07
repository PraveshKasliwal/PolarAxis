import { motion } from 'framer-motion';
import { Package, CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';
import KPICard from '../../components/shared/KPICard';
import StatusPill from '../../components/shared/StatusPill';
import TempPill from '../../components/shared/TempPill';
import RiskBadge from '../../components/shared/RiskBadge';
import { shipments } from '../../data/shipments';
import { alerts } from '../../data/alerts';
import { carriers } from '../../data/carriers';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, Line, Marker, ZoomableGroup } from 'react-simple-maps';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function OpsDashboard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 });
  const [isDragging, setIsDragging] = useState(false);

  function handleMoveEnd(position) {
    setPosition(position);
    setIsDragging(false);
  }

  const activeShipments = shipments.filter(s => s.status === 'in_transit' || s.status === 'customs_hold' || s.status === 'excursion');
  const tempCompliant = activeShipments.filter(s => {
    if (!s.currentTemp) return true;
    const range = s.tempRange;
    return s.currentTemp >= range.min && s.currentTemp <= range.max;
  });
  const onTimeShipments = shipments.filter(s => s.status === 'delivered');
  const onTimeRate = shipments.length > 0 ? ((onTimeShipments.length / shipments.length) * 100).toFixed(1) : 0;
  const tempComplianceRate = activeShipments.length > 0 ? ((tempCompliant.length / activeShipments.length) * 100).toFixed(1) : 100;
  const pendingCustoms = shipments.filter(s => s.status === 'customs_hold').length;
  const activeAlerts = alerts.filter(a => !a.acknowledged).length;

  const filteredShipments = filter === 'all'
    ? activeShipments
    : activeShipments.filter(s => s.mode === filter);

  const getModeColor = (mode) => {
    const colors = {
      air: 'rgb(59, 130, 246)',
      sea: 'rgb(245, 158, 11)',
      road: 'rgb(16, 185, 129)',
      rail: 'rgb(168, 85, 247)'
    };
    return colors[mode] || 'rgb(14, 165, 233)';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-primary"
        >
          Control Tower
        </motion.h1>
        <div className="flex items-center gap-4">
          <div className="text-sm font-mono text-secondary">
            {new Date().toUTCString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <KPICard
          icon={Package}
          label="Active Shipments"
          value={activeShipments.length}
          delay={0}
        />
        <KPICard
          icon={CheckCircle}
          label="Temp Compliance (24h)"
          value={`${tempComplianceRate}%`}
          format="string"
          change="-0.8%"
          trend="down"
          delay={1}
        />
        <KPICard
          icon={Clock}
          label="On-Time Rate"
          value={`${onTimeRate}%`}
          format="string"
          change="+1.2%"
          trend="up"
          delay={2}
        />
        <KPICard
          icon={FileText}
          label="Pending Customs"
          value={pendingCustoms}
          delay={3}
        />
        <KPICard
          icon={AlertTriangle}
          label="Active Alerts"
          value={activeAlerts}
          delay={4}
        />
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-semibold text-primary">Global Shipment Map</h2>
          <div className="flex gap-2">
            {['all', 'air', 'sea', 'road', 'rail'].map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-3 py-1.5 text-sm rounded-lg capitalize transition-colors ${
                  filter === mode
                    ? 'bg-accent text-white'
                    : 'bg-border text-secondary hover:bg-border/80'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
        <div className="relative h-[500px] bg-background" style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
          <ComposableMap projection="geoMercator" projectionConfig={{ scale: 140 }}>
            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates}
              onMoveEnd={handleMoveEnd}
              onMoveStart={() => setIsDragging(true)}
              minZoom={1}
              maxZoom={8}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="rgb(var(--border))"
                      stroke="rgb(var(--background))"
                      strokeWidth={0.5}
                    />
                  ))
                }
              </Geographies>
              {filteredShipments.map((shipment) => (
                <g key={shipment.id}>
                  <Line
                    from={[shipment.origin.lng, shipment.origin.lat]}
                    to={[shipment.destination.lng, shipment.destination.lat]}
                    stroke={getModeColor(shipment.mode)}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeDasharray="5,5"
                    opacity={0.8}
                  />
                  <Marker coordinates={[shipment.origin.lng, shipment.origin.lat]}>
                    <circle r={5} fill={getModeColor(shipment.mode)} />
                  </Marker>
                  <Marker coordinates={[shipment.destination.lng, shipment.destination.lat]}>
                    <circle r={5} fill={getModeColor(shipment.mode)} opacity={0.6} />
                  </Marker>
                </g>
              ))}
            </ZoomableGroup>
          </ComposableMap>
          <div className="absolute bottom-3 right-3 flex flex-col gap-1">
            <button
              onClick={() => setPosition(pos => ({ ...pos, zoom: Math.min(pos.zoom * 1.5, 8) }))}
              className="w-8 h-8 bg-surface border border-border rounded-lg text-primary hover:bg-border transition-colors flex items-center justify-center text-lg font-bold shadow-sm"
            >
              +
            </button>
            <button
              onClick={() => setPosition(pos => ({ ...pos, zoom: Math.max(pos.zoom / 1.5, 1) }))}
              className="w-8 h-8 bg-surface border border-border rounded-lg text-primary hover:bg-border transition-colors flex items-center justify-center text-lg font-bold shadow-sm"
            >
              −
            </button>
            <button
              onClick={() => setPosition({ coordinates: [0, 20], zoom: 1 })}
              className="w-8 h-8 bg-surface border border-border rounded-lg text-secondary hover:bg-border transition-colors flex items-center justify-center shadow-sm"
              title="Reset view"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                <path d="M3 3v5h5"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">Active Shipments</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 text-xs font-semibold text-secondary uppercase">ID</th>
                  <th className="pb-3 text-xs font-semibold text-secondary uppercase">Tenant</th>
                  <th className="pb-3 text-xs font-semibold text-secondary uppercase">Route</th>
                  <th className="pb-3 text-xs font-semibold text-secondary uppercase">Mode</th>
                  <th className="pb-3 text-xs font-semibold text-secondary uppercase">Temp</th>
                  <th className="pb-3 text-xs font-semibold text-secondary uppercase">Status</th>
                  <th className="pb-3 text-xs font-semibold text-secondary uppercase">Risk</th>
                </tr>
              </thead>
              <tbody>
                {activeShipments.slice(0, 10).map((shipment, i) => (
                  <motion.tr
                    key={shipment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-border last:border-0 hover:bg-border/50 cursor-pointer"
                    onClick={() => navigate(`/shipments/track/${shipment.id}`)}
                  >
                    <td className="py-3 text-xs font-mono text-primary">{shipment.id}</td>
                    <td className="py-3 text-xs text-secondary">{shipment.tenantName}</td>
                    <td className="py-3 text-xs text-secondary">
                      {shipment.origin.code} → {shipment.destination.code}
                    </td>
                    <td className="py-3 text-xs capitalize text-secondary">{shipment.mode}</td>
                    <td className="py-3">
                      <TempPill temp={shipment.currentTemp} tempClass={shipment.tempClass} showIcon={false} />
                    </td>
                    <td className="py-3">
                      <StatusPill status={shipment.status} />
                    </td>
                    <td className="py-3">
                      <RiskBadge level={shipment.riskLevel} showIcon={false} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-primary mb-4">Alert Feed</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin">
              {alerts.slice(0, 8).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.severity === 'critical'
                      ? 'bg-red-500/5 border-red-500'
                      : alert.severity === 'warning'
                      ? 'bg-amber-500/5 border-amber-500'
                      : 'bg-blue-500/5 border-blue-500'
                  }`}
                >
                  <div className="text-sm font-medium text-primary mb-1">{alert.title}</div>
                  <div className="text-xs text-secondary mb-1">{alert.description}</div>
                  <div className="text-xs text-muted">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold text-primary mb-4">Carrier Capacity</h3>
            <div className="space-y-4">
              {carriers.slice(0, 4).map((carrier) => (
                <div key={carrier.id}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-primary font-medium">{carrier.name}</span>
                    <span className="text-secondary">{carrier.capacity.utilization}%</span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        carrier.capacity.utilization > 85
                          ? 'bg-danger'
                          : carrier.capacity.utilization > 70
                          ? 'bg-warning'
                          : 'bg-success'
                      }`}
                      style={{ width: `${carrier.capacity.utilization}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
