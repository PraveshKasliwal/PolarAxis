import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Globe, CheckCircle, Thermometer, Package, Leaf, AlertTriangle, Clock, Database, FileX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ThemeToggle from '../../components/shared/ThemeToggle';
import { ComposableMap, Geographies, Geography, Line, Marker, ZoomableGroup } from 'react-simple-maps';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function LandingPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ shipments: 0, compliance: 0, countries: 0, tempClasses: 0 });
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 });
  const [isDragging, setIsDragging] = useState(false);

  function handleMoveEnd(position) {
    setPosition(position);
    setIsDragging(false);
  }

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    const targets = { shipments: 247, compliance: 99.8, countries: 14, tempClasses: 3 };
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setStats({
        shipments: Math.floor(targets.shipments * progress),
        compliance: (targets.compliance * progress).toFixed(1),
        countries: Math.floor(targets.countries * progress),
        tempClasses: Math.floor(targets.tempClasses * progress)
      });

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Inter, sans-serif' }}>
      <style>
        {`
          :root {
            --bg-primary: #F5F0E8;
            --bg-secondary: #EDE8DE;
            --bg-dark: #1A1714;
            --text-primary: #1A1714;
            --text-secondary: #6B6560;
            --text-muted: #A8A09A;
            --accent: #C4972A;
            --accent-dark: #A07E22;
            --border: #D9D3C7;
          }
        `}
      </style>

      <nav className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-sm" style={{ backgroundColor: 'rgba(245, 240, 232, 0.95)', borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontWeight: 'bold', color: 'var(--text-primary)', letterSpacing: '0.3em', fontSize: '0.875rem' }}>
            POLARAXIS
          </div>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <button
              onClick={() => navigate('/login')}
              style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.875rem', letterSpacing: '0.05em', color: 'var(--text-secondary)', transition: 'color 0.3s' }}
              className="hover:text-[#1A1714]"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="absolute rounded-full border opacity-60" style={{ width: '600px', height: '600px', borderColor: 'var(--border)', top: '-8rem', right: '-8rem' }} />
        <div className="absolute rounded-full border opacity-60" style={{ width: '400px', height: '400px', borderColor: 'var(--border)', top: '-4rem', right: '-4rem' }} />
        <div className="absolute rounded-full opacity-30" style={{ width: '2rem', height: '2rem', backgroundColor: 'var(--accent)', bottom: '8rem', left: '4rem' }} />

        <div className="max-w-6xl mx-auto px-8 pt-32 pb-20 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-8 flex items-center">
                <div className="inline-block align-middle mr-3 border-t" style={{ width: '2rem', borderColor: 'var(--accent)' }} />
                <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--accent)' }}>
                  PHARMACEUTICAL COLD CHAIN
                </span>
              </div>

              <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(3rem, 6vw, 5.5rem)', lineHeight: '1.05', color: 'var(--text-primary)' }}>
                Temperature<br />
                <span style={{ fontStyle: 'italic' }}>Certain.</span><br />
                Globally<br />
                <span style={{ fontStyle: 'italic' }}>Delivered.</span>
              </h1>

              <p className="mt-8 mb-12" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300, fontSize: '1.125rem', lineHeight: '1.75', color: 'var(--text-secondary)', maxWidth: '28rem' }}>
                Enterprise cold-chain logistics for pharmaceutical companies. Real-time monitoring, AI-powered routing, compliance automation.
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 transition-all duration-300"
                  style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.875rem', letterSpacing: '0.05em', backgroundColor: 'var(--bg-dark)', color: 'var(--bg-primary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-dark)'}
                >
                  Enter Platform
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 border bg-transparent transition-all duration-300"
                  style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.875rem', letterSpacing: '0.05em', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  Request Demo
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="border p-8"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}
            >
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
                LIVE TELEMETRY SNAPSHOT
              </div>
              <div className="border-t my-4" style={{ borderColor: 'var(--border)' }} />

              {[
                { id: 'PX-2024-0891', status: 'IN TRANSIT', temp: '4.2°C', statusBg: 'var(--bg-dark)', statusText: 'var(--bg-primary)', tempColor: 'var(--accent)' },
                { id: 'PX-2024-0887', status: 'IN TRANSIT', temp: '-68.4°C', statusBg: 'var(--bg-dark)', statusText: 'var(--bg-primary)', tempColor: 'var(--accent)' },
                { id: 'PX-2024-0876', status: 'EXCURSION', temp: '-17.1°C', statusBg: '#7f1d1d', statusText: 'white', tempColor: '#b91c1c' }
              ].map((shipment, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b" style={{ borderColor: 'rgba(217, 211, 199, 0.5)' }}>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', color: 'var(--text-primary)' }}>
                    {shipment.id}
                  </span>
                  <span className="px-2 py-0.5" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', backgroundColor: shipment.statusBg, color: shipment.statusText }}>
                    {shipment.status}
                  </span>
                  <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.875rem', color: shipment.tempColor }}>
                    {shipment.temp}
                  </span>
                </div>
              ))}

              <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-4" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    99.8%
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Temp Compliance
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                    247
                  </div>
                  <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Active Shipments
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: 'var(--bg-dark)' }}>
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { value: stats.shipments, label: 'ACTIVE SHIPMENTS' },
              { value: `${stats.compliance}%`, label: 'TEMP COMPLIANCE' },
              { value: stats.countries, label: 'COUNTRIES' },
              { value: stats.tempClasses, label: 'TEMP CLASSES' }
            ].map((stat, i) => (
              <div key={i} className="text-center px-8" style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '3rem', fontWeight: 'bold', color: 'var(--bg-primary)' }}>
                  {stat.value}
                </div>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '0.75rem' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-40 px-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-5xl mx-auto">
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', letterSpacing: '0.3em', color: 'var(--accent)', marginBottom: '6rem' }}>
            OUR PHILOSOPHY
          </div>

          {[
            { text: 'Everything is data.', italic: true, align: 'left', indent: false, desc: 'Temperature readings, route conditions, carrier performance — every signal is an opportunity to act faster, smarter.' },
            { text: ['Cold chain failure ', <span key="1" style={{ fontStyle: 'italic', color: 'var(--accent)' }}>is not an option.</span>], italic: false, align: 'left', indent: true, desc: 'A 2°C deviation destroys months of research. We monitor every degree, every minute, worldwide.' },
            { text: ['Compliance is the floor, ', <br key="br1" />, 'not the ceiling.'], italic: true, align: 'right', indent: false, desc: 'Regulatory requirements are the baseline. PolarAxis builds everything above it — predictive risk, proactive rerouting, zero surprises.' },
            { text: ['Talent is global. ', <br key="br2" />, <span key="2" style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Cold chain should be too.</span>], italic: false, align: 'center', indent: false, desc: 'From major pharma hubs to emerging markets, we bring pharmaceutical-grade logistics everywhere.' }
          ].map((block, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: '-80px' }}
              className="mb-28"
              style={{
                paddingLeft: block.indent ? 'clamp(4rem, 10vw, 10rem)' : '0',
                textAlign: block.align
              }}
            >
              <div style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                lineHeight: '1.1',
                color: 'var(--text-primary)',
                fontStyle: block.italic ? 'italic' : 'normal',
                marginBottom: '1.5rem'
              }}>
                {block.text}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                viewport={{ once: true }}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 300,
                  fontSize: '1.125rem',
                  color: 'var(--text-secondary)',
                  maxWidth: '36rem',
                  marginTop: '1.5rem',
                  marginLeft: block.align === 'right' ? 'auto' : block.align === 'center' ? 'auto' : '0',
                  marginRight: block.align === 'right' ? '0' : block.align === 'center' ? 'auto' : 'auto'
                }}
              >
                {block.desc}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-32 px-8" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto mb-4">
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontStyle: 'italic', color: 'var(--text-primary)' }}>
            The cost of getting it wrong
          </h2>
        </div>
        <div className="max-w-4xl mx-auto mb-20">
          <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300, color: 'var(--text-secondary)' }}>
            Why pharmaceutical logistics needs specialized control
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ backgroundColor: 'var(--border)', gap: '1px' }}>
          {[
            { stat: '$35B', title: 'ANNUAL LOSSES', desc: 'From temperature excursions globally', color: '#b91c1c' },
            { stat: '47%', title: 'DELAYED SHIPMENTS', desc: 'Face unexpected customs delays', color: '#b45309' },
            { stat: '12+', title: 'SYSTEMS', desc: 'Average tools per pharma supply chain', color: 'var(--bg-dark)' },
            { stat: '1 in 5', title: 'COMPLIANCE FAILURES', desc: 'Shipments lack proper docs', color: 'var(--text-secondary)' }
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
              viewport={{ once: true, margin: '-80px' }}
              className="p-10 transition-colors"
              style={{ backgroundColor: 'var(--bg-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
            >
              <div style={{ height: '2px', width: '100%', backgroundColor: card.color, marginBottom: '1.5rem' }} />
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '3.75rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: '1.5rem 0' }}>
                {card.stat}
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                {card.title}
              </div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 300, lineHeight: '1.75' }}>
                {card.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-32 px-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="mb-16" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontStyle: 'italic', color: 'var(--text-primary)' }}>
            Four steps to certainty
          </h2>

          {[
            {
              step: '01',
              title: 'Procure',
              desc: 'Browse certified suppliers, request materials with defined temperature specifications and SLA guarantees.',
              visual: (
                <div className="grid grid-cols-4 grid-rows-3 gap-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="border" style={{ width: '1.25rem', height: '1.25rem', borderColor: 'var(--border)', backgroundColor: i % 3 === 0 ? 'var(--bg-dark)' : 'transparent' }} />
                  ))}
                </div>
              )
            },
            {
              step: '02',
              title: 'Route',
              desc: 'AI compares cost, risk, transit time, and carbon footprint across all available transport modes.',
              visual: (
                <div className="space-y-3">
                  {[
                    { label: 'AIR', width: '100%', bg: 'var(--bg-dark)', duration: '2.1d' },
                    { label: 'SEA', width: '75%', bg: 'var(--text-secondary)', duration: '18d' },
                    { label: 'ROAD', width: '50%', bg: 'var(--text-muted)', duration: '6d' }
                  ].map((mode, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', color: 'var(--text-primary)', width: '3rem' }}>
                        {mode.label}
                      </span>
                      <div style={{ width: mode.width, height: '6px', backgroundColor: mode.bg }} />
                      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {mode.duration}
                      </span>
                    </div>
                  ))}
                </div>
              )
            },
            {
              step: '03',
              title: 'Monitor',
              desc: 'Real-time telemetry every 15 minutes with instant excursion alerts and predictive risk scoring.',
              visual: (
                <svg width="200" height="60" viewBox="0 0 200 60">
                  <line x1="0" y1="20" x2="200" y2="20" stroke="var(--border)" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="0" y1="40" x2="200" y2="40" stroke="var(--border)" strokeDasharray="4 4" strokeWidth="1" />
                  <polyline
                    points="0,30 20,28 40,32 60,29 80,31 100,35 120,48 140,50 160,38 180,30 200,31"
                    stroke="var(--accent)"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              )
            },
            {
              step: '04',
              title: 'Certify',
              desc: 'Automated compliance dossiers and audit trails accepted by any regulatory body worldwide.',
              visual: (
                <div className="relative" style={{ width: '8rem' }}>
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="absolute border"
                      style={{
                        width: '8rem',
                        height: '10rem',
                        borderColor: 'var(--border)',
                        backgroundColor: 'var(--bg-secondary)',
                        top: `${i * 8}px`,
                        left: `${i * 8}px`
                      }}
                    >
                      {i === 0 && (
                        <>
                          <div className="absolute top-2 left-2 right-2 border-b" style={{ borderColor: 'var(--border)', height: '2px' }} />
                          <div className="absolute top-4 left-2 right-2 border-b" style={{ borderColor: 'var(--border)', height: '2px' }} />
                          <div className="absolute top-6 left-2 right-2 border-b" style={{ borderColor: 'var(--border)', height: '2px' }} />
                          <div className="absolute top-8 left-2 right-2 border-b" style={{ borderColor: 'var(--border)', height: '2px' }} />
                          <div className="absolute bottom-4 right-4" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.5rem', color: 'var(--accent)' }}>
                            ✓
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )
            }
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
              viewport={{ once: true, margin: '-80px' }}
              className="flex items-center gap-16 min-h-[200px] border-b py-16"
              style={{
                flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
                borderColor: 'var(--border)'
              }}
            >
              <div className="flex-1">
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.2em', marginBottom: '0.75rem' }}>
                  STEP {step.step}
                </div>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.875rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                  {step.title}
                </h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300, fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '28rem', lineHeight: '1.75' }}>
                  {step.desc}
                </p>
              </div>
              <div className="flex-1 flex justify-center">
                {step.visual}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-32 px-8" style={{ backgroundColor: 'var(--bg-dark)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center mb-12" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--bg-primary)' }}>
            A network built for{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>pharmaceutical precision.</span>
          </h2>

          <div className="border" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="relative h-[500px] overflow-hidden" style={{ cursor: isDragging ? 'grabbing' : 'grab' }}>
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
                          fill="rgba(255, 255, 255, 0.04)"
                          stroke="rgba(255, 255, 255, 0.1)"
                          strokeWidth={0.5}
                        />
                      ))
                    }
                  </Geographies>
                  {[
                    { from: [-74, 40.7], to: [2.35, 48.86] },
                    { from: [2.35, 48.86], to: [139.69, 35.68] },
                    { from: [-122, 37.77], to: [151.2, -33.86] },
                    { from: [139.69, 35.68], to: [103.85, 1.35] },
                    { from: [103.85, 1.35], to: [77.1, 28.7] }
                  ].map((route, i) => (
                    <motion.g
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.2, duration: 1 }}
                    >
                      <Line
                        from={route.from}
                        to={route.to}
                        stroke="var(--accent)"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeDasharray="5,5"
                        opacity={0.8}
                      />
                      <Marker coordinates={route.from}>
                        <circle r={4} fill="var(--accent)" />
                      </Marker>
                      <Marker coordinates={route.to}>
                        <circle r={4} fill="var(--accent)" opacity={0.6} />
                      </Marker>
                    </motion.g>
                  ))}
                </ZoomableGroup>
              </ComposableMap>
              <div className="absolute bottom-3 right-3 flex flex-col gap-1">
                <button
                  onClick={() => setPosition(pos => ({ ...pos, zoom: Math.min(pos.zoom * 1.5, 8) }))}
                  className="w-8 h-8 border flex items-center justify-center text-lg font-bold transition-colors"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                >
                  +
                </button>
                <button
                  onClick={() => setPosition(pos => ({ ...pos, zoom: Math.max(pos.zoom / 1.5, 1) }))}
                  className="w-8 h-8 border flex items-center justify-center text-lg font-bold transition-colors"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                >
                  −
                </button>
                <button
                  onClick={() => setPosition({ coordinates: [0, 20], zoom: 1 })}
                  className="w-8 h-8 border flex items-center justify-center transition-colors"
                  style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
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
        </div>
      </section>

      <section className="py-32 px-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-6xl mx-auto">
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', letterSpacing: '0.3em', color: 'var(--accent)', marginBottom: '1rem' }}>
            TEMPERATURE CLASSES
          </div>
          <h2 className="mb-16" style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.25rem', color: 'var(--text-primary)' }}>
            Precision for every molecule.
          </h2>

          <div className="grid grid-cols-3 gap-6">
            {[
              { range: '2-8°C', use: 'Vaccines · Biologics · Proteins', color: 'var(--accent)', barColor: 'var(--accent)' },
              { range: '-20°C', use: 'Plasma · Enzymes · Reagents', color: 'var(--text-primary)', barColor: 'var(--text-secondary)' },
              { range: '-70°C', use: 'mRNA · Gene Therapy · CAR-T', color: 'var(--text-primary)', barColor: 'var(--bg-dark)' }
            ].map((tc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                viewport={{ once: true, margin: '-80px' }}
                className="relative border p-10 flex flex-col justify-between transition-colors"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)', minHeight: '320px' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E8E2D6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
              >
                <div className="absolute left-0 top-0 bottom-0" style={{ width: '2px', backgroundColor: tc.barColor }} />
                <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                  {tc.range}
                </div>
                <div className="border-t my-6" style={{ borderColor: 'var(--border)' }} />
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.05em', lineHeight: '2' }}>
                  {tc.use}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-8" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center mb-4" style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontStyle: 'italic', color: 'var(--text-primary)' }}>
            Simple, transparent pricing.
          </h2>
          <p className="text-center mb-16" style={{ fontFamily: 'Inter, sans-serif', color: 'var(--text-secondary)' }}>
            Choose the plan that fits your scale
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Starter',
                price: '$2,499',
                period: '/month',
                features: ['Up to 50 shipments/month', '2-8°C temperature class', 'Basic analytics', 'Email support', 'Standard documentation'],
                highlighted: false
              },
              {
                name: 'Professional',
                price: '$7,999',
                period: '/month',
                features: ['Up to 200 shipments/month', 'All temperature classes', 'Advanced analytics', 'Priority support', 'Compliance dossiers', 'API access'],
                highlighted: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                features: ['Unlimited shipments', 'Dedicated infrastructure', 'White-glove support', 'Custom integrations', 'SLA guarantees', 'On-site training'],
                highlighted: false
              }
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                viewport={{ once: true, margin: '-80px' }}
                className="p-10"
                style={{
                  backgroundColor: plan.highlighted ? 'var(--bg-dark)' : 'transparent',
                  border: plan.highlighted ? 'none' : '1px solid var(--border)'
                }}
              >
                <h3 style={{
                  fontFamily: 'IBM Plex Mono, monospace',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  color: plan.highlighted ? 'var(--bg-primary)' : 'var(--text-primary)'
                }}>
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span style={{
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: plan.highlighted ? 'var(--bg-primary)' : 'var(--text-primary)'
                  }}>
                    {plan.price}
                  </span>
                  <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    color: plan.highlighted ? 'rgba(255,255,255,0.4)' : 'var(--text-muted)'
                  }}>
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-2">
                      <span style={{
                        fontFamily: 'IBM Plex Mono, monospace',
                        color: 'var(--accent)',
                        fontSize: '0.875rem'
                      }}>
                        —
                      </span>
                      <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.875rem',
                        color: plan.highlighted ? 'rgba(255,255,255,0.6)' : 'var(--text-secondary)'
                      }}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full px-6 py-3 transition-all"
                  style={{
                    fontFamily: 'IBM Plex Mono, monospace',
                    fontSize: '0.875rem',
                    fontWeight: plan.highlighted ? 600 : 400,
                    backgroundColor: plan.highlighted ? 'var(--accent)' : 'transparent',
                    color: plan.highlighted ? 'var(--bg-dark)' : 'var(--text-primary)',
                    border: plan.highlighted ? 'none' : '1px solid var(--bg-dark)'
                  }}
                  onMouseEnter={(e) => {
                    if (plan.highlighted) {
                      e.currentTarget.style.backgroundColor = 'var(--accent-dark)';
                    } else {
                      e.currentTarget.style.backgroundColor = 'var(--bg-dark)';
                      e.currentTarget.style.color = 'var(--bg-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (plan.highlighted) {
                      e.currentTarget.style.backgroundColor = 'var(--accent)';
                    } else {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }
                  }}
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-40 px-8 text-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: '1.1' }}>
            <span style={{ color: 'var(--text-primary)' }}>Ready to ship with </span>
            <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>confidence?</span>
          </h2>
          <p className="mt-6 mb-12" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300, fontSize: '1.125rem', color: 'var(--text-secondary)' }}>
            Join pharmaceutical companies worldwide who trust PolarAxis for their cold chain.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 transition-all duration-300"
              style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.875rem', letterSpacing: '0.05em', backgroundColor: 'var(--bg-dark)', color: 'var(--bg-primary)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-dark)'}
            >
              Enter Platform
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 border bg-transparent transition-all duration-300"
              style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.875rem', letterSpacing: '0.05em', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              Request Demo
            </button>
          </div>
        </div>
      </section>

      <footer className="py-12 px-8" style={{ backgroundColor: 'var(--bg-dark)' }}>
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', letterSpacing: '0.3em', color: 'rgba(245,240,232,0.3)' }}>
            POLARAXIS
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: 'rgba(245,240,232,0.2)' }}>
            Cold chain control. Zero compromise.
          </div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', color: 'rgba(245,240,232,0.2)' }}>
            © 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
