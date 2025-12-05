import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useRouteOptimization } from '../hooks/useAPI';

export default function Logistics() {
    const navigate = useNavigate();
    const [optimizing, setOptimizing] = useState(false);
    const [optimized, setOptimized] = useState(false);

    // Sample orders for route optimization
    const sampleOrders = [
        { order_id: '8821', address: '123 Main St', priority: 'high' },
        { order_id: '8822', address: '456 Oak Ave', priority: 'medium' },
        { order_id: '8823', address: '789 Elm Rd', priority: 'low' }
    ];

    const { data: routeDataRaw, loading, refetch } = useRouteOptimization(sampleOrders);

    // Transform backend response to match frontend expectations
    const routeData = routeDataRaw ? {
        route: routeDataRaw.stops?.map(stop => ({
            orderId: stop.orderId,
            address: stop.address,
            eta: stop.eta
        })),
        totalDistance: routeDataRaw.totalDistanceKm,
        totalTime: `${Math.floor(routeDataRaw.totalTimeMinutes / 60)}h ${Math.floor(routeDataRaw.totalTimeMinutes % 60)}m`,
        fuelSavings: `${routeDataRaw.optimizationScore || 90}%`
    } : null;

    const handleLogout = () => navigate('/');

    const handleOptimizeRoute = async () => {
        setOptimizing(true);
        await refetch();
        setTimeout(() => {
            setOptimizing(false);
            setOptimized(true);
        }, 1500);
    };

    if (loading && !optimized) return <LoadingSkeleton variant="page" />;

    return (
        <div className="min-h-screen bg-void">
            <TopBar onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-5xl font-heading text-text-primary mb-2">
                        Logistics & Route Optimization
                    </h1>
                    <p className="text-text-tertiary">
                        AI-powered delivery route planning
                    </p>
                </div>

                {/* Shipment Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card padding="md">
                        <p className="text-sm text-text-tertiary mb-1">In Transit</p>
                        <p className="text-3xl font-mono text-accent">12</p>
                    </Card>
                    <Card padding="md">
                        <p className="text-sm text-text-tertiary mb-1">Out for Delivery</p>
                        <p className="text-3xl font-mono text-info">8</p>
                    </Card>
                    <Card padding="md">
                        <p className="text-sm text-text-tertiary mb-1">Delivered Today</p>
                        <p className="text-3xl font-mono text-success">24</p>
                    </Card>
                </div>

                {/* Route Optimization */}
                <Card padding="md" className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-heading text-text-primary">
                            Route Optimization
                        </h2>
                        <Button
                            onClick={handleOptimizeRoute}
                            disabled={optimizing}
                            variant="primary"
                        >
                            {optimizing ? 'Optimizing...' : optimized ? '✓ Optimized' : 'Optimize Route'}
                        </Button>
                    </div>

                    {optimized ? (
                        <>
                            <div className="space-y-4 mb-6">
                                {routeData?.route?.map((stop, index) => (
                                    <div
                                        key={stop.orderId}
                                        className="flex items-center gap-4 p-4 bg-surface-alt rounded-lg border border-border hover:border-accent transition-colors"
                                    >
                                        <div className="flex-shrink-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-void font-bold">
                                            {index + 1}
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-text-primary font-medium">
                                                Order {stop.orderId}
                                            </p>
                                            <p className="text-sm text-text-tertiary">
                                                {stop.address}
                                            </p>
                                        </div>
                                        <Badge variant="info">ETA {stop.eta}</Badge>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-6 pt-4 border-t border-border">
                                <div>
                                    <p className="text-sm text-text-tertiary">Total Distance</p>
                                    <p className="text-lg font-mono text-text-primary">
                                        {routeData?.totalDistance} km
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-text-tertiary">Total Time</p>
                                    <p className="text-lg font-mono text-text-primary">
                                        {routeData?.totalTime}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-text-tertiary">Fuel Savings</p>
                                    <p className="text-lg font-mono text-success">
                                        {routeData?.fuelSavings || '12%'}
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-text-tertiary text-lg mb-4">
                                Click "Optimize Route" to generate the most efficient delivery sequence
                            </p>
                            <p className="text-text-tertiary text-sm">
                                Our AI will analyze traffic patterns, delivery windows, and vehicle capacity
                            </p>
                        </div>
                    )}
                </Card>

                {/* Active Deliveries */}
                <div>
                    <h2 className="text-2xl font-heading text-text-primary mb-4">
                        Active Deliveries
                    </h2>
                    <Card padding="none">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-surface-alt border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                            Destination
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                            ETA
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {routeData?.route?.map((delivery) => (
                                        <tr key={delivery.orderId} className="hover:bg-surface-alt transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-mono text-text-primary">
                                                    #{delivery.orderId}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-text-secondary">
                                                    {delivery.address}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant="info">In Transit</Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-text-secondary">
                                                    {delivery.eta}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}
