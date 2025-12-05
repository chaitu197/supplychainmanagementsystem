import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import Badge from '../components/Badge';

export default function Returns() {
    const navigate = useNavigate();
    const handleLogout = () => navigate('/');

    const insights = {
        topReason: 'Defective (42%)',
        problematicSupplier: 'QuickShip (18 returns)',
        problematicProduct: 'SKU-7788 (12 returns)',
    };

    const returns = [
        { id: 'R-4521', product: 'SKU-7788', reason: 'Defective', supplier: 'QuickShip', action: 'Refund' },
        { id: 'R-4522', product: 'SKU-1001', reason: 'Wrong Item', supplier: 'TechParts', action: 'Replace' },
        { id: 'R-4523', product: 'SKU-2001', reason: 'Damaged', supplier: 'GlobalCo', action: 'Refund' },
    ];

    return (
        <div className="min-h-screen bg-void">
            <TopBar onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-5xl font-heading text-text-primary mb-2">
                        Returns & Reverse Logistics
                    </h1>
                    <p className="text-text-tertiary">
                        Learning from failure points for continuous improvement
                    </p>
                </div>

                <Card padding="md" status="warning" className="mb-8">
                    <h2 className="text-2xl font-heading text-text-primary mb-4">
                        Return Insights
                    </h2>
                    <div className="space-y-2">
                        <p className="text-text-secondary">• Top Reason: <span className="text-warning">{insights.topReason}</span></p>
                        <p className="text-text-secondary">• Problematic Supplier: <span className="text-warning">{insights.problematicSupplier}</span></p>
                        <p className="text-text-secondary">• Problematic Product: <span className="text-warning">{insights.problematicProduct}</span></p>
                    </div>
                </Card>

                <Card padding="none">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-surface-alt border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase">RMA ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase">Product</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase">Reason</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase">Supplier</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {returns.map((ret) => (
                                    <tr key={ret.id} className="hover:bg-surface-alt transition-colors">
                                        <td className="px-6 py-4"><span className="font-mono text-text-primary">{ret.id}</span></td>
                                        <td className="px-6 py-4 text-text-secondary">{ret.product}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant="danger">{ret.reason}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary">{ret.supplier}</td>
                                        <td className="px-6 py-4 text-text-secondary">{ret.action}</td>
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
