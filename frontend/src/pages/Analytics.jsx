import React, { useState, useEffect, useMemo } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function Analytics() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const [historyLogs, setHistoryLogs] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/history/${user.id}`)
        .then(res => res.json())
        .then(data => {
          // Map backend format to frontend format expected by Analytics component
          const mappedLogs = data.map(item => ({
            id: item.id.toString(),
            date: item.timestamp + "Z", 
            type: item.modality.charAt(0).toUpperCase() + item.modality.slice(1),
            preview: item.content_snippet,
            score: Math.round(item.confidence)
          }));
          setHistoryLogs(mappedLogs);
        })
        .catch(err => console.error("Failed to fetch history:", err));
    }
  }, [user]);

  const stats = useMemo(() => {
    if (!historyLogs.length) return { total: 0, aiPercent: 0, modData: [], timeData: [] };
    
    const total = historyLogs.length;
    const aiCount = historyLogs.filter(l => l.score >= 50).length;
    const aiPercent = Math.round((aiCount / total) * 100);

    // Modality Data
    const modCounts = { Text: 0, Image: 0, Audio: 0, Video: 0 };
    historyLogs.forEach(l => {
      if (modCounts[l.type] !== undefined) modCounts[l.type]++;
    });
    const modData = Object.keys(modCounts)
      .filter(k => modCounts[k] > 0)
      .map(k => ({ name: k, value: modCounts[k] }));

    // Time Data (Last 15 scans)
    const timeData = historyLogs.slice(0, 15).reverse().map((l, i) => ({
      name: `${i + 1}`,
      score: l.score,
      type: l.type
    }));

    // If there's only one data point, duplicate it so the area chart renders a line instead of a single dot
    if (timeData.length === 1) {
       timeData.unshift({ ...timeData[0], name: '0' });
    }

    return { total, aiPercent, modData, timeData };
  }, [historyLogs]);

  // Premium, sleek palette
  const COLORS = ['#818cf8', '#a78bfa', '#34d399', '#fbbf24'];

  if (isSignedIn === false) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-on-background font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-white/5 flex flex-col fixed h-full z-10 hidden md:flex">
        <div className="p-6">
          <Link to="/" className="font-bold text-2xl text-primary flex items-center gap-2 tracking-tight">
            <span className="material-symbols-outlined text-[28px] text-primary">troubleshoot</span>
            DetectAi
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/dashboard" className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 font-medium rounded-xl transition-all">
            <span className="material-symbols-outlined">dashboard</span>
            Workspace
          </Link>
          <Link to="/dashboard/history" className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 font-medium rounded-xl transition-all">
            <span className="material-symbols-outlined">history</span>
            History
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary font-medium rounded-xl transition-all">
            <span className="material-symbols-outlined">analytics</span>
            Analytics
          </button>
          <Link to="/dashboard/settings" className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-white/5 font-medium rounded-xl transition-all">
            <span className="material-symbols-outlined">settings</span>
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 relative xl:px-12 xl:py-10">
        <header className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-3xl font-semibold text-on-surface tracking-tight mb-1">Analytics</h1>
            <p className="text-on-surface-variant text-sm font-medium">Workspace performance & detection trends</p>
          </div>
          
          {stats.total > 0 && (
            <div className="flex items-center gap-6 text-sm bg-white/[0.02] border border-white/5 px-6 py-3 rounded-full">
              <div className="flex items-center gap-2">
                <span className="text-on-surface-variant">Total Scans</span>
                <span className="font-semibold text-on-surface">{stats.total}</span>
              </div>
              <div className="w-px h-4 bg-white/10"></div>
              <div className="flex items-center gap-2">
                <span className="text-on-surface-variant">Avg AI Confidence</span>
                <span className="font-semibold text-on-surface">{stats.aiPercent}%</span>
              </div>
              <div className="w-px h-4 bg-white/10"></div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                </span>
                <span className="font-medium text-on-surface">Operational</span>
              </div>
            </div>
          )}
        </header>

        {stats.total > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 bg-white/[0.02] border border-white/10 rounded-2xl p-8 transition-colors hover:bg-white/[0.04]">
              <h4 className="text-base font-semibold text-on-surface mb-8">Modality Distribution</h4>
              <div className="h-56 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={stats.modData} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={70} 
                      outerRadius={80} 
                      paddingAngle={4} 
                      dataKey="value"
                      stroke="none"
                      cornerRadius={8}
                    >
                      {stats.modData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', fontSize: '12px' }} 
                      itemStyle={{ color: '#eee' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text in pie chart */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-semibold text-on-surface">{stats.total}</span>
                  <span className="text-xs font-medium text-on-surface-variant mt-1">Total</span>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-5 mt-6">
                {stats.modData.map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-2 text-sm font-medium text-on-surface-variant">
                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[idx % COLORS.length]}}></div>
                    {entry.name}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-2 bg-white/[0.02] border border-white/10 rounded-2xl p-8 transition-colors hover:bg-white/[0.04]">
              <h4 className="text-base font-semibold text-on-surface mb-8 flex justify-between items-center">
                Detection Trends
                <span className="text-xs text-on-surface-variant font-medium border border-white/10 px-2 py-1 rounded-md bg-black/20">Last {Math.min(15, stats.total)} scans</span>
              </h4>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.timeData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#ffffff30" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{fill: '#ffffff40'}}
                      dy={10}
                      tickFormatter={() => ''}
                    />
                    <YAxis 
                      stroke="#ffffff30" 
                      fontSize={11} 
                      tickLine={false} 
                      axisLine={false}
                      tick={{fill: '#ffffff40'}}
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', fontSize: '13px' }} 
                      itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                      labelStyle={{ color: '#aaa', marginBottom: '4px', fontSize: '11px' }}
                      formatter={(value) => [`${value}%`, 'AI Likelihood']}
                      labelFormatter={(label) => `Scan History`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#818cf8" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorScore)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center min-h-[300px]">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-4">monitoring</span>
            <p className="text-on-surface font-medium mb-1">No scan data available</p>
            <p className="text-sm text-on-surface-variant">Run a scan in the Workspace to populate your analytics charts.</p>
          </div>
        )}
      </main>
    </div>
  );
}
