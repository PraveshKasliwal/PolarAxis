import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Truck, Thermometer, Package, Shield, FileText, AlertCircle, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useShipments } from '../../hooks/useShipments';
import { temperatureLogs } from '../../data/temperatureLogs';
import StatusPill from '../../components/shared/StatusPill';
import TempPill from '../../components/shared/TempPill';
import RiskBadge from '../../components/shared/RiskBadge';
import ColdHealthScore from '../../components/charts/ColdHealthScore';
import TempChart from '../../components/charts/TempChart';
import LoadingSkeleton from '../../components/shared/LoadingSkeleton';
import { ComposableMap, Geographies, Geography, Line, Marker, ZoomableGroup } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function ShipmentTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allShipments, canViewCompliance, isReadOnly } = useShipments();
  const [loading, setLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  setTimeout(() => setLoading(false), 400);

  const shipment = allShipments.find(s => s.id === id);
  const tempData = temperatureLogs[id] || [];

  const [position, setPosition] = useState({
    coordinates: shipment ? [
      (shipment.origin.lng + shipment.destination.lng) / 2,
      (shipment.origin.lat + shipment.destination.lat) / 2
    ] : [0, 20],
    zoom: 2
  });

  useEffect(() => {
    if (shipment) {
      setPosition({
        coordinates: [
          (shipment.origin.lng + shipment.destination.lng) / 2,
          (shipment.origin.lat + shipment.destination.lat) / 2
        ],
        zoom: 2
      });
    }
  }, [shipment]);

  function handleMoveEnd(position) {
    setPosition(position);
    setIsDragging(false);
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!shipment) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Package className="w-16 h-16 text-muted mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-2">Shipment not found</h2>
          <p className="text-secondary mb-4">Shipment ID: {id}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={() => navigate('/replay/' + shipment.id)}
          className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 text-accent rounded-lg hover:bg-accent/20 transition-colors text-sm font-medium"
        >
          <Play className="w-4 h-4" />
          Replay Journey
        </button>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">{shipment.id}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-lg text-secondary">
                {shipment.origin.city} → {shipment.destination.city}
              </span>
              <StatusPill status={shipment.status} />
              <RiskBadge level={shipment.riskLevel} />
            </div>
          </div>
          <ColdHealthScore score={shipment.routeScore} size="md" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-background rounded-lg border border-border">
            <div className="text-sm text-secondary mb-1">Carrier</div>
            <div className="font-semibold text-primary">{shipment.carrier}</div>
          </div>
          <div className="p-4 bg-background rounded-lg border border-border">
            <div className="text-sm text-secondary mb-1">Mode</div>
            <div className="font-semibold text-primary capitalize">{shipment.mode}</div>
          </div>
          <div className="p-4 bg-background rounded-lg border border-border">
            <div className="text-sm text-secondary mb-1">Temperature Class</div>
            <div className="font-semibold text-primary">{shipment.tempClass}</div>
          </div>
          <div className="p-4 bg-background rounded-lg border border-border">
            <div className="text-sm text-secondary mb-1">Current Temp</div>
            <TempPill temp={shipment.currentTemp} tempClass={shipment.tempClass} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Journey Timeline
          </h2>
          <div className="space-y-4">
            {shipment.timeline.map((event, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      event.status === 'completed'
                        ? 'bg-success'
                        : event.status === 'current'
                        ? 'bg-accent'
                        : 'bg-border'
                    }`}
                  />
                  {i < shipment.timeline.length - 1 && (
                    <div className="w-px h-16 bg-border" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-primary">{event.event}</div>
                  <div className="text-sm text-secondary">{event.location}</div>
                  <div className="text-xs text-muted mt-1">
                    {new Date(event.timestamp).toLocaleString()}
                  </div>
                  {event.temp && (
                    <div className="mt-2">
                      <TempPill temp={event.temp} tempClass={shipment.tempClass} showIcon={false} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-primary mb-4">Route Map</h2>
            <div className="relative h-64 bg-background rounded-lg overflow-hidden" style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  center: [
                    (shipment.origin.lng + shipment.destination.lng) / 2,
                    (shipment.origin.lat + shipment.destination.lat) / 2
                  ],
                  scale: 300
                }}
              >
                <ZoomableGroup
                  zoom={position.zoom}
                  center={position.coordinates}
                  onMoveEnd={handleMoveEnd}
                  onMoveStart={() => setIsDragging(true)}
                  minZoom={1}
                  maxZoom={6}
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
                  <Line
                    from={[shipment.origin.lng, shipment.origin.lat]}
                    to={[shipment.destination.lng, shipment.destination.lat]}
                    stroke="rgb(14, 165, 233)"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeDasharray="5,5"
                  />
                  <Marker coordinates={[shipment.origin.lng, shipment.origin.lat]}>
                    <circle r={6} fill="rgb(16, 185, 129)" />
                  </Marker>
                  <Marker coordinates={[shipment.destination.lng, shipment.destination.lat]}>
                    <circle r={6} fill="rgb(14, 165, 233)" />
                  </Marker>
                </ZoomableGroup>
              </ComposableMap>
              <div className="absolute bottom-3 right-3 flex flex-col gap-1">
                <button
                  onClick={() => setPosition(pos => ({ ...pos, zoom: Math.min(pos.zoom * 1.5, 6) }))}
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
                  onClick={() => setPosition({
                    coordinates: [
                      (shipment.origin.lng + shipment.destination.lng) / 2,
                      (shipment.origin.lat + shipment.destination.lat) / 2
                    ],
                    zoom: 2
                  })}
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

          {tempData.length > 0 && (
            <div className="bg-surface border border-border rounded-xl p-6">
              <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                <Thermometer className="w-5 h-5" />
                Temperature Log (48h)
              </h2>
              <div className="h-64">
                <TempChart data={tempData} tempClass={shipment.tempClass} />
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Shipment Details
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-secondary mb-1">Material</div>
                  <div className="font-medium text-primary">{shipment.material}</div>
                </div>
                <div>
                  <div className="text-sm text-secondary mb-1">Value</div>
                  <div className="font-medium text-primary">${shipment.value.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-secondary mb-1">Departure Date</div>
                  <div className="font-medium text-primary">
                    {new Date(shipment.departureDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-secondary mb-1">Expected Arrival</div>
                  <div className="font-medium text-primary">
                    {new Date(shipment.eta).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-xl p-6">
              <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Risk & Sustainability
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-secondary mb-1">Risk Score</div>
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-primary">{shipment.riskScore}/100</div>
                    <RiskBadge level={shipment.riskLevel} showIcon={false} />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-secondary mb-1">Carbon Footprint</div>
                  <div className="font-medium text-primary">{shipment.carbonKg} kg CO₂</div>
                </div>
                <div>
                  <div className="text-sm text-secondary mb-1">Cold Chain Integrity</div>
                  <div className="font-semibold text-primary">{shipment.routeScore}%</div>
                </div>
              </div>
            </div>
          </div>

          {canViewCompliance && (
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Compliance Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-black/30 border border-blue-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="text-xs text-secondary">Temperature Logs</div>
                    <div className="text-sm font-semibold text-primary">Available</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-black/30 border border-blue-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="text-xs text-secondary">Compliance Docs</div>
                    <div className="text-sm font-semibold text-primary">3 Documents</div>
                  </div>
                </div>
              </div>
              {!isReadOnly && (
                <button className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                  Export Audit Report
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
