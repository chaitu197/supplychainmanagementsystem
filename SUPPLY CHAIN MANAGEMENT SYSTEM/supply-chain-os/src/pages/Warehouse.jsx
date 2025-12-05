import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import MetricCard from '../components/MetricCard';

export default function Warehouse() {
    const navigate = useNavigate();
    const handleLogout = () => navigate('/');

    const warehouses = [
        { id: 'WH-01', name: 'Warehouse 01', utilization: 85, status: 'active' },
        { id: 'WH-02', name: 'Warehouse 02', utilization: 62, status: 'active' },
        { id: 'WH-03', name: 'Warehouse 03', utilization: 91, status: 'active' },
    ];

    return (
        <div className="min-h-screen bg-void">
            <TopBar onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-5xl font-heading text-text-primary mb-2">
                        Warehouse Operations
                    </h1>
                    <p className="text-text-tertiary">
                        Physical inventory management and optimized picking
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {warehouses.map((wh) => (
                        <MetricCard
                            key={wh.id}
                            label={wh.name}
                            value={`${wh.utilization}%`}
                            status={wh.utilization > 90 ? 'warning' : 'success'}
                        />
                    ))}
                </div>

                <Card padding="md">
                    <h2 className="text-2xl font-heading text-text-primary mb-4">
                        Optimized Picking List (Batch #4521)
                    </h2>
                    <div className="space-y-3">
                        <div className="flex items-center gap-4 p-3 bg-surface-alt rounded-md">
                            <span className="text-accent font-mono">1.</span>
                            <span className="text-text-secondary">A12 → SKU-1001 (Qty: 5)</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-surface-alt rounded-md">
                            <span className="text-accent font-mono">2.</span>
                            <span className="text-text-secondary">A15 → SKU-1002 (Qty: 3)</span>
                        </div>
                        <div className="flex items-center gap-4 p-3 bg-surface-alt rounded-md">
                            <span className="text-accent font-mono">3.</span>
                            <span className="text-text-secondary">B08 → SKU-2001 (Qty: 2)</span>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex gap-6">
                        <p className="text-sm text-text-tertiary">
                            Total Distance: <span className="text-text-primary font-mono">120m</span>
                        </p>
                        <p className="text-sm text-text-tertiary">
                            Est. Time: <span className="text-text-primary font-mono">8 min</span>
                        </p>
                    </div>
                </Card>
            </main>
        </div>
    );
}
