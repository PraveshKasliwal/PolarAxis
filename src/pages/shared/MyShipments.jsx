import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Ship, Truck, Brain as Train, Search, FileDown, ArrowRight, AlertCircle } from 'lucide-react';
import { ComposableMap, Geographies, Geography, Line, Marker, ZoomableGroup } from 'react-simple-maps';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { shipments } from '../../data/shipments';
import { tenants } from '../../data/tenants';
import StatusPill from '../../components/shared/StatusPill';
import TempPill from '../../components/shared/TempPill';
import RiskBadge from '../../components/shared/RiskBadge';
import TenantBadge from '../../components/shared/TenantBadge';
import EmptyState from '../../components/shared/EmptyState';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const countryFlags = {
  'Netherlands': '🇳🇱',
  'India': '🇮🇳',
  'USA': '🇺🇸',
  'Singapore': '🇸🇬',
  'France': '🇫🇷',
  'Malaysia': '🇲🇾',
  'UAE': '🇦🇪',
  'Germany': '🇩🇪',
  'Japan': '🇯🇵',
  'Switzerland': '🇨🇭',
  'Brazil': '🇧🇷',
  'Australia': '🇦🇺',
  'UK': '🇬🇧',
  'Hong Kong': '🇭🇰',
  'China': '🇨🇳',
  'Canada': '🇨🇦',
  'South Korea': '🇰🇷',
  'Denmark': '🇩🇰',
  'Italy': '🇮🇹',
  'Mexico': '🇲🇽',
  'Sweden': '🇸🇪',
  'Thailand': '🇹🇭',
  'Belgium': '🇧🇪',
  'South Africa': '🇿🇦',
  'Austria': '🇦🇹',
  'Turkey': '🇹🇷',
  'Ireland': '🇮🇪',
  'Saudi Arabia': '🇸🇦',
  'Norway': '🇳🇴',
  'Israel': '🇮🇱',
  'Finland': '🇫🇮',
  'Indonesia': '🇮🇩',
};

const modeIcons = {
  air: Plane,
  sea: Ship,
  road: Truck,
  rail: Train,
};

export default function MyShipments() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tempClassFilter, setTempClassFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 });
  const [isDragging, setIsDragging] = useState(false);

  function handleMoveEnd(position) {
    setPosition(position);
    setIsDragging(false);
  }

  const myShipments = useMemo(() =>
    shipments.filter(s => s.tenantId === currentUser?.tenantId),
    [currentUser]
  );

  const filteredShipments = useMemo(() => {
    return myShipments.filter(shipment => {
      const matchesSearch =
        shipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shipment.destination.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
      const matchesTempClass = tempClassFilter === 'all' || shipment.tempClass === tempClassFilter;
      const matchesMode = modeFilter === 'all' || shipment.mode === modeFilter;

      return matchesSearch && matchesStatus && matchesTempClass && matchesMode;
    });
  }, [myShipments, searchQuery, statusFilter, tempClassFilter, modeFilter]);

  const activeShipments = myShipments.filter(s => s.status === 'in_transit');

  const stats = useMemo(() => ({
    inTransit: myShipments.filter(s => s.status === 'in_transit').length,
    pending: myShipments.filter(s => s.status === 'pending').length,
    delivered: myShipments.filter(s => s.status === 'delivered').length,
  }), [myShipments]);

  const calculateProgress = (shipment) => {
    if (shipment.status === 'delivered') return 100;
    if (shipment.status === 'pending') return 0;

    const now = new Date();
    const departure = new Date(shipment.departureDate);
    const eta = new Date(shipment.eta);

    const totalDuration = eta - departure;
    const elapsed = now - departure;

    const progress = (elapsed / totalDuration) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  const handleDownloadDocs = (shipmentId) => {
    toast.success('Documents ready for download');
  };

  const handleTrackShipment = (shipmentId) => {
    navigate(`/shipments/track/${shipmentId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-primary"
          >
            My Shipments
          </motion.h1>
          <TenantBadge tenant={tenants.find(t => t.id === currentUser?.tenantId)} />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4"
      >
        <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <span className="text-sm text-secondary">In Transit: </span>
          <span className="text-lg font-bold text-blue-500">{stats.inTransit}</span>
        </div>
        <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <span className="text-sm text-secondary">Pending: </span>
          <span className="text-lg font-bold text-amber-500">{stats.pending}</span>
        </div>
        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
          <span className="text-sm text-secondary">Delivered: </span>
          <span className="text-lg font-bold text-emerald-500">{stats.delivered}</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-surface border border-border rounded-xl p-4"
      >
        <h2 className="text-lg font-semibold text-primary mb-4">Active Shipments Map</h2>
        <div className="relative h-56 bg-background rounded-lg overflow-hidden" style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
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
              {activeShipments.map((shipment) => (
                <g key={shipment.id}>
                  <Line
                    from={[shipment.origin.lng, shipment.origin.lat]}
                    to={[shipment.destination.lng, shipment.destination.lat]}
                    stroke="rgb(14, 165, 233)"
                    strokeWidth={1}
                    strokeLinecap="round"
                    strokeDasharray="5,5"
                    opacity={0.6}
                  />
                  <Marker coordinates={[shipment.origin.lng, shipment.origin.lat]}>
                    <circle r={3} fill="rgb(16, 185, 129)" />
                  </Marker>
                  <Marker coordinates={[shipment.destination.lng, shipment.destination.lat]}>
                    <circle r={3} fill="rgb(14, 165, 233)" />
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface border border-border rounded-xl p-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search by ID or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Status</option>
            <option value="in_transit">In Transit</option>
            <option value="pending">Pending</option>
            <option value="customs_hold">Customs Hold</option>
            <option value="delivered">Delivered</option>
            <option value="excursion">Excursion</option>
          </select>

          <select
            value={tempClassFilter}
            onChange={(e) => setTempClassFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Temperatures</option>
            <option value="2-8°C">2-8°C</option>
            <option value="-20°C">-20°C</option>
            <option value="-70°C">-70°C</option>
          </select>

          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="all">All Modes</option>
            <option value="air">Air</option>
            <option value="sea">Sea</option>
            <option value="road">Road</option>
            <option value="rail">Rail</option>
          </select>
        </div>
      </motion.div>

      {filteredShipments.length === 0 ? (
        <EmptyState
          title="No shipments match your current filters"
          description="Try adjusting your search criteria or filters to find what you're looking for."
        />
      ) : (
        <div className="space-y-4">
          {filteredShipments.map((shipment, index) => {
            const ModeIcon = modeIcons[shipment.mode];
            const progress = calculateProgress(shipment);

            return (
              <motion.div
                key={shipment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className={`bg-surface border border-border rounded-xl p-6 hover:shadow-md transition-shadow ${
                  shipment.status === 'excursion'
                    ? 'border-l-4 border-l-red-500'
                    : shipment.status === 'customs_hold'
                    ? 'border-l-4 border-l-amber-500'
                    : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold text-primary">{shipment.id}</span>
                    <StatusPill status={shipment.status} />
                  </div>
                  <RiskBadge level={shipment.riskLevel} />
                </div>

                <div className="flex items-center gap-3 mb-4 text-primary">
                  <span className="text-base">
                    {countryFlags[shipment.origin.country]} {shipment.origin.city}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted" />
                  <span className="text-base">
                    {countryFlags[shipment.destination.country]} {shipment.destination.city}
                  </span>
                  <div className="flex items-center gap-2 ml-4">
                    <ModeIcon className="w-4 h-4 text-muted" />
                    <span className="text-sm text-secondary">{shipment.carrier}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <TempPill
                    temp={shipment.currentTemp}
                    tempClass={shipment.tempClass}
                  />
                  <div className="text-sm text-secondary">
                    ETA: <span className="text-primary font-medium">
                      {new Date(shipment.eta).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {shipment.status === 'excursion' && (
                  <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-red-500">Temperature Excursion Active</span>
                  </div>
                )}

                {shipment.status === 'customs_hold' && (
                  <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-medium text-amber-500">Customs Hold</span>
                  </div>
                )}

                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-secondary mb-1">
                    <span>Journey Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, delay: index * 0.06 + 0.2 }}
                      className={`h-full rounded-full ${
                        shipment.status === 'delivered'
                          ? 'bg-emerald-500'
                          : shipment.status === 'excursion'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTrackShipment(shipment.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium"
                  >
                    Track
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDownloadDocs(shipment.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg hover:bg-border/50 transition-colors text-sm font-medium text-primary"
                  >
                    <FileDown className="w-4 h-4" />
                    Download Docs
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
