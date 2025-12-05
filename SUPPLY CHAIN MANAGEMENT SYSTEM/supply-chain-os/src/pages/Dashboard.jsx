import { useEffect } from 'react';
import TopBar from '../components/TopBar';
import MetricCard from '../components/MetricCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Card from '../components/Card';
import { useDashboardMetrics } from '../hooks/useAPI';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function Dashboard() {
    const { data: metrics, loading, error } = useDashboardMetrics();
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-void">
                <TopBar onLogout={handleLogout} />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-5xl font-heading text-text-primary mb-2">
                            Dashboard Overview
                        </h1>
                        <p className="text-text-tertiary">
                            Real-time supply chain health metrics
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <LoadingSkeleton variant="card" count={4} />
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-void">
                <TopBar onLogout={handleLogout} />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Card status="danger" padding="lg">
                        <p className="text-text-primary">Error loading dashboard: {error.message}</p>
                    </Card>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-void">
            <TopBar onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-5xl font-heading text-text-primary mb-2">
                        Dashboard Overview
                    </h1>
                    <p className="text-text-tertiary">
                        Real-time supply chain health metrics
                    </p>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
                    <MetricCard
                        label="On-Time Delivery"
                        value={`${metrics.kpis.onTimeDelivery.value}%`}
                        trend={metrics.kpis.onTimeDelivery.trend}
                        status="success"
                    />
                    <MetricCard
                        label="Stockout Events"
                        value={metrics.kpis.stockoutEvents.value}
                        trend={metrics.kpis.stockoutEvents.trend}
                        status="success"
                    />
                    <MetricCard
                        label="Forecast Accuracy"
                        value={`${metrics.kpis.forecastAccuracy.value}%`}
                        trend={metrics.kpis.forecastAccuracy.trend}
                        status="info"
                    />
                    <MetricCard
                        label="Open POs"
                        value={metrics.kpis.openPOs.value}
                        trend={metrics.kpis.openPOs.trend}
                        status="warning"
                    />
                </div>

                {/* Charts & Summaries */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <Card padding="md">
                            <h2 className="text-2xl font-heading text-text-primary mb-4">
                                Demand vs Capacity (30-day trend)
                            </h2>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={metrics.demandData}>
                                        <defs>
                                            <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#FF8C42" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#FF8C42" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorCapacity" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4299E1" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#4299E1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                                        <XAxis
                                            dataKey="date"
                                            stroke="#A0AEC0"
                                            tick={{ fill: '#A0AEC0' }}
                                        />
                                        <YAxis
                                            stroke="#A0AEC0"
                                            tick={{ fill: '#A0AEC0' }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1A202C',
                                                border: '1px solid #2D3748',
                                                borderRadius: '8px'
                                            }}
                                            labelStyle={{ color: '#E2E8F0' }}
                                        />
                                        <Legend wrapperStyle={{ color: '#A0AEC0' }} />
                                        <Area
                                            type="monotone"
                                            dataKey="demand"
                                            stroke="#FF8C42"
                                            fillOpacity={1}
                                            fill="url(#colorDemand)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="capacity"
                                            stroke="#4299E1"
                                            fillOpacity={1}
                                            fill="url(#colorCapacity)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                    <div>
                        <Card padding="md">
                            <h2 className="text-2xl font-heading text-text-primary mb-4">
                                Active Shipments
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-text-secondary">In Transit</span>
                                    <span className="text-data-md font-mono text-text-primary">
                                        {metrics.shipmentData.inTransit}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-text-secondary">Dispatched</span>
                                    <span className="text-data-md font-mono text-text-primary">
                                        {metrics.shipmentData.dispatched}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-text-secondary">Delivered</span>
                                    <span className="text-data-md font-mono text-success">
                                        {metrics.shipmentData.delivered}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-text-secondary">Delayed</span>
                                    <span className="text-data-md font-mono text-danger">
                                        {metrics.shipmentData.delayed}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Activity Feed */}
                <Card padding="md">
                    <h2 className="text-2xl font-heading text-text-primary mb-4">
                        Recent Activity
                    </h2>
                    <div className="space-y-3">
                        {metrics.recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-md hover:bg-surface-alt transition-colors">
                                <div className="w-2 h-2 mt-2 rounded-full bg-accent"></div>
                                <div className="flex-1">
                                    <p className="text-text-primary">{activity.message}</p>
                                    <p className="text-xs text-text-tertiary mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </main>
        </div>
    );
}
