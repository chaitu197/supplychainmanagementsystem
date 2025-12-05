import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Analytics() {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('7');

    const handleLogout = () => navigate('/');

    // Generate KPI trend data
    const generateTrendData = (days) => {
        const data = [];
        for (let i = 0; i < days; i++) {
            data.push({
                day: `Day ${i + 1}`,
                onTimeDelivery: 90 + Math.random() * 8,
                forecastAccuracy: 85 + Math.random() * 10,
                stockoutRate: 2 + Math.random() * 3,
            });
        }
        return data;
    };

    const trendData = generateTrendData(parseInt(timeRange));

    const warehouseComparison = [
        { id: 'WH-01', utilization: 85, accuracy: 98.2, throughput: 1200 },
        { id: 'WH-02', utilization: 62, accuracy: 96.8, throughput: 800 },
        { id: 'WH-03', utilization: 91, accuracy: 99.1, throughput: 1500 },
    ];

    return (
        <div className="min-h-screen bg-void">
            <TopBar onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-5xl font-heading text-text-primary mb-2">
                        Executive Analytics
                    </h1>
                    <p className="text-text-tertiary">
                        Bird's-eye strategic view for decision makers
                    </p>
                </div>

                <Card padding="sm" className="mb-8">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setTimeRange('7')}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${timeRange === '7'
                                    ? 'bg-accent text-void'
                                    : 'bg-surface-alt text-text-secondary hover:bg-surface'
                                }`}
                        >
                            Last 7 days
                        </button>
                        <button
                            onClick={() => setTimeRange('30')}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${timeRange === '30'
                                    ? 'bg-accent text-void'
                                    : 'bg-surface-alt text-text-secondary hover:bg-surface'
                                }`}
                        >
                            Last 30 days
                        </button>
                        <button
                            onClick={() => setTimeRange('90')}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${timeRange === '90'
                                    ? 'bg-accent text-void'
                                    : 'bg-surface-alt text-text-secondary hover:bg-surface'
                                }`}
                        >
                            Last 90 days
                        </button>
                    </div>
                </Card>

                <Card padding="md" className="mb-8">
                    <h2 className="text-2xl font-heading text-text-primary mb-4">
                        Key Performance Indicators ({timeRange}-day trend)
                    </h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                                <XAxis
                                    dataKey="day"
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
                                <Line
                                    type="monotone"
                                    dataKey="onTimeDelivery"
                                    stroke="#48BB78"
                                    name="On-Time Delivery %"
                                    strokeWidth={2}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="forecastAccuracy"
                                    stroke="#4299E1"
                                    name="Forecast Accuracy %"
                                    strokeWidth={2}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="stockoutRate"
                                    stroke="#F56565"
                                    name="Stockout Rate %"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card padding="none">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-surface-alt border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase">Warehouse</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase">Utilization</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase">Accuracy</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase">Throughput</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {warehouseComparison.map((wh) => (
                                    <tr key={wh.id} className="hover:bg-surface-alt transition-colors">
                                        <td className="px-6 py-4"><span className="font-mono text-text-primary">{wh.id}</span></td>
                                        <td className="px-6 py-4"><span className="font-mono text-text-secondary">{wh.utilization}%</span></td>
                                        <td className="px-6 py-4"><span className="font-mono text-success">{wh.accuracy}%</span></td>
                                        <td className="px-6 py-4"><span className="font-mono text-text-secondary">{wh.throughput} units/day</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </main>
        </div>
    );
}
