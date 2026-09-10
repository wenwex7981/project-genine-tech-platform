import React, { useState, useEffect, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';
import { 
  Plane, Video, Globe as GlobeIcon, Cpu, 
  Crosshair, Shield, TrendingUp, Bitcoin, Activity, Zap, X
} from 'lucide-react';
import './App.css';

const FINANCE_HUBS = [
  { lat: 40.7128, lng: -74.0060, name: 'New York' },
  { lat: 51.5074, lng: -0.1278, name: 'London' },
  { lat: 35.6762, lng: 139.6503, name: 'Tokyo' },
  { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
  { lat: 47.3769, lng: 8.5417, name: 'Zurich' }
];

function App() {
  const globeRef = useRef();
  const [activeSector, setActiveSector] = useState('surveillance');
  const [activeTarget, setActiveTarget] = useState(null);
  const [logs, setLogs] = useState([]);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Data States
  const [militaryData, setMilitaryData] = useState({ points: [], events: [] });
  const [logisticsData, setLogisticsData] = useState({ points: [], flights: [] });
  const [financeData, setFinanceData] = useState({ arcs: [], trades: [] });
  const [cyberData, setCyberData] = useState({ arcs: [], anomalies: [] });

  // 1. Fetch USGS (Military/Disasters)
  useEffect(() => {
    const fetchUSGS = async () => {
      try {
        const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
        const data = await res.json();
        const events = data.features.slice(0, 50).map(f => ({
          id: f.id,
          title: f.properties.title,
          mag: f.properties.mag,
          lat: f.geometry.coordinates[1],
          lng: f.geometry.coordinates[0],
          size: f.properties.mag / 5,
          color: '#ff0055',
          media: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=600&q=80',
          details: { Location: f.properties.place, Status: 'CRITICAL EVENT' }
        }));
        setMilitaryData({ points: events, events: events.slice(0, 5) });
      } catch (e) {}
    };
    fetchUSGS();
    const interval = setInterval(fetchUSGS, 60000);
    return () => clearInterval(interval);
  }, []);

  // 2. Fetch OpenSky (Logistics)
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await fetch('https://opensky-network.org/api/states/all');
        if (!res.ok) return;
        const data = await res.json();
        const flightStates = data.states.filter(s => s[5] && s[6]).slice(0, 400);
        const points = flightStates.map(f => ({
          callsign: f[1]?.trim() || 'UNKNOWN',
          country: f[2],
          lng: f[5],
          lat: f[6],
          altitude: f[7] || 0,
          velocity: f[9] || 0,
          size: 0.2,
          color: '#00ffff',
          media: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80',
          details: { Origin: f[2], Altitude: `${Math.round(f[7] || 0)}m`, Velocity: `${Math.round(f[9] || 0)}m/s` }
        }));
        setLogisticsData({ points, flights: points.slice(0, 5) });
      } catch (e) {}
    };
    fetchFlights();
    const interval = setInterval(fetchFlights, 30000);
    return () => clearInterval(interval);
  }, []);

  // 3. Binance WebSocket (Finance)
  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
    ws.onmessage = (event) => {
      const trade = JSON.parse(event.data);
      const price = parseFloat(trade.p);
      const quantity = parseFloat(trade.q);
      
      if (quantity > 0.5) {
        const startHub = FINANCE_HUBS[Math.floor(Math.random() * FINANCE_HUBS.length)];
        const endHub = FINANCE_HUBS[Math.floor(Math.random() * FINANCE_HUBS.length)];
        const newArc = { startLat: startHub.lat, startLng: startHub.lng, endLat: endHub.lat, endLng: endHub.lng, color: 'rgba(163, 230, 53, 0.6)' };
        const newTradeLog = {
          id: trade.E,
          title: `Whale TX: ${quantity.toFixed(2)} BTC`,
          price: price.toFixed(2),
          qty: quantity.toFixed(4),
          media: 'https://images.unsplash.com/photo-1621504450181-5d356f61d307?w=600&q=80',
          details: { Exchange: 'Binance (Global)', Asset: 'BTC/USDT', Value: `$${(price*quantity).toLocaleString()}` }
        };

        setFinanceData(prev => ({
          arcs: [...prev.arcs.slice(-20), newArc],
          trades: [newTradeLog, ...prev.trades].slice(0, 5)
        }));
        setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text: `Whale TX: ${quantity.toFixed(2)} BTC @ $${price.toFixed(0)}` }].slice(-5));
      }
    };
    return () => ws.close();
  }, []);

  // 4. Wikimedia Recent Changes WebSocket (Proxy for Global Cyber Anomalies)
  useEffect(() => {
    const ws = new WebSocket('wss://stream.wikimedia.org/v2/stream/recentchange');
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'edit') {
          // Generate random global points to simulate rapid-fire cyber attacks
          const startLat = (Math.random() - 0.5) * 160;
          const startLng = (Math.random() - 0.5) * 360;
          const endLat = (Math.random() - 0.5) * 160;
          const endLng = (Math.random() - 0.5) * 360;
          
          const newArc = { startLat, startLng, endLat, endLng, color: 'rgba(255, 0, 255, 0.8)' };
          const anomaly = {
            id: data.id,
            title: `Intercept: Node ${data.server_name || 'Global'}`,
            user: data.user,
            media: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80',
            details: { Vector: 'Brute Force / DDoS', Target: data.server_url, Actor: data.user }
          };

          setCyberData(prev => ({
            arcs: [...prev.arcs.slice(-50), newArc],
            anomalies: [anomaly, ...prev.anomalies].slice(0, 5)
          }));
          
          // Only log 10% of them so log doesn't blur
          if (Math.random() > 0.9) {
            setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text: `Anomalous Payload intercepted from ${data.user}` }].slice(-5));
          }
        }
      } catch (e) {}
    };
    return () => ws.close();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
    }
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const globeData = useMemo(() => {
    switch(activeSector) {
      case 'military': return { points: militaryData.points, arcs: [], arcColor: '#ff0055' };
      case 'finance': return { points: FINANCE_HUBS.map(h => ({...h, size: 0.5, color: '#a3e635'})), arcs: financeData.arcs, arcColor: '#a3e635' };
      case 'logistics': return { points: logisticsData.points, arcs: [], arcColor: '#00ffff' };
      case 'cyber': return { points: [], arcs: cyberData.arcs, arcColor: '#ff00ff' };
      case 'surveillance': default: return { points: FINANCE_HUBS.map(h => ({...h, size: 0.3, color: '#ffffff'})), arcs: [], arcColor: '#ffffff' };
    }
  }, [activeSector, militaryData, financeData, logisticsData, cyberData]);

  const handleTargetClick = (target) => {
    setActiveTarget(target);
  };

  return (
    <div className="app-container">
      
      {/* 3D Globe */}
      <div className="globe-container">
        <Globe
          ref={globeRef}
          width={windowSize.width}
          height={windowSize.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          arcsData={globeData.arcs}
          arcColor="color"
          arcDashLength={0.4}
          arcDashGap={0.2}
          arcDashAnimateTime={activeSector === 'cyber' ? 500 : 1000}
          pointsData={globeData.points}
          pointColor="color"
          pointAltitude="size"
          pointRadius={0.5}
          pointsMerge={false}
          atmosphereColor={globeData.arcColor}
          atmosphereAltitude={0.2}
        />
      </div>

      {/* Target Modal Overlay */}
      {activeTarget && (
        <div className="target-modal-overlay" onClick={() => setActiveTarget(null)}>
          <div className="target-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><Crosshair size={20} color="var(--color-accent)"/> TARGET LOCK</h2>
              <button className="close-btn" onClick={() => setActiveTarget(null)}><X size={24} /></button>
            </div>
            <div className="modal-content">
              <div className="modal-media">
                <img src={activeTarget.media} alt="Target Feed" />
              </div>
              <div className="modal-details">
                <h3 style={{color: 'var(--color-text-main)', borderBottom: '1px solid var(--color-panel-border)', paddingBottom: '5px'}}>
                  {activeTarget.title}
                </h3>
                {Object.entries(activeTarget.details || {}).map(([key, val]) => (
                  <div className="detail-row" key={key}>
                    <span className="detail-label">{key}</span>
                    <span className="detail-value">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Left Sidebar Navigation */}
      <div className="sidebar">
        <GlobeIcon size={32} className="sidebar-logo" />
        <div className={`nav-item ${activeSector === 'surveillance' ? 'active' : ''}`} onClick={() => setActiveSector('surveillance')} title="Surveillance">
          <Video size={24} />
        </div>
        <div className={`nav-item ${activeSector === 'military' ? 'active' : ''}`} onClick={() => setActiveSector('military')} title="Military / Events">
          <Shield size={24} />
        </div>
        <div className={`nav-item ${activeSector === 'finance' ? 'active' : ''}`} onClick={() => setActiveSector('finance')} title="Global Markets">
          <TrendingUp size={24} />
        </div>
        <div className={`nav-item ${activeSector === 'logistics' ? 'active' : ''}`} onClick={() => setActiveSector('logistics')} title="Logistics (Aviation)">
          <Plane size={24} />
        </div>
        <div className={`nav-item ${activeSector === 'cyber' ? 'active' : ''}`} onClick={() => setActiveSector('cyber')} title="Cyber Security">
          <Zap size={24} />
        </div>
      </div>

      {/* Overlay UI Container */}
      <div className="ui-layer">
        
        {/* Header */}
        <div className="header ui-panel">
          <h1>
            A.E.G.I.S 
            <span style={{color: 'var(--color-text-main)', fontSize: '18px', opacity: 0.7}}>// {activeSector.toUpperCase()} SECTOR (LIVE)</span>
          </h1>
          <div className="header-stats glass-panel">
             <div className="stat-box">
                <div className="label">Threat Level</div>
                <div className={`value ${activeSector === 'military' || activeSector === 'cyber' ? 'alert' : ''}`}>
                  {activeSector === 'military' || activeSector === 'cyber' ? 'ELEVATED' : 'NOMINAL'}
                </div>
             </div>
          </div>
        </div>

        {/* Main Content Areas */}
        <div className="main-content">
          
          {/* LEFT PANEL */}
          <div className="side-panel left">
            
            {activeSector === 'military' && (
              <div className="module glass-panel ui-panel">
                <div className="module-header">
                  <Shield className="module-icon" style={{color: '#ff0055'}} size={20} />
                  <h2>Live USGS Seismic Events</h2>
                </div>
                <div className="module-content">
                  <ul className="data-list">
                    {militaryData.events.length === 0 && <li className="data-item"><span className="data-item-title">Fetching Live Data...</span></li>}
                    {militaryData.events.map((ev, i) => (
                      <li key={i} className="data-item border-military" onClick={() => handleTargetClick(ev)}>
                        <div className="data-item-info">
                          <span className="data-item-title">{ev.title}</span>
                          <span className="data-item-sub">Magnitude: {ev.mag}</span>
                        </div>
                        <span className="data-item-status status-military">ALERT</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeSector === 'finance' && (
              <div className="module glass-panel ui-panel">
                <div className="module-header">
                  <Bitcoin className="module-icon" style={{color: '#a3e635'}} size={20} />
                  <h2>Live Binance BTC/USDT</h2>
                </div>
                <div className="module-content">
                  <ul className="data-list">
                    {financeData.trades.length === 0 && <li className="data-item"><span className="data-item-title">Listening to WebSocket...</span></li>}
                    {financeData.trades.map((t, i) => (
                      <li key={i} className="data-item border-finance" onClick={() => handleTargetClick(t)}>
                        <div className="data-item-info">
                          <span className="data-item-title">{t.title}</span>
                          <span className="data-item-sub">Price: ${t.price}</span>
                        </div>
                        <span className="data-item-status status-finance">CONFIRMED</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeSector === 'logistics' && (
              <div className="module glass-panel ui-panel">
                <div className="module-header">
                  <Plane className="module-icon" style={{color: '#00ffff'}} size={20} />
                  <h2>Live OpenSky Aviation</h2>
                </div>
                <div className="module-content">
                  <ul className="data-list">
                    {logisticsData.flights.length === 0 && <li className="data-item"><span className="data-item-title">Fetching Live Radar...</span></li>}
                    {logisticsData.flights.map((f, i) => (
                      <li key={i} className="data-item border-logistics" onClick={() => handleTargetClick({
                        title: `Flight ${f.callsign}`,
                        media: f.media,
                        details: f.details
                      })}>
                        <div className="data-item-info">
                          <span className="data-item-title">Flight: {f.callsign}</span>
                          <span className="data-item-sub">Origin: {f.country}</span>
                        </div>
                        <span className="data-item-status status-logistics">TRACKING</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeSector === 'cyber' && (
              <div className="module glass-panel ui-panel">
                <div className="module-header">
                  <Zap className="module-icon" style={{color: '#ff00ff'}} size={20} />
                  <h2>Live Cyber Anomalies</h2>
                </div>
                <div className="module-content">
                  <ul className="data-list">
                    {cyberData.anomalies.length === 0 && <li className="data-item"><span className="data-item-title">Listening to Global Node...</span></li>}
                    {cyberData.anomalies.map((anom, i) => (
                      <li key={i} className="data-item border-cyber" onClick={() => handleTargetClick(anom)}>
                        <div className="data-item-info">
                          <span className="data-item-title">{anom.title}</span>
                          <span className="data-item-sub">Actor: {anom.user}</span>
                        </div>
                        <span className="data-item-status status-cyber">INTERCEPTED</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeSector === 'surveillance' && (
              <div className="module glass-panel ui-panel">
                <div className="module-header">
                  <Activity className="module-icon" size={20} />
                  <h2>Surveillance Systems</h2>
                </div>
                <div className="module-content" style={{padding: '10px'}}>
                  <p style={{fontSize: '12px', color: 'var(--color-text-dim)', marginBottom: '10px'}}>
                    Real-time global feeds activated. 
                  </p>
                  <ul className="data-list">
                    <li className="data-item" onClick={() => handleTargetClick({
                      title: 'Global Surveillance Node',
                      media: 'https://images.unsplash.com/photo-1557597774-9d273e957076?w=600&q=80',
                      details: { Status: 'Active', Encrypted: 'Yes' }
                    })}>
                      <div className="data-item-info">
                        <span className="data-item-title">Connection Established</span>
                        <span className="data-item-sub">Public REST / WebSockets Live</span>
                      </div>
                      <span className="data-item-status" style={{color: '#a3e635'}}>SECURE</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

          </div>

          {/* RIGHT PANEL - Real YouTube Live Embeds for Surveillance */}
          <div className="side-panel right">
            <div className="module glass-panel ui-panel">
              <div className="module-header">
                <Video className="module-icon" size={20} />
                <h2>Live Global CCTVs</h2>
              </div>
              <div className="module-content">
                 <div className="camera-grid" style={{gridTemplateColumns: '1fr', gap: '15px'}}>
                    <div className="camera-feed" style={{height: '120px', border: '1px solid var(--color-accent)'}}>
                       <iframe 
                         width="100%" height="100%" 
                         src="https://www.youtube.com/embed/HpdO5Kq3o7Y?autoplay=1&mute=1&controls=0" 
                         title="Tokyo Live" frameBorder="0" 
                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
                       </iframe>
                       <div className="camera-label" style={{background: 'rgba(0,255,255,0.2)'}}>TOKYO_SHIBUYA_LIVE</div>
                    </div>
                    <div className="camera-feed" style={{height: '120px', border: '1px solid var(--color-accent)'}}>
                       <iframe 
                         width="100%" height="100%" 
                         src="https://www.youtube.com/embed/1-iS7LArMPA?autoplay=1&mute=1&controls=0" 
                         title="Times Square Live" frameBorder="0" 
                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
                       </iframe>
                       <div className="camera-label" style={{background: 'rgba(0,255,255,0.2)'}}>NYC_TIMES_SQ_LIVE</div>
                    </div>
                 </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom AI Log */}
        <div className="ai-log-panel glass-panel ui-panel">
          <div className="module-header" style={{marginBottom: '5px', paddingBottom: '5px'}}>
            <Cpu className="module-icon" size={16} />
            <h2 style={{fontSize: '14px'}}>AI Core Analysis Matrix (Real Data Feed)</h2>
          </div>
          <div className="log-stream">
            {logs.length === 0 ? <div className="log-entry">Listening to live global data streams...</div> : null}
            {logs.map((log, i) => (
               <div className="log-entry" key={i}>
                  <span className="log-time">[{log.time}]</span>
                  <span className="log-text">{log.text}</span>
               </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
