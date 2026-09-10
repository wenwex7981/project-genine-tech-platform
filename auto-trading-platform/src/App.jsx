import React, { useEffect, useRef, useState } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';
import { Bot, Zap, Activity, TrendingUp } from 'lucide-react';
import './App.css';

function App() {
  const chartContainerRef = useRef();
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const predictionSeriesRef = useRef(null);

  const [currentPrice, setCurrentPrice] = useState(0);
  const [isPredicting, setIsPredicting] = useState(false);
  const [botLogs, setBotLogs] = useState([]);
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });

  // Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: { background: { color: '#131722' }, textColor: '#d1d4dc' },
      grid: { vertLines: { color: '#2a2e39' }, horzLines: { color: '#2a2e39' } },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderColor: '#2a2e39' },
      timeScale: { borderColor: '#2a2e39', timeVisible: true, secondsVisible: false },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#089981', downColor: '#f23645', borderVisible: false,
      wickUpColor: '#089981', wickDownColor: '#f23645',
    });

    const predSeries = chart.addLineSeries({
      color: '#2962ff', lineWidth: 2, lineStyle: 2,
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candleSeries;
    predictionSeriesRef.current = predSeries;

    // Fetch initial historical data
    fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=100')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(d => ({
          time: d[0] / 1000,
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4])
        }));
        candleSeries.setData(formatted);
      });

    const handleResize = () => {
      if(chartContainerRef.current) chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Binance WebSocket for Live Kline Data
  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const k = msg.k;
      const candle = {
        time: k.t / 1000,
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c)
      };
      
      setCurrentPrice(candle.close);
      if (candlestickSeriesRef.current) {
        candlestickSeriesRef.current.update(candle);
      }

      // Simulate Order Book randomly based on current price
      setOrderBook({
        asks: [...Array(10)].map((_, i) => ({ price: candle.close + (i*1.5), qty: (Math.random() * 2).toFixed(3) })).reverse(),
        bids: [...Array(10)].map((_, i) => ({ price: candle.close - (i*1.5), qty: (Math.random() * 2).toFixed(3) }))
      });
    };
    return () => ws.close();
  }, []);

  // Prediction & Auto-Trade Bot Simulation
  useEffect(() => {
    if (!isPredicting) {
      if (predictionSeriesRef.current) predictionSeriesRef.current.setData([]);
      return;
    }

    const botInterval = setInterval(() => {
      if (currentPrice === 0) return;
      
      // 1. Draw Prediction Line into the future
      const now = Math.floor(Date.now() / 1000);
      const predData = [{ time: now, value: currentPrice }];
      let lastVal = currentPrice;
      let isBullish = Math.random() > 0.4; // Slightly bullish bias
      
      for(let i=1; i<=15; i++) {
        lastVal = lastVal + (isBullish ? Math.random() * 15 : -Math.random() * 15);
        predData.push({ time: now + (i * 60), value: lastVal });
      }
      predictionSeriesRef.current.setData(predData);

      // 2. Execute Simulated Trade
      const tradeType = isBullish ? 'BUY' : 'SELL';
      const qty = (Math.random() * 0.5 + 0.1).toFixed(3);
      const profit = isBullish ? `+$${(Math.random()*50).toFixed(2)}` : `-$${(Math.random()*20).toFixed(2)}`;
      
      setBotLogs(prev => [{
        id: Math.random().toString(36).substr(2, 9),
        time: new Date().toLocaleTimeString(),
        type: tradeType,
        qty: qty,
        price: currentPrice.toFixed(2),
        profit: profit,
        reason: isBullish ? 'RSI Divergence / Bull Flag' : 'MACD Crossover / Resistance'
      }, ...prev].slice(0, 50));

    }, 5000); // Run bot cycle every 5 seconds

    return () => clearInterval(botInterval);
  }, [isPredicting, currentPrice]);

  return (
    <div className="trading-layout">
      
      {/* Top Header */}
      <div className="top-nav">
        <div className="brand">
          <Activity className="brand-icon" />
          NEXUS-AI TRADE TERMINAL
        </div>
        <div className="ticker-info">
          <div className="ticker-item">
            <span className="ticker-label">SYMBOL</span>
            <span className="ticker-value">BTC/USDT</span>
          </div>
          <div className="ticker-item">
            <span className="ticker-label">PRICE</span>
            <span className={`ticker-value mono ${currentPrice > 0 ? 'up' : ''}`}>
              ${currentPrice > 0 ? currentPrice.toFixed(2) : '---'}
            </span>
          </div>
          <button 
            className={`btn-predict ${isPredicting ? 'active' : ''}`}
            onClick={() => setIsPredicting(!isPredicting)}
          >
            {isPredicting ? <Zap size={16} /> : <Bot size={16} />}
            {isPredicting ? 'AI BOT ACTIVE' : 'START AUTO-TRADE'}
          </button>
        </div>
      </div>

      {/* Main Chart */}
      <div className="chart-container">
        <div className="chart-header">
          <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
            <h3 style={{fontSize:'14px'}}>Bitcoin / TetherUS</h3>
            <span style={{fontSize:'12px', color:'var(--text-dim)'}}>1m</span>
          </div>
          {isPredicting && <span style={{fontSize:'12px', color:'var(--accent-blue)', display:'flex', alignItems:'center', gap:'5px', animation:'pulse 2s infinite'}}><TrendingUp size={14}/> PREDICTING NEXT 15 CANDLES</span>}
        </div>
        <div className="chart-wrapper" ref={chartContainerRef} />
      </div>

      {/* Order Book Sidebar */}
      <div className="sidebar">
        <div className="panel-title">Order Book (Simulated)</div>
        <div className="order-book mono">
          <div className="book-header">
            <span>Price(USDT)</span>
            <span>Amount(BTC)</span>
            <span>Total</span>
          </div>
          <div className="book-list">
            {orderBook.asks.map((ask, i) => (
              <div className="book-row" key={'ask'+i}>
                <div className="depth-bar ask" style={{width: `${Math.random()*100}%`}}></div>
                <span className="price-ask">{ask.price.toFixed(2)}</span>
                <span>{ask.qty}</span>
                <span>{(ask.price * ask.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="spread-row price-bid">
            ${currentPrice > 0 ? currentPrice.toFixed(2) : '---'}
          </div>
          <div className="book-list">
            {orderBook.bids.map((bid, i) => (
              <div className="book-row" key={'bid'+i}>
                <div className="depth-bar bid" style={{width: `${Math.random()*100}%`}}></div>
                <span className="price-bid">{bid.price.toFixed(2)}</span>
                <span>{bid.qty}</span>
                <span>{(bid.price * bid.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Panel (Trade Logs) */}
      <div className="bot-panel">
        <div className="panel-title" style={{display:'flex', justifyContent:'space-between'}}>
          <span>Auto-Trade Paper Execution Log</span>
          <span style={{color: 'var(--text-dim)', fontSize:'11px'}}>MODE: PAPER TRADING (SAFE)</span>
        </div>
        <div className="bot-logs mono">
          <div className="log-entry" style={{color: 'var(--text-dim)', fontWeight:'600', borderBottom:'none'}}>
            <span>TIME</span>
            <span>TYPE</span>
            <span>PRICE</span>
            <span>AI REASONING</span>
            <span style={{textAlign:'right'}}>PROFIT/LOSS</span>
          </div>
          {botLogs.length === 0 && <div style={{padding:'20px', textAlign:'center', color:'var(--text-dim)'}}>AI Bot Offline. Click "Start Auto-Trade" to begin paper trading.</div>}
          {botLogs.map(log => (
            <div className="log-entry" key={log.id}>
              <span className="log-time">{log.time}</span>
              <span className={`badge ${log.type}`}>{log.type} {log.qty}</span>
              <span>${log.price}</span>
              <span style={{color:'var(--accent-blue)'}}>{log.reason}</span>
              <span className={`log-profit ${log.profit.includes('+') ? 'up' : 'down'}`}>{log.profit}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default App;
