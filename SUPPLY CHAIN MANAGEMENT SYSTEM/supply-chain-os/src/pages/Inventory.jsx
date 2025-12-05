import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import Badge from '../components/Badge';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useInventory, useReorderSuggestions } from '../hooks/useAPI';

export default function Inventory() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [warehouseFilter, setWarehouseFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortBy, setSortBy] = useState('sku');
    const [sortOrder, setSortOrder] = useState('asc');

    const { data: inventory, loading } = useInventory();
    const { data: reorderSuggestions } = useReorderSuggestions();

    const handleLogout = () => navigate('/');

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    // Filter and sort inventory
    const filteredInventory = inventory?.filter(item => {
        const matchesSearch = searchTerm === '' ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.product.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesWarehouse = warehouseFilter === 'All' || item.warehouse === warehouseFilter;
        const matchesStatus = statusFilter === 'All' || item.status === statusFilter;

        return matchesSearch && matchesWarehouse && matchesStatus;
    }).sort((a, b) => {
        let aVal, bVal;

        switch (sortBy) {
            case 'sku':
                aVal = a.sku;
                bVal = b.sku;
                break;
            case 'product':
                aVal = a.product;
                bVal = b.product;
                break;
            case 'warehouse':
                aVal = a.warehouse;
                bVal = b.warehouse;
                break;
            case 'stock':
                aVal = a.quantity || a.stock || 0;
                bVal = b.quantity || b.stock || 0;
                return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
            default:
                return 0;
        }

        if (sortOrder === 'asc') {
            return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        } else {
            return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
        }
    });

    const getStatusBadge = (status) => {
        // Normalize status to lowercase for comparison
        const normalizedStatus = status?.toLowerCase();
        const variants = {
            'healthy': 'success',
            'low': 'warning',
            'low stock': 'warning',
            'critical': 'danger',
            'overstock': 'info'
        };
        const variant = variants[normalizedStatus] || 'default';
        // Capitalize first letter for display
        const displayStatus = status?.charAt(0).toUpperCase() + status?.slice(1);
        return <Badge variant={variant}>{displayStatus}</Badge>;
    };

    if (loading) return <LoadingSkeleton variant="page" />;

    return (
        <div className="min-h-screen bg-void">
            <TopBar onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-5xl font-heading text-text-primary mb-2">
                        Inventory & Reorder Intelligence
                    </h1>
                    <p className="text-text-tertiary">
                        Real-time stock levels and intelligent reorder recommendations
                    </p>
                </div>

                {/* AI Reorder Suggestions */}
                <div className="mb-8">
                    <h2 className="text-2xl font-heading text-text-primary mb-4">
                        AI Reorder Suggestions
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {reorderSuggestions?.map((suggestion) => (
                            <Card key={suggestion.id} padding="md" status="warning">
                                <h3 className="text-lg font-heading text-text-primary mb-2">
                                    {suggestion.product}
                                </h3>
                                <p className="text-sm text-text-tertiary mb-3">SKU: {suggestion.sku}</p>
                                <div className="space-y-2">
                                    <p className="text-text-secondary">
                                        <span className="text-text-tertiary">Suggested Qty:</span>{' '}
                                        <span className="font-mono">{suggestion.suggestedQty} units</span>
                                    </p>
                                    <p className="text-text-secondary">
                                        <span className="text-text-tertiary">Reason:</span> {suggestion.reason}
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Filters */}
                <Card padding="sm" className="mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select
                            value={warehouseFilter}
                            onChange={(e) => setWarehouseFilter(e.target.value)}
                            className="px-4 py-2 bg-surface-alt border border-border rounded-md 
                       text-text-primary focus:ring-2 focus:ring-accent"
                        >
                            <option value="All">All Warehouses</option>
                            <option value="Warehouse 01">Warehouse 01</option>
                            <option value="Warehouse 02">Warehouse 02</option>
                            <option value="Warehouse 03">Warehouse 03</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-surface-alt border border-border rounded-md 
                       text-text-primary focus:ring-2 focus:ring-accent"
                        >
                            <option value="All">All Status</option>
                            <option value="Healthy">Healthy</option>
                            <option value="Low Stock">Low Stock</option>
                            <option value="Critical">Critical</option>
                            <option value="Overstock">Overstock</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Search SKU or product..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="px-4 py-2 bg-surface-alt border border-accent rounded-md 
                       text-text-primary placeholder-text-tertiary focus:ring-2 focus:ring-accent"
                        />
                    </div>
                </Card>

                {/* Inventory Table */}
                <Card padding="none">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-surface-alt border-b border-border">
                                <tr>
                                    <th
                                        className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:text-text-primary transition-colors"
                                        onClick={() => handleSort('sku')}
                                    >
                                        <div className="flex items-center gap-2">
                                            SKU
                                            {sortBy === 'sku' && (
                                                <span className="text-accent">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:text-text-primary transition-colors"
                                        onClick={() => handleSort('product')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Product
                                            {sortBy === 'product' && (
                                                <span className="text-accent">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:text-text-primary transition-colors"
                                        onClick={() => handleSort('warehouse')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Warehouse
                                            {sortBy === 'warehouse' && (
                                                <span className="text-accent">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:text-text-primary transition-colors"
                                        onClick={() => handleSort('stock')}
                                    >
                                        <div className="flex items-center gap-2">
                                            Stock
                                            {sortBy === 'stock' && (
                                                <span className="text-accent">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredInventory?.length > 0 ? (
                                    filteredInventory.map((item) => (
                                        <tr key={item.id} className="hover:bg-surface-alt transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-mono text-text-primary">
                                                    {item.sku}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-text-secondary">
                                                    {item.product}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-text-secondary">
                                                    {item.warehouse}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-mono text-text-primary">
                                                    {item.quantity || item.stock} units
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(item.status)}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-text-tertiary">
                                            No items found matching your search criteria
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Results count */}
                <div className="mt-4 text-sm text-text-tertiary">
                    Showing {filteredInventory?.length || 0} of {inventory?.length || 0} items
                </div>
            </main>
        </div>
    );
}
