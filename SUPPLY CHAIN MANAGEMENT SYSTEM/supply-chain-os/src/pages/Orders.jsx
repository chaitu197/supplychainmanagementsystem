import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useOrders } from '../hooks/useAPI';

export default function Orders() {
    const navigate = useNavigate();
    const [selectedOrder, setSelectedOrder] = useState(null);

    const { data: orders, loading } = useOrders();

    const handleLogout = () => navigate('/');

    const getStatusBadge = (status) => {
        const variants = {
            'In Transit': 'info',
            'Picked': 'warning',
            'Delivered': 'success',
            'Processing': 'default'
        };
        return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
    };

    if (loading) return <LoadingSkeleton variant="page" />;

    return (
        <div className="min-h-screen bg-void">
            <TopBar onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-5xl font-heading text-text-primary mb-2">
                        Order Fulfillment Timeline
                    </h1>
                    <p className="text-text-tertiary">
                        Track orders from creation to delivery
                    </p>
                </div>

                {/* Orders Table */}
                <Card padding="none">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-surface-alt border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                        Customer
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
                                {orders?.map((order) => (
                                    <tr
                                        key={order.id}
                                        onClick={() => setSelectedOrder(order)}
                                        className="hover:bg-surface-alt cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-mono text-text-primary">
                                                #{order.id}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-text-secondary">
                                                {order.customer}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-text-secondary">
                                                {order.eta}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </main>

            {/* Order Details Modal */}
            <Modal
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                title={`Order Details - #${selectedOrder?.id}`}
            >
                {selectedOrder && (
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <div>
                            <h3 className="text-lg font-heading text-text-primary mb-3">
                                Customer Information
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-text-tertiary">Customer:</span>
                                    <span className="text-text-primary">{selectedOrder.customer}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-tertiary">Order ID:</span>
                                    <span className="text-text-primary font-mono">#{selectedOrder.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-tertiary">Status:</span>
                                    {getStatusBadge(selectedOrder.status)}
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-tertiary">ETA:</span>
                                    <span className="text-text-primary">{selectedOrder.eta}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div>
                            <h3 className="text-lg font-heading text-text-primary mb-3">
                                Order Items
                            </h3>
                            <div className="space-y-3">
                                {selectedOrder.items?.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-surface-alt rounded-lg">
                                        <div>
                                            <p className="text-text-primary">{item.product}</p>
                                            <p className="text-sm text-text-tertiary">SKU: {item.sku}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-text-primary">Qty: {item.quantity}</p>
                                            <p className="text-sm text-text-tertiary">${item.price}</p>
                                        </div>
                                    </div>
                                )) || (
                                        <div className="p-4 bg-surface-alt rounded-lg">
                                            <p className="text-text-primary">Widget Pro</p>
                                            <p className="text-sm text-text-tertiary">SKU: SKU-1001</p>
                                            <p className="text-sm text-text-secondary mt-2">Quantity: 50 units</p>
                                        </div>
                                    )}
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div>
                            <h3 className="text-lg font-heading text-text-primary mb-3">
                                Shipping Information
                            </h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-text-tertiary">Warehouse:</span>
                                    <span className="text-text-primary">{selectedOrder.warehouse || 'Warehouse 01'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-tertiary">Carrier:</span>
                                    <span className="text-text-primary">{selectedOrder.carrier || 'Express Logistics'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-tertiary">Tracking:</span>
                                    <span className="text-text-primary font-mono">{selectedOrder.tracking || 'TRK-' + selectedOrder.id}</span>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div>
                            <h3 className="text-lg font-heading text-text-primary mb-3">
                                Order Timeline
                            </h3>
                            <div className="space-y-3">
                                {selectedOrder.timeline?.map((event, index) => (
                                    <div key={index} className="flex gap-3">
                                        <div className="flex-shrink-0 w-2 h-2 mt-2 bg-accent rounded-full"></div>
                                        <div>
                                            <p className="text-text-primary">{event.status}</p>
                                            <p className="text-sm text-text-tertiary">{event.timestamp}</p>
                                        </div>
                                    </div>
                                )) || (
                                        <>
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0 w-2 h-2 mt-2 bg-accent rounded-full"></div>
                                                <div>
                                                    <p className="text-text-primary">Order Placed</p>
                                                    <p className="text-sm text-text-tertiary">Dec 5, 9:00 AM</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0 w-2 h-2 mt-2 bg-accent rounded-full"></div>
                                                <div>
                                                    <p className="text-text-primary">Processing</p>
                                                    <p className="text-sm text-text-tertiary">Dec 5, 10:30 AM</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="flex-shrink-0 w-2 h-2 mt-2 bg-info rounded-full"></div>
                                                <div>
                                                    <p className="text-text-primary">{selectedOrder.status}</p>
                                                    <p className="text-sm text-text-tertiary">Current</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
