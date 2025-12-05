import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useForecastDemand } from '../hooks/useAPI';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function Forecasting() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        product_id: 'SKU-1001',  // Changed to snake_case for backend
        warehouse_id: 'WH-01',   // Changed to snake_case for backend
        horizon_days: 30,        // Changed to snake_case for backend
    });

    const [forecastGenerated, setForecastGenerated] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const { data: forecastRaw, loading, error, refetch } = useForecastDemand(filters);

    // Transform backend response to match chart expectations
    const forecast = forecastRaw ? {
        ...forecastRaw,
        series: forecastRaw.series?.map(item => ({
            date: item.date,
            demand: item.predicted,      // Map 'predicted' to 'demand'
            lowerBound: item.lower,      // Map 'lower' to 'lowerBound'
            upperBound: item.upper,      // Map 'upper' to 'upperBound'
        }))
    } : null;

    const handleLogout = () => navigate('/');

    const handleGenerateForecast = async () => {
        setIsGenerating(true);
        await refetch();
        setTimeout(() => {
            setIsGenerating(false);
            setForecastGenerated(true);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-void">
            <TopBar onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-5xl font-heading text-text-primary mb-2">
                        AI Demand Forecasting
                    </h1>
                    <p className="text-text-tertiary">
                        Predictive intelligence for inventory planning
                    </p>
                </div>

                {/* Filters */}
                <Card padding="sm" className="mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <select
                            value={filters.product_id}
                            onChange={(e) => setFilters({ ...filters, product_id: e.target.value })}
                            className="px-4 py-2 bg-surface-alt border border-border rounded-md 
                       text-text-primary focus:ring-2 focus:ring-accent"
                        >
                            <option value="SKU-1001">Product SKU-1001</option>
                            <option value="SKU-1002">Product SKU-1002</option>
                            <option value="SKU-1003">Product SKU-1003</option>
                        </select>

                        <select
                            value={filters.warehouse_id}
                            onChange={(e) => setFilters({ ...filters, warehouse_id: e.target.value })}
                            className="px-4 py-2 bg-surface-alt border border-border rounded-md 
                       text-text-primary focus:ring-2 focus:ring-accent"
                        >
                            <option value="WH-01">Warehouse 01</option>
                            <option value="WH-02">Warehouse 02</option>
                            <option value="WH-03">Warehouse 03</option>
                        </select>

                        <select
                            value={filters.horizon_days}
                            onChange={(e) => setFilters({ ...filters, horizon_days: parseInt(e.target.value) })}
                            className="px-4 py-2 bg-surface-alt border border-border rounded-md 
                       text-text-primary focus:ring-2 focus:ring-accent"
                        >
                            <option value={7}>7 days</option>
                            <option value={30}>30 days</option>
                            <option value={90}>90 days</option>
                        </select>

                        <Button onClick={handleGenerateForecast} disabled={isGenerating}>
                            {isGenerating ? 'Generating...' : 'Generate Forecast'}
                        </Button>
                    </div>
                </Card>

                {/* Chart */}
                {isGenerating ? (
                    <LoadingSkeleton variant="chart" />
                ) : error ? (
                    <Card status="danger" padding="lg">
                        <p className="text-text-primary">Error: {error.message}</p>
                    </Card>
                ) : forecastGenerated && forecast?.series ? (
                    <>
                        <Card padding="md" className="mb-8">
                            <h2 className="text-2xl font-heading text-text-primary mb-4">
                                Forecast Chart
                            </h2>
                            <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={forecast.series}>
                                        <defs>
                                            <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#FF8C42" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#FF8C42" stopOpacity={0} />
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
                                            dataKey="upperBound"
                                            stroke="#FF6B6B"
                                            fill="rgba(255, 107, 107, 0.1)"
                                            strokeDasharray="5 5"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="demand"
                                            stroke="#FF8C42"
                                            fillOpacity={1}
                                            fill="url(#colorDemand)"
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="lowerBound"
                                            stroke="#FF6B6B"
                                            fill="rgba(255, 107, 107, 0.1)"
                                            strokeDasharray="5 5"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* AI Insights */}
                        <Card padding="md" status="info">
                            <h2 className="text-2xl font-heading text-text-primary mb-4">
                                AI Insights
                            </h2>
                            <div className="space-y-2">
                                {forecast?.insights?.map((insight, index) => (
                                    <div key={index} className="flex items-start gap-2">
                                        <span className="text-accent mt-1">•</span>
                                        <p className="text-text-secondary">{insight}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-border">
                                <p className="text-sm text-text-tertiary">
                                    Confidence Level: <span className="text-success font-mono">{(forecast?.confidence * 100).toFixed(0)}%</span>
                                </p>
                            </div>
                        </Card>
                    </>
                ) : (
                    <Card padding="lg" className="text-center">
                        <p className="text-text-tertiary text-lg">
                            Click "Generate Forecast" to see AI-powered demand predictions
                        </p>
                    </Card>
                )}
            </main>
        </div>
    );
}
