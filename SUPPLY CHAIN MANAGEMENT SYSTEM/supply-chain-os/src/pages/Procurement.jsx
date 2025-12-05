import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Drawer from '../components/Drawer';
import Button from '../components/Button';
import { useSupplierScores, usePOSuggestions } from '../hooks/useAPI';
import LoadingSkeleton from '../components/LoadingSkeleton'; // Added import

export default function Procurement() {
    const navigate = useNavigate();
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [approvedPOs, setApprovedPOs] = useState([]); // Added state
    const [sortField, setSortField] = useState('aiScore');
    const [sortDirection, setSortDirection] = useState('desc');

    const { data: suppliersRaw, loading, error } = useSupplierScores(); // Modified destructuring
    const { data: poSuggestions } = usePOSuggestions();

    const handleLogout = () => navigate('/');

    // Added handleApprovePO function
    const handleApprovePO = (poId) => {
        setApprovedPOs([...approvedPOs, poId]);
        // Show success message
        alert(`Purchase Order ${poId} has been approved successfully!`);
    };

    const handleViewSupplier = (supplier) => {
        setSelectedSupplier(supplier);
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Sort suppliers using useMemo to ensure proper re-rendering
    const suppliers = useMemo(() => {
        if (!suppliersRaw) return [];

        return [...suppliersRaw].sort((a, b) => {
            let aVal = a[sortField];
            let bVal = b[sortField];

            if (sortField === 'name') {
                return sortDirection === 'asc'
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }

            return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
        });
    }, [suppliersRaw, sortField, sortDirection]);

    const getRiskBadge = (score) => {
        if (score >= 85) return <Badge variant="success">High Trust</Badge>;
        if (score >= 70) return <Badge variant="info">Medium</Badge>;
        return <Badge variant="warning">Review</Badge>;
    };

    return (
        <div className="min-h-screen bg-void">
            <TopBar onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-5xl font-heading text-text-primary mb-2">
                        Procurement Intelligence
                    </h1>
                    <p className="text-text-tertiary">
                        AI-driven supplier scoring and purchase recommendations
                    </p>
                </div>

                {/* AI Recommendations */}
                <div className="mb-8">
                    <h2 className="text-2xl font-heading text-text-primary mb-4">
                        Recommended Purchase Orders
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {poSuggestions?.map((po) => (
                            <Card key={po.id} padding="md" status={approvedPOs.includes(po.id) ? "success" : "warning"}>
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-lg font-heading text-text-primary">{po.product}</h3>
                                        <p className="text-sm text-text-tertiary">SKU: {po.sku}</p>
                                    </div>
                                    <Badge variant={approvedPOs.includes(po.id) ? "success" : "warning"}>
                                        {approvedPOs.includes(po.id) ? "Approved" : "Recommended"}
                                    </Badge>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <p className="text-text-secondary">
                                        <span className="text-text-tertiary">Quantity:</span> {po.quantity} units
                                    </p>
                                    <p className="text-text-secondary">
                                        <span className="text-text-tertiary">Reason:</span> {po.reason}
                                    </p>
                                </div>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleApprovePO(po.id)}
                                    disabled={approvedPOs.includes(po.id)}
                                >
                                    {approvedPOs.includes(po.id) ? "✓ Approved" : "Approve PO"}
                                </Button>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Supplier Table */}
                <div>
                    <h2 className="text-2xl font-heading text-text-primary mb-4">
                        Supplier Scorecard
                    </h2>
                    <Card padding="none">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-surface-alt border-b border-border">
                                    <tr>
                                        <th
                                            onClick={() => handleSort('name')}
                                            className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:text-accent"
                                        >
                                            Supplier Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            onClick={() => handleSort('leadTimeDays')}
                                            className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:text-accent"
                                        >
                                            Lead Time {sortField === 'leadTimeDays' && (sortDirection === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            onClick={() => handleSort('defectRate')}
                                            className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:text-accent"
                                        >
                                            Defect Rate {sortField === 'defectRate' && (sortDirection === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            onClick={() => handleSort('costIndex')}
                                            className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:text-accent"
                                        >
                                            Cost Index {sortField === 'costIndex' && (sortDirection === 'asc' ? '↑' : '↓')}
                                        </th>
                                        <th
                                            onClick={() => handleSort('aiScore')}
                                            className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider cursor-pointer hover:text-accent"
                                        >
                                            AI Score {sortField === 'aiScore' && (sortDirection === 'asc' ? '↑' : '↓')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {suppliers?.map((supplier) => (
                                        <tr
                                            key={supplier.id}
                                            onClick={() => setSelectedSupplier(supplier)}
                                            className="hover:bg-surface-alt cursor-pointer transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-text-primary">
                                                    {supplier.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-mono text-text-secondary">
                                                    {supplier.leadTimeDays} days
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-mono text-text-secondary">
                                                    {supplier.defectRate}%
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-text-secondary">
                                                    {'$'.repeat(supplier.costIndex)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-mono text-text-primary">
                                                        {supplier.aiScore}
                                                    </span>
                                                    {getRiskBadge(supplier.aiScore)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Approved Purchase Orders */}
                {approvedPOs.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-heading text-text-primary mb-4">
                            Approved Purchase Orders ({approvedPOs.length})
                        </h2>
                        <Card padding="none">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-surface-alt border-b border-border">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                                PO ID
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                                SKU
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                                Quantity
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {poSuggestions?.filter(po => approvedPOs.includes(po.id)).map((po) => (
                                            <tr key={po.id} className="hover:bg-surface-alt transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-mono text-text-primary">
                                                        PO-{po.id.toString().padStart(4, '0')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-text-secondary">
                                                        {po.product}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-mono text-text-secondary">
                                                        {po.sku}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-mono text-text-primary">
                                                        {po.quantity} units
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge variant="success">✓ Approved</Badge>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}
            </main>

            {/* Supplier Detail Drawer */}
            <Drawer
                isOpen={!!selectedSupplier}
                onClose={() => setSelectedSupplier(null)}
                title="Supplier Details"
            >
                {selectedSupplier && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-heading text-text-primary mb-4">
                                {selectedSupplier.name}
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-text-tertiary">AI Score</p>
                                    <p className="text-2xl font-mono text-text-primary">{selectedSupplier.aiScore}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-text-tertiary">Lead Time</p>
                                    <p className="text-lg text-text-secondary">{selectedSupplier.leadTimeDays} days</p>
                                </div>
                                <div>
                                    <p className="text-sm text-text-tertiary">Defect Rate</p>
                                    <p className="text-lg text-text-secondary">{selectedSupplier.defectRate}%</p>
                                </div>
                                <div>
                                    <p className="text-sm text-text-tertiary">Cost Index</p>
                                    <p className="text-lg text-text-secondary">{'$'.repeat(selectedSupplier.costIndex)}</p>
                                </div>
                            </div>
                        </div>
                        <Button variant="primary" className="w-full">
                            Create Purchase Order
                        </Button>
                    </div>
                )}
            </Drawer>
        </div>
    );
}
