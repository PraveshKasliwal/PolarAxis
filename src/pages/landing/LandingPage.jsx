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
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <style>
        {`
          :root {
            --teal-primary: #16b6bb;
            --teal-dark: #008086;
            --teal-light: #befcfe;
            --red-accent: #891f00;
            --bg: #ffffff;
            --bg-soft: #f4fefe;
            --bg-muted: #eaf9f9;
            --text-primary: #0d2b2c;
            --text-secondary: #3d6b6c;
            --text-muted: #7aa8a9;
            --border: #cceced;
          }
        `}
      </style>

      <nav className="sticky top-0 bg-white border-b z-50" style={{ borderColor: '#cceced' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-7 h-7 rounded-sm" style={{ backgroundColor: '#16b6bb' }} />
            <span className="ml-2 font-semibold text-lg" style={{ color: '#0d2b2c' }}>PolarAxis</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: '#16b6bb', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#008086'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16b6bb'}
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      <section className="bg-white pt-20 pb-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full text-xs font-medium border"
            style={{ backgroundColor: '#eaf9f9', color: '#008086', borderColor: '#cceced' }}
          >
            Pharmaceutical Cold Chain Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="font-bold leading-tight mb-6"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#0d2b2c' }}
          >
            Ship pharmaceuticals with{' '}
            <span style={{ color: '#16b6bb' }}>temperature certainty.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="font-normal text-lg leading-relaxed mb-10 max-w-2xl mx-auto"
            style={{ color: '#3d6b6c' }}
          >
            Real-time cold chain monitoring, AI-powered routing, and automated compliance for global pharmaceutical logistics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex gap-3 justify-center"
          >
            <button
              onClick={() => navigate('/login')}
              className="px-7 py-3.5 rounded-lg font-semibold text-sm transition-colors shadow-sm"
              style={{ backgroundColor: '#16b6bb', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#008086'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16b6bb'}
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-7 py-3.5 rounded-lg font-medium text-sm bg-white border transition-colors"
              style={{ borderColor: '#cceced', color: '#3d6b6c' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#16b6bb';
                e.currentTarget.style.color = '#0d2b2c';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#cceced';
                e.currentTarget.style.color = '#3d6b6c';
              }}
            >
              Request a Demo
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 border rounded-2xl overflow-hidden shadow-xl max-w-4xl mx-auto"
            style={{ borderColor: '#cceced', boxShadow: '0 20px 60px rgba(22, 182, 187, 0.1)' }}
          >
            <div className="px-4 py-3 border-b flex items-center gap-2" style={{ backgroundColor: '#eaf9f9', borderColor: '#cceced' }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#891f00' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#16b6bb' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#008086' }} />
              <span className="ml-3 text-xs" style={{ color: '#3d6b6c' }}>PolarAxis Control Tower</span>
            </div>

            <div className="p-6 grid grid-cols-4 gap-4" style={{ backgroundColor: '#f4fefe' }}>
              <div className="bg-white border rounded-lg p-4" style={{ borderColor: '#cceced' }}>
                <div className="font-bold text-2xl" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#0d2b2c' }}>247</div>
                <div className="text-xs mt-1" style={{ color: '#7aa8a9' }}>Active Shipments</div>
              </div>
              <div className="bg-white border rounded-lg p-4" style={{ borderColor: '#cceced' }}>
                <div className="font-bold text-2xl" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#16b6bb' }}>99.8%</div>
                <div className="text-xs mt-1" style={{ color: '#7aa8a9' }}>Temp Compliance</div>
              </div>
              <div className="bg-white border rounded-lg p-4" style={{ borderColor: '#cceced' }}>
                <div className="font-bold text-2xl" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#0d2b2c' }}>14</div>
                <div className="text-xs mt-1" style={{ color: '#7aa8a9' }}>Countries</div>
              </div>
              <div className="bg-white border rounded-lg p-4" style={{ borderColor: '#cceced' }}>
                <div className="font-bold text-2xl" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#891f00' }}>2</div>
                <div className="text-xs mt-1" style={{ color: '#7aa8a9' }}>Excursions</div>
              </div>

              <div className="col-span-4 bg-white border rounded-lg overflow-hidden" style={{ borderColor: '#cceced' }}>
                <div className="px-4 py-2 grid grid-cols-5 gap-2 text-xs font-medium uppercase tracking-wide" style={{ backgroundColor: '#eaf9f9', color: '#7aa8a9' }}>
                  <div>Shipment ID</div>
                  <div>Route</div>
                  <div>Status</div>
                  <div>Temp</div>
                  <div>Risk</div>
                </div>
                <div className="px-4 py-3 border-t grid grid-cols-5 gap-2 text-xs" style={{ borderColor: '#cceced' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#0d2b2c' }}>PX-2024-0891</div>
                  <div style={{ color: '#3d6b6c' }}>AMS → BOM</div>
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: '#eaf9f9', color: '#008086' }}>
                      In Transit
                    </span>
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#16b6bb' }}>4.2°C</div>
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700">Low</span>
                  </div>
                </div>
                <div className="px-4 py-3 border-t grid grid-cols-5 gap-2 text-xs" style={{ borderColor: '#cceced' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#0d2b2c' }}>PX-2024-0887</div>
                  <div style={{ color: '#3d6b6c' }}>JFK → SIN</div>
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: '#eaf9f9', color: '#008086' }}>
                      In Transit
                    </span>
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#16b6bb' }}>-68.4°C</div>
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-700">Low</span>
                  </div>
                </div>
                <div className="px-4 py-3 border-t grid grid-cols-5 gap-2 text-xs" style={{ borderColor: '#cceced' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#0d2b2c' }}>PX-2024-0876</div>
                  <div style={{ color: '#3d6b6c' }}>CDG → KUL</div>
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'rgba(137, 31, 0, 0.1)', color: '#891f00' }}>
                      Excursion
                    </span>
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#891f00' }}>-17.1°C</div>
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-xs bg-red-50 text-red-700">High</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-14" style={{ backgroundColor: '#16b6bb' }}>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4">
          {[
            { value: stats.shipments, label: 'ACTIVE SHIPMENTS' },
            { value: `${stats.compliance}%`, label: 'TEMP COMPLIANCE' },
            { value: stats.countries, label: 'COUNTRIES COVERED' },
            { value: stats.tempClasses, label: 'TEMP CLASSES' }
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center px-8"
              style={{ borderRight: i < 3 ? '1px solid rgba(255,255,255,0.2)' : 'none' }}
            >
              <div className="font-bold text-5xl text-white" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {stat.value}
              </div>
              <div className="text-xs mt-2 uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-60px' }}
            className="text-center mb-14"
          >
            <div className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#008086' }}>
              Why it matters
            </div>
            <h2 className="font-bold mb-4" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#0d2b2c' }}>
              Cold chain failure is costly.
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: '#3d6b6c' }}>
              Pharmaceutical logistics needs specialized control
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: Thermometer,
                iconBg: 'rgba(137, 31, 0, 0.1)',
                iconColor: '#891f00',
                stat: '$35B',
                title: 'Temperature Excursions',
                desc: 'Annual losses from cold chain failures globally'
              },
              {
                icon: Clock,
                iconBg: 'rgba(22, 182, 187, 0.1)',
                iconColor: '#16b6bb',
                stat: '47%',
                title: 'Delayed Shipments',
                desc: 'Face unexpected customs or carrier delays'
              },
              {
                icon: Database,
                iconBg: 'rgba(13, 43, 44, 0.1)',
                iconColor: '#0d2b2c',
                stat: '12+',
                title: 'Disconnected Systems',
                desc: 'Average tools per pharmaceutical supply chain'
              },
              {
                icon: FileX,
                iconBg: 'rgba(137, 31, 0, 0.1)',
                iconColor: '#891f00',
                stat: '1 in 5',
                title: 'Compliance Failures',
                desc: 'Shipments missing proper regulatory documentation'
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                viewport={{ once: true, margin: '-60px' }}
                className="border rounded-xl p-6 hover:shadow-md transition-all duration-200"
                style={{ backgroundColor: '#f4fefe', borderColor: '#cceced' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(22, 182, 187, 0.4)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cceced'}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: card.iconBg }}>
                  <card.icon className="w-5 h-5" style={{ color: card.iconColor }} />
                </div>
                <div className="font-bold text-3xl mb-2" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#0d2b2c' }}>
                  {card.stat}
                </div>
                <div className="font-semibold text-sm mb-2" style={{ color: '#0d2b2c' }}>
                  {card.title}
                </div>
                <div className="text-xs leading-relaxed" style={{ color: '#7aa8a9' }}>
                  {card.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6" style={{ backgroundColor: '#f4fefe' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-60px' }}
            className="text-center mb-14"
          >
            <div className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#008086' }}>
              How it works
            </div>
            <h2 className="font-bold" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#0d2b2c' }}>
              From order to delivery,{' '}
              <span style={{ color: '#16b6bb' }}>in four steps.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8 mt-14">
            {[
              {
                num: '01',
                title: 'Procure',
                desc: 'Browse certified suppliers with defined temperature specs and quality guarantees'
              },
              {
                num: '02',
                title: 'Route',
                desc: 'AI selects the optimal route by cost, risk, speed, and carbon footprint'
              },
              {
                num: '03',
                title: 'Monitor',
                desc: 'Real-time temperature telemetry with instant excursion alerts'
              },
              {
                num: '04',
                title: 'Certify',
                desc: 'Auto-generated compliance docs and full audit trail for any regulator'
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                viewport={{ once: true, margin: '-60px' }}
                className="flex flex-col items-center text-center relative"
              >
                <div className="w-10 h-10 rounded-full text-white font-bold text-sm flex items-center justify-center relative z-10 mb-4" style={{ backgroundColor: '#16b6bb' }}>
                  {step.num}
                </div>
                <div className="font-semibold text-base mb-2" style={{ color: '#0d2b2c' }}>
                  {step.title}
                </div>
                <div className="text-xs leading-relaxed max-w-[180px] mx-auto" style={{ color: '#7aa8a9' }}>
                  {step.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-60px' }}
            className="text-center mb-10"
          >
            <h2 className="font-bold mb-2" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#0d2b2c' }}>
              Global logistics network
            </h2>
            <p className="text-sm" style={{ color: '#3d6b6c' }}>
              Live cold-chain routes across 14 countries
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, margin: '-60px' }}
            className="border rounded-2xl overflow-hidden"
            style={{ borderColor: '#cceced', backgroundColor: '#f4fefe' }}
          >
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
                          fill="#eaf9f9"
                          stroke="#cceced"
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
                        stroke="#16b6bb"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeDasharray="5,5"
                        opacity={0.8}
                      />
                      <Marker coordinates={route.from}>
                        <circle r={4} fill="#16b6bb" />
                      </Marker>
                      <Marker coordinates={route.to}>
                        <circle r={4} fill="#16b6bb" opacity={0.6} />
                      </Marker>
                    </motion.g>
                  ))}
                </ZoomableGroup>
              </ComposableMap>
              <div className="absolute bottom-3 right-3 flex flex-col gap-1">
                <button
                  onClick={() => setPosition(pos => ({ ...pos, zoom: Math.min(pos.zoom * 1.5, 8) }))}
                  className="w-8 h-8 bg-white border rounded-lg flex items-center justify-center text-lg font-bold transition-colors"
                  style={{ borderColor: '#cceced', color: '#3d6b6c' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eaf9f9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  +
                </button>
                <button
                  onClick={() => setPosition(pos => ({ ...pos, zoom: Math.max(pos.zoom / 1.5, 1) }))}
                  className="w-8 h-8 bg-white border rounded-lg flex items-center justify-center text-lg font-bold transition-colors"
                  style={{ borderColor: '#cceced', color: '#3d6b6c' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eaf9f9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  −
                </button>
                <button
                  onClick={() => setPosition({ coordinates: [0, 20], zoom: 1 })}
                  className="w-8 h-8 bg-white border rounded-lg flex items-center justify-center transition-colors"
                  style={{ borderColor: '#cceced', color: '#3d6b6c' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eaf9f9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
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
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-60px' }}
            className="text-center mb-14"
          >
            <div className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#008086' }}>
              Built for pharma
            </div>
            <h2 className="font-bold" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#0d2b2c' }}>
              Everything your team needs.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: 'Multitenant Security',
                desc: 'Enterprise data isolation with role-based access control per organization'
              },
              {
                icon: Zap,
                title: 'AI Route Intelligence',
                desc: 'Route optimization across cost, risk, transit time, and carbon'
              },
              {
                icon: Thermometer,
                title: 'Real-Time Telemetry',
                desc: '24/7 temperature monitoring with instant excursion alerts'
              },
              {
                icon: CheckCircle,
                title: 'Compliance-Ready',
                desc: 'Automated audit trails and documentation for global regulators'
              },
              {
                icon: Package,
                title: 'Emergency Mode',
                desc: 'Priority routing and carrier capacity reservation for critical shipments'
              },
              {
                icon: Leaf,
                title: 'Carbon Tracking',
                desc: 'CO₂ monitoring and sustainability recommendations per route'
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                viewport={{ once: true, margin: '-60px' }}
                className="border rounded-xl p-6 hover:shadow-sm transition-all"
                style={{ borderColor: '#cceced' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(22, 182, 187, 0.5)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cceced'}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: '#eaf9f9' }}>
                  <feature.icon className="w-5 h-5" style={{ color: '#008086' }} />
                </div>
                <div className="font-semibold text-sm mb-2" style={{ color: '#0d2b2c' }}>
                  {feature.title}
                </div>
                <div className="text-xs leading-relaxed" style={{ color: '#7aa8a9' }}>
                  {feature.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6" style={{ backgroundColor: '#f4fefe' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-60px' }}
            className="text-center mb-10"
          >
            <div className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#008086' }}>
              Temperature classes
            </div>
            <h2 className="font-bold" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#0d2b2c' }}>
              Certified for every cold chain requirement.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-10">
            {[
              {
                range: '2-8°C',
                color: '#16b6bb',
                use: 'Standard Cold',
                examples: 'Vaccines, Biologics, Proteins'
              },
              {
                range: '-20°C',
                color: '#008086',
                use: 'Frozen',
                examples: 'Plasma, Enzymes, Reagents'
              },
              {
                range: '-70°C',
                color: '#891f00',
                use: 'Ultra-Cold',
                examples: 'mRNA, Gene Therapy, CAR-T'
              }
            ].map((tc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                viewport={{ once: true, margin: '-60px' }}
                className="bg-white border rounded-xl p-8 hover:shadow-sm transition-all"
                style={{ borderColor: '#cceced' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(22, 182, 187, 0.5)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cceced'}
              >
                <div className="font-bold text-4xl mb-1" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#0d2b2c' }}>
                  {tc.range}
                </div>
                <div className="w-10 h-0.5 rounded-full mt-2 mb-4" style={{ backgroundColor: tc.color }} />
                <div className="text-sm font-medium mb-1" style={{ color: '#3d6b6c' }}>
                  {tc.use}
                </div>
                <div className="text-xs" style={{ color: '#7aa8a9' }}>
                  {tc.examples}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-60px' }}
            className="text-center mb-12"
          >
            <div className="text-xs font-medium uppercase tracking-widest mb-3" style={{ color: '#008086' }}>
              Pricing
            </div>
            <h2 className="font-bold" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', color: '#0d2b2c' }}>
              Simple plans, no surprises.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              {
                name: 'STARTER',
                price: '$2,499',
                period: '/month',
                features: ['Up to 50 shipments/month', '2-8°C temperature class', 'Basic analytics', 'Email support', 'Standard documentation'],
                highlighted: false
              },
              {
                name: 'PROFESSIONAL',
                price: '$7,999',
                period: '/month',
                features: ['Up to 200 shipments/month', 'All temperature classes', 'Advanced analytics', 'Priority support', 'Compliance dossiers', 'API access'],
                highlighted: true
              },
              {
                name: 'ENTERPRISE',
                price: 'Custom',
                period: '',
                features: ['Unlimited shipments', 'Dedicated infrastructure', 'White-glove support', 'Custom integrations', 'SLA guarantees', 'On-site training'],
                highlighted: false
              }
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                viewport={{ once: true, margin: '-60px' }}
                className="border rounded-xl p-8"
                style={{
                  backgroundColor: plan.highlighted ? '#0d2b2c' : '#f4fefe',
                  borderColor: plan.highlighted ? '#0d2b2c' : '#cceced'
                }}
              >
                {plan.highlighted && (
                  <div className="text-center -mt-4 mb-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs text-white" style={{ backgroundColor: '#16b6bb' }}>
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="font-semibold text-sm uppercase tracking-wide mb-2" style={{ color: plan.highlighted ? '#befcfe' : '#3d6b6c' }}>
                  {plan.name}
                </div>
                <div className="font-bold text-4xl mb-1" style={{ fontFamily: 'JetBrains Mono, monospace', color: plan.highlighted ? 'white' : '#0d2b2c' }}>
                  {plan.price}
                </div>
                <div className="text-sm mb-6" style={{ color: '#7aa8a9' }}>
                  {plan.period}
                </div>
                <div className="border-t mb-6" style={{ borderColor: plan.highlighted ? 'rgba(255,255,255,0.1)' : '#cceced' }} />
                <div className="space-y-2.5 mb-6">
                  {plan.features.map((feature, fi) => (
                    <div key={fi} className="flex items-start gap-2 text-sm">
                      <span className="text-xs" style={{ color: plan.highlighted ? '#befcfe' : '#16b6bb' }}>✓</span>
                      <span style={{ color: plan.highlighted ? 'rgba(255,255,255,0.6)' : '#3d6b6c' }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-3 rounded-lg text-sm font-medium transition-all mt-6"
                  style={{
                    backgroundColor: plan.highlighted ? '#16b6bb' : 'transparent',
                    color: plan.highlighted ? 'white' : '#16b6bb',
                    border: plan.highlighted ? 'none' : '1px solid #16b6bb'
                  }}
                  onMouseEnter={(e) => {
                    if (plan.highlighted) {
                      e.currentTarget.style.backgroundColor = '#008086';
                    } else {
                      e.currentTarget.style.backgroundColor = '#16b6bb';
                      e.currentTarget.style.color = 'white';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (plan.highlighted) {
                      e.currentTarget.style.backgroundColor = '#16b6bb';
                    } else {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#16b6bb';
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

      <section className="py-20 px-6 text-center" style={{ backgroundColor: '#16b6bb' }}>
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: '-60px' }}
            className="font-bold text-white mb-4"
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            Ready to take control of your cold chain?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, margin: '-60px' }}
            className="text-base mb-10 max-w-xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.8)' }}
          >
            Join pharmaceutical companies worldwide who trust PolarAxis for their logistics.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true, margin: '-60px' }}
            className="flex gap-3 justify-center"
          >
            <button
              onClick={() => navigate('/login')}
              className="px-7 py-3.5 rounded-lg font-semibold text-sm transition-colors"
              style={{ backgroundColor: 'white', color: '#008086' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#befcfe'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-7 py-3.5 rounded-lg font-medium text-sm border text-white transition-colors"
              style={{ borderColor: 'rgba(255,255,255,0.4)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Talk to Sales
            </button>
          </motion.div>
        </div>
      </section>

      <footer className="py-10 px-6" style={{ backgroundColor: '#0d2b2c' }}>
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-sm" style={{ backgroundColor: '#16b6bb' }} />
            <span className="ml-2 font-semibold text-white">PolarAxis</span>
          </div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Cold chain control. Zero compromise.
          </div>
          <div className="text-xs" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255,255,255,0.3)' }}>
            © 2026 PolarAxis
          </div>
        </div>
      </footer>
    </div>
  );
}
