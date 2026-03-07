import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Line, Marker, ZoomableGroup } from 'react-simple-maps';
import { LineChart, Line as RechartsLine, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
import { Play, Pause, RotateCcw, ArrowLeft, MapPin, Clock, AlertTriangle, CheckCircle, Activity, Plus, Minus } from 'lucide-react';
import { shipments } from '../../data/shipments';
import { temperatureLogs } from '../../data/temperatureLogs';
import TempPill from '../../components/shared/TempPill';
import StatusPill from '../../components/shared/StatusPill';
import RiskBadge from '../../components/shared/RiskBadge';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function ShipmentReplay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const shipment = shipments.find(s => s.id === id);
  const rawTempData = temperatureLogs[id] || [];

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1.5 });
  const animFrameRef = useRef(null);
  const lastTimeRef = useRef(null);

  const replayData = useMemo(() => {
    if (!shipment) return [];

    if (rawTempData.length > 0) {
      return rawTempData;
    }

    return Array.from({ length: 48 }, (_, i) => {
      const base = (shipment.tempRange.min + shipment.tempRange.max) / 2;
      const amplitude = (shipment.tempRange.max - shipment.tempRange.min) * 0.15;
      const noise = (Math.random() - 0.5) * 0.4;
      const spike = (i === 18 || i === 19) && shipment.status === 'excursion' ? 3.5 : 0;
      return {
        time: i,
        label: i + 'h',
        actual: parseFloat((base + Math.sin(i * 0.3) * amplitude + noise + spike).toFixed(1)),
        predicted: parseFloat((base + Math.sin(i * 0.3) * amplitude).toFixed(1))
      };
    });
  }, [shipment, rawTempData]);

  const totalFrames = replayData.length;

  const currentTempReading = replayData[currentFrame]?.actual || 0;
  const isExcursion = shipment ? (
    currentTempReading > shipment.tempRange.max || currentTempReading < shipment.tempRange.min
  ) : false;

  const progress = totalFrames > 1 ? currentFrame / (totalFrames - 1) : 0;
  const currentLat = shipment ? shipment.origin.lat + (shipment.destination.lat - shipment.origin.lat) * progress : 0;
  const currentLng = shipment ? shipment.origin.lng + (shipment.destination.lng - shipment.origin.lng) * progress : 0;

  const currentEventIndex = shipment ? Math.min(
    Math.floor(progress * shipment.timeline.length),
    shipment.timeline.length - 1
  ) : 0;

  const tempDelta = currentFrame > 0 && replayData[currentFrame - 1]
    ? currentTempReading - replayData[currentFrame - 1].actual
    : 0;

  const tempStatus = shipment && (
    isExcursion ? 'excursion' :
    Math.abs(currentTempReading - (shipment.tempRange.max + shipment.tempRange.min) / 2) >
    (shipment.tempRange.max - shipment.tempRange.min) * 0.4 ? 'warning' : 'ok'
  );

  const integrityPercentage = useMemo(() => {
    if (!shipment) return 100;
    const inRange = replayData.filter(d =>
      d.actual >= shipment.tempRange.min && d.actual <= shipment.tempRange.max
    ).length;
    return ((inRange / totalFrames) * 100).toFixed(1);
  }, [replayData, shipment, totalFrames]);

  const excursionCount = useMemo(() => {
    if (!shipment) return 0;
    return replayData.filter(d =>
      d.actual > shipment.tempRange.max || d.actual < shipment.tempRange.min
    ).length;
  }, [replayData, shipment]);

  const maxDeviation = useMemo(() => {
    if (!shipment) return 0;
    const center = (shipment.tempRange.max + shipment.tempRange.min) / 2;
    return Math.max(...replayData.map(d => Math.abs(d.actual - center)));
  }, [replayData, shipment]);

  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      lastTimeRef.current = null;
      return;
    }

    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const elapsed = timestamp - lastTimeRef.current;
      const msPerFrame = 1000 / (speed * 4);

      if (elapsed >= msPerFrame) {
        lastTimeRef.current = timestamp;
        setCurrentFrame(prev => {
          if (prev >= totalFrames - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, speed, totalFrames]);

  if (!shipment) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-border flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-muted" />
          </div>
          <h2 className="text-xl font-semibold text-primary mb-2">Shipment not found</h2>
          <p className="text-secondary mb-6">No replay data available for ID: {id}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const departureDate = new Date(shipment.departure);
  const currentTimestamp = new Date(departureDate.getTime() + currentFrame * 60 * 60 * 1000);

  const handleZoomIn = () => {
    setPosition(prev => ({ ...prev, zoom: Math.min(prev.zoom * 1.2, 4) }));
  };

  const handleZoomOut = () => {
    setPosition(prev => ({ ...prev, zoom: Math.max(prev.zoom / 1.2, 1) }));
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-border rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-secondary" />
          </button>
          <div>
            <h1 className="text-2xl font-bold font-mono text-primary">{shipment.id}</h1>
            <p className="text-secondary">
              {shipment.origin.city} → {shipment.destination.city}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill status={shipment.status} />
          <RiskBadge risk={shipment.risk} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface border border-border rounded-xl p-4"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCurrentFrame(0);
                setIsPlaying(false);
              }}
              className="p-2 bg-border hover:bg-border/70 rounded-lg transition-colors"
            >
              <RotateCcw className="w-5 h-5 text-secondary" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-3 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            <div className="flex gap-1 ml-2">
              {[1, 2, 4].map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    speed === s
                      ? 'bg-accent text-white'
                      : 'bg-border text-secondary hover:bg-border/70'
                  }`}
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 px-6">
            <div className="text-xs text-secondary mb-1 text-center">
              Hour {currentFrame} of {totalFrames - 1}
            </div>
            <input
              type="range"
              min={0}
              max={totalFrames - 1}
              value={currentFrame}
              step={1}
              onChange={(e) => {
                setCurrentFrame(Number(e.target.value));
                setIsPlaying(false);
              }}
              className="w-full accent-accent cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted mt-1">
              <span>{departureDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span>{new Date(shipment.eta).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-primary">
            <Clock className="w-5 h-5 text-accent" />
            <span className="font-mono text-sm font-medium">
              {currentTimestamp.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-surface border border-border rounded-xl overflow-hidden"
          >
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent" />
                <h3 className="font-semibold text-primary">Live Position Tracker</h3>
              </div>
              <p className="text-sm text-secondary mt-1">
                Hour {currentFrame} — {shipment.origin.city} → {shipment.destination.city}
              </p>
            </div>
            <div className="h-80 relative bg-background">
              <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                  scale: 100
                }}
              >
                <ZoomableGroup
                  center={position.coordinates}
                  zoom={position.zoom}
                  onMoveEnd={({ coordinates, zoom }) => setPosition({ coordinates, zoom })}
                >
                  <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                      geographies.map((geo) => (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill="rgb(var(--surface))"
                          stroke="rgb(var(--border))"
                          strokeWidth={0.5}
                        />
                      ))
                    }
                  </Geographies>

                  <Line
                    from={[shipment.origin.lng, shipment.origin.lat]}
                    to={[shipment.destination.lng, shipment.destination.lat]}
                    stroke="rgb(var(--border))"
                    strokeWidth={1.5}
                    strokeDasharray="4 2"
                    strokeOpacity={0.3}
                  />

                  <Line
                    from={[shipment.origin.lng, shipment.origin.lat]}
                    to={[currentLng, currentLat]}
                    stroke="rgb(14,165,233)"
                    strokeWidth={2}
                  />

                  <Marker coordinates={[shipment.origin.lng, shipment.origin.lat]}>
                    <circle r={6} fill="rgb(16,185,129)" />
                  </Marker>

                  <Marker coordinates={[shipment.destination.lng, shipment.destination.lat]}>
                    <circle r={6} fill="rgb(14,165,233)" opacity={0.5} />
                  </Marker>

                  <Marker coordinates={[currentLng, currentLat]}>
                    <g>
                      <circle
                        r={10}
                        fill={isExcursion ? 'rgb(239,68,68)' : 'rgb(14,165,233)'}
                        opacity={0.2}
                        className="animate-ping"
                      />
                      {isExcursion && (
                        <circle
                          r={15}
                          fill="rgb(239,68,68)"
                          opacity={0.1}
                          className="animate-pulse"
                        />
                      )}
                      <circle
                        r={5}
                        fill={isExcursion ? 'rgb(239,68,68)' : 'rgb(14,165,233)'}
                      />
                    </g>
                  </Marker>
                </ZoomableGroup>
              </ComposableMap>

              <div className="absolute bottom-3 right-3 flex flex-col gap-2">
                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-surface border border-border rounded-lg hover:bg-border/50 transition-colors shadow-lg"
                >
                  <Plus className="w-4 h-4 text-primary" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-surface border border-border rounded-lg hover:bg-border/50 transition-colors shadow-lg"
                >
                  <Minus className="w-4 h-4 text-primary" />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface border border-border rounded-xl p-6"
          >
            <h3 className="font-semibold text-primary mb-6">Journey Timeline</h3>
            <div className="space-y-6">
              {shipment.timeline.map((event, i) => {
                const eventProgress = i / (shipment.timeline.length - 1);
                const state = eventProgress <= progress ? 'completed' : i === currentEventIndex ? 'current' : 'pending';

                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          state === 'completed'
                            ? 'bg-success'
                            : state === 'current'
                            ? 'bg-accent animate-pulse ring-4 ring-accent/20'
                            : 'bg-border'
                        }`}
                      />
                      {i < shipment.timeline.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-2" style={{ minHeight: '40px' }} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className={`font-medium ${state === 'pending' ? 'text-muted' : 'text-primary'}`}>
                        {event.event}
                      </div>
                      <div className="text-sm text-secondary">{event.location}</div>
                      <div className="text-xs text-muted font-mono mt-1">{event.timestamp}</div>
                      {event.temp && state === 'completed' && (
                        <div className="mt-2">
                          <TempPill temp={event.temp} tempClass={shipment.tempClass} />
                        </div>
                      )}
                      {state === 'current' && (
                        <span className="inline-block mt-2 bg-accent/10 text-accent text-xs rounded-full px-2 py-0.5">
                          Current Position
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-surface border border-border rounded-xl p-6"
          >
            <h3 className="font-semibold text-primary mb-6">Live Temperature Reading</h3>
            <div className="flex items-center justify-between">
              <div>
                <div
                  className={`text-5xl font-bold font-mono ${
                    tempStatus === 'excursion'
                      ? 'text-danger animate-pulse'
                      : tempStatus === 'warning'
                      ? 'text-warning'
                      : 'text-success'
                  }`}
                >
                  {currentTempReading.toFixed(1)}°C
                </div>
                <div className="mt-3">
                  <TempPill temp={currentTempReading} tempClass={shipment.tempClass} />
                </div>
                {tempDelta !== 0 && (
                  <div className={`text-sm mt-2 ${tempDelta > 0 ? 'text-danger' : 'text-info'}`}>
                    {tempDelta > 0 ? '↑' : '↓'} {Math.abs(tempDelta).toFixed(1)}°C
                  </div>
                )}
              </div>
              <div className="text-center">
                {isExcursion ? (
                  <div>
                    <AlertTriangle className="w-16 h-16 text-danger mx-auto animate-pulse" />
                    <div className="text-sm font-bold text-danger mt-2">EXCURSION</div>
                    <div className="text-xs text-muted mt-1">Threshold breached</div>
                  </div>
                ) : (
                  <div>
                    <CheckCircle className="w-16 h-16 text-success mx-auto" />
                    <div className="text-sm font-semibold text-success mt-2">Within Range</div>
                  </div>
                )}
                <div className="text-xs text-secondary mt-3">
                  Allowed: {shipment.tempRange.min}°C to {shipment.tempRange.max}°C
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-surface border border-border rounded-xl p-6"
          >
            <h3 className="font-semibold text-primary mb-1">48h Temperature Log</h3>
            <p className="text-sm text-secondary mb-6">Actual vs Predicted — playhead shows current position</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={replayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                  <XAxis
                    dataKey="label"
                    interval={5}
                    stroke="rgb(var(--text-secondary))"
                    fontSize={11}
                    label={{ value: 'Hours', position: 'insideBottomRight', fontSize: 11, offset: -5 }}
                  />
                  <YAxis
                    stroke="rgb(var(--text-secondary))"
                    fontSize={11}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(var(--surface))',
                      border: '1px solid rgb(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}
                  />

                  <ReferenceArea
                    y1={shipment.tempRange.min}
                    y2={shipment.tempRange.max}
                    fill="rgb(16,185,129)"
                    fillOpacity={0.08}
                  />

                  <ReferenceLine
                    y={shipment.tempRange.max}
                    stroke="rgb(239,68,68)"
                    strokeDasharray="3 3"
                    label={{ value: 'Max', position: 'right', fontSize: 10, fill: 'rgb(239,68,68)' }}
                  />
                  <ReferenceLine
                    y={shipment.tempRange.min}
                    stroke="rgb(239,68,68)"
                    strokeDasharray="3 3"
                    label={{ value: 'Min', position: 'right', fontSize: 10, fill: 'rgb(239,68,68)' }}
                  />

                  <ReferenceLine
                    x={currentFrame}
                    stroke="rgb(14,165,233)"
                    strokeWidth={2}
                    label={{ value: '▶', position: 'top', fill: 'rgb(14,165,233)', fontSize: 16 }}
                  />

                  <RechartsLine
                    dataKey="predicted"
                    stroke="rgb(156,163,175)"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    dot={false}
                    name="Predicted"
                  />
                  <RechartsLine
                    dataKey="actual"
                    stroke="rgb(14,165,233)"
                    strokeWidth={2}
                    dot={false}
                    name="Actual"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-surface border border-border rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-5 h-5 text-accent" />
          <h3 className="text-xl font-semibold text-primary">Digital Twin Analysis</h3>
        </div>
        <p className="text-sm text-secondary mb-6">
          Comparing predicted behavior vs actual recorded conditions
        </p>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="text-sm font-semibold text-primary mb-3">Predicted Temperature Profile</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={replayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                  <XAxis dataKey="label" interval={7} stroke="rgb(var(--text-secondary))" fontSize={10} />
                  <YAxis stroke="rgb(var(--text-secondary))" fontSize={10} />
                  <Tooltip />
                  <ReferenceLine
                    y={shipment.tempRange.max}
                    stroke="rgb(239,68,68)"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                  />
                  <ReferenceLine
                    y={shipment.tempRange.min}
                    stroke="rgb(239,68,68)"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                  />
                  <RechartsLine
                    dataKey="predicted"
                    stroke="rgb(156,163,175)"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    dot={false}
                    fill="rgb(14,165,233)"
                    fillOpacity={0.1}
                    type="monotone"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-muted mt-2">Model confidence: 94%</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-primary mb-3">Actual Temperature Profile</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={replayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" />
                  <XAxis dataKey="label" interval={7} stroke="rgb(var(--text-secondary))" fontSize={10} />
                  <YAxis stroke="rgb(var(--text-secondary))" fontSize={10} />
                  <Tooltip />
                  <ReferenceLine
                    y={shipment.tempRange.max}
                    stroke="rgb(239,68,68)"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                  />
                  <ReferenceLine
                    y={shipment.tempRange.min}
                    stroke="rgb(239,68,68)"
                    strokeDasharray="3 3"
                    strokeWidth={1}
                  />
                  {shipment.status === 'excursion' && (
                    <ReferenceArea
                      x1="18h"
                      x2="20h"
                      fill="rgb(239,68,68)"
                      fillOpacity={0.1}
                    />
                  )}
                  <RechartsLine
                    dataKey="actual"
                    stroke={shipment.status === 'excursion' ? 'rgb(239,68,68)' : 'rgb(16,185,129)'}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-xs text-secondary mb-1">Temperature Integrity</div>
            <div
              className={`text-2xl font-bold ${
                parseFloat(integrityPercentage) > 98
                  ? 'text-success'
                  : parseFloat(integrityPercentage) > 90
                  ? 'text-warning'
                  : 'text-danger'
              }`}
            >
              {integrityPercentage}%
            </div>
          </div>

          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-xs text-secondary mb-1">Excursion Events</div>
            <div className={`text-2xl font-bold ${excursionCount === 0 ? 'text-success' : 'text-danger'}`}>
              {excursionCount === 0 ? 'None detected' : `${excursionCount} readings`}
            </div>
          </div>

          <div className="bg-background border border-border rounded-lg p-4">
            <div className="text-xs text-secondary mb-1">Max Deviation</div>
            <div
              className={`text-2xl font-bold ${
                maxDeviation < 1 ? 'text-success' : maxDeviation < 2 ? 'text-warning' : 'text-danger'
              }`}
            >
              {maxDeviation.toFixed(1)}°C
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
