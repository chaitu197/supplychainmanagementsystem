import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../components/TopBar';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SupplyChainJourney() {
    const navigate = useNavigate();
    const [view, setView] = useState('selection'); // 'selection' or 'journey'
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [journey, setJourney] = useState(null);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleLogout = () => navigate('/');

    // Fetch inventory products
    useEffect(() => {
        const fetchInventory = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8000/api/inventory');
                const data = await response.json();
                setInventory(data);
            } catch (error) {
                console.error('Error fetching inventory:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    // Fetch journey data
    const fetchJourney = async (productId, productName) => {
        setLoading(true);
        try {
            const encodedName = encodeURIComponent(productName);
            const response = await fetch(`http://localhost:8000/api/product-journey/${productId}?product_name=${encodedName}`);
            const data = await response.json();
            setJourney(data);
            setView('journey');
        } catch (error) {
            console.error('Error fetching journey:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        // Use SKU as product ID for consistent journey generation
        const productId = product.sku;
        fetchJourney(productId, product.product);
    };

    const handleBackToSelection = () => {
        setView('selection');
        setSelectedProduct(null);
        setJourney(null);
    };

    const getStageColor = (stageType) => {
        const colors = {
            'FARM': '#48BB78',
            'SUPPLIER_T3': '#4299E1',
            'SUPPLIER_T2': '#667EEA',
            'SUPPLIER_T1': '#9F7AEA',
            'MANUFACTURER_CAN': '#FF8C42',
            'MANUFACTURER_BOTTLE': '#FF8C42',
            'MANUFACTURER_BREWER': '#FF8C42',
            'DISTRIBUTOR': '#F56565',
            'RETAILER': '#ED8936',
            'CUSTOMER': '#38B2AC'
        };
        return colors[stageType] || '#A0AEC0';
    };

    const filteredInventory = inventory.filter(item =>
        item.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && inventory.length === 0) {
        return (
            <div className="min-h-screen bg-void">
                <TopBar onLogout={handleLogout} />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <LoadingSkeleton variant="card" count={3} />
                </main>
            </div>
        );
    }

    // Product Selection View
    if (view === 'selection') {
        return (
            <div className="min-h-screen bg-void">
                <TopBar onLogout={handleLogout} />

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-5xl font-heading text-text-primary mb-2">
                            Supply Chain Journey
                        </h1>
                        <p className="text-text-tertiary">
                            Select a product to visualize its complete supply chain journey
                        </p>
                    </div>

                    {/* Search Bar */}
                    <Card padding="md" className="mb-8">
                        <input
                            type="text"
                            placeholder="Search products by name or SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 bg-surface border border-border rounded-md text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </Card>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredInventory.map((product) => (
                            <Card
                                key={product.sku}
                                padding="md"
                                className="cursor-pointer hover:border-accent transition-all hover:scale-105"
                                onClick={() => handleProductSelect(product)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-lg font-heading text-text-primary mb-1">
                                            {product.product}
                                        </h3>
                                        <p className="text-sm font-mono text-text-tertiary">
                                            {product.sku}
                                        </p>
                                    </div>
                                    <Badge variant={
                                        product.status === 'healthy' ? 'success' :
                                            product.status === 'low' ? 'warning' : 'danger'
                                    }>
                                        {product.status}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-tertiary">Stock:</span>
                                        <span className="font-mono text-text-primary">
                                            {product.quantity || product.stock} units
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-tertiary">Warehouse:</span>
                                        <span className="font-mono text-text-secondary">
                                            {product.warehouse}
                                        </span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="w-full mt-4">
                                    View Journey →
                                </Button>
                            </Card>
                        ))}
                    </div>

                    {filteredInventory.length === 0 && (
                        <Card padding="lg" className="text-center">
                            <p className="text-text-tertiary">No products found matching "{searchTerm}"</p>
                        </Card>
                    )}
                </main>
            </div>
        );
    }

    // Journey View
    return (
        <div className="min-h-screen bg-void">
            <TopBar onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header with Back Button */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBackToSelection}
                        className="mb-4"
                    >
                        ← Back to Product Selection
                    </Button>
                    <h1 className="text-5xl font-heading text-text-primary mb-2">
                        Supply Chain Journey
                    </h1>
                    <p className="text-text-tertiary">
                        Complete path from raw materials to customer for {selectedProduct?.product}
                    </p>
                </div>

                {journey && (
                    <>
                        {/* Journey Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <Card padding="md">
                                <p className="text-text-tertiary text-sm mb-1">Product</p>
                                <p className="text-2xl font-heading text-text-primary">{journey.product_name}</p>
                            </Card>
                            <Card padding="md">
                                <p className="text-text-tertiary text-sm mb-1">Total Stages</p>
                                <p className="text-2xl font-mono text-accent">{journey.stages.length}</p>
                            </Card>
                            <Card padding="md">
                                <p className="text-text-tertiary text-sm mb-1">Final Cost</p>
                                <p className="text-2xl font-mono text-success">
                                    ${journey.stages[journey.stages.length - 1]?.cumulative_unit_cost.toFixed(2)}
                                </p>
                            </Card>
                            <Card padding="md">
                                <p className="text-text-tertiary text-sm mb-1">Total Lead Time</p>
                                <p className="text-2xl font-mono text-text-primary">
                                    {journey.stages.reduce((sum, s) => sum + s.lead_time_days, 0)} days
                                </p>
                            </Card>
                        </div>

                        {/* Visual Journey Flow */}
                        <Card padding="md" className="mb-8">
                            <h2 className="text-2xl font-heading text-text-primary mb-6">Journey Flow</h2>
                            <div className="flex items-center gap-2 overflow-x-auto pb-4">
                                {journey.stages.map((stage, index) => (
                                    <div key={stage.id} className="flex items-center">
                                        <div
                                            className="flex flex-col items-center min-w-[140px] p-4 rounded-lg border-2 transition-all hover:scale-105"
                                            style={{
                                                borderColor: getStageColor(stage.stage_type),
                                                backgroundColor: `${getStageColor(stage.stage_type)}15`
                                            }}
                                        >
                                            <div className="text-xs text-text-tertiary mb-1">Stage {stage.order_of_stage}</div>
                                            <div className="text-sm font-medium text-text-primary text-center mb-2">
                                                {stage.label}
                                            </div>
                                            <div className="text-xs text-text-secondary">
                                                ${stage.cumulative_unit_cost.toFixed(2)}
                                            </div>
                                            <div className="text-xs text-text-tertiary mt-1">
                                                {stage.quantity_out.toLocaleString()} units
                                            </div>
                                        </div>
                                        {index < journey.stages.length - 1 && (
                                            <div className="text-accent text-2xl px-2">→</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Cost Breakdown Chart */}
                            <Card padding="md">
                                <h2 className="text-2xl font-heading text-text-primary mb-4">
                                    Cost Breakdown by Stage
                                </h2>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={journey.stages}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                                            <XAxis
                                                dataKey="order_of_stage"
                                                stroke="#A0AEC0"
                                                tick={{ fill: '#A0AEC0' }}
                                                label={{ value: 'Stage', position: 'insideBottom', offset: -5, fill: '#A0AEC0' }}
                                            />
                                            <YAxis
                                                stroke="#A0AEC0"
                                                tick={{ fill: '#A0AEC0' }}
                                                label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft', fill: '#A0AEC0' }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1A202C',
                                                    border: '1px solid #2D3748',
                                                    borderRadius: '8px'
                                                }}
                                                labelStyle={{ color: '#E2E8F0' }}
                                            />
                                            <Bar
                                                dataKey="unit_cost_added"
                                                fill="#FF8C42"
                                                name="Cost Added"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            {/* Cumulative Cost Chart */}
                            <Card padding="md">
                                <h2 className="text-2xl font-heading text-text-primary mb-4">
                                    Cumulative Cost Growth
                                </h2>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={journey.stages}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                                            <XAxis
                                                dataKey="order_of_stage"
                                                stroke="#A0AEC0"
                                                tick={{ fill: '#A0AEC0' }}
                                                label={{ value: 'Stage', position: 'insideBottom', offset: -5, fill: '#A0AEC0' }}
                                            />
                                            <YAxis
                                                stroke="#A0AEC0"
                                                tick={{ fill: '#A0AEC0' }}
                                                label={{ value: 'Total Cost ($)', angle: -90, position: 'insideLeft', fill: '#A0AEC0' }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1A202C',
                                                    border: '1px solid #2D3748',
                                                    borderRadius: '8px'
                                                }}
                                                labelStyle={{ color: '#E2E8F0' }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="cumulative_unit_cost"
                                                stroke="#48BB78"
                                                strokeWidth={3}
                                                name="Cumulative Cost"
                                                dot={{ fill: '#48BB78', r: 5 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>

                        {/* Quantity Flow Chart */}
                        <Card padding="md" className="mb-8">
                            <h2 className="text-2xl font-heading text-text-primary mb-4">
                                Quantity Flow Through Supply Chain
                            </h2>
                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={journey.stages}>
                                        <defs>
                                            <linearGradient id="colorQty" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4299E1" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#4299E1" stopOpacity={0.1} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                                        <XAxis
                                            dataKey="label"
                                            stroke="#A0AEC0"
                                            tick={{ fill: '#A0AEC0', fontSize: 12 }}
                                            angle={-45}
                                            textAnchor="end"
                                            height={100}
                                        />
                                        <YAxis
                                            stroke="#A0AEC0"
                                            tick={{ fill: '#A0AEC0' }}
                                            label={{ value: 'Units', angle: -90, position: 'insideLeft', fill: '#A0AEC0' }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1A202C',
                                                border: '1px solid #2D3748',
                                                borderRadius: '8px'
                                            }}
                                            labelStyle={{ color: '#E2E8F0' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="quantity_out"
                                            stroke="#4299E1"
                                            fillOpacity={1}
                                            fill="url(#colorQty)"
                                            name="Quantity"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* Detailed Stages Table */}
                        <Card padding="none">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-surface-alt border-b border-border">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase">Stage</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase">Label</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-text-tertiary uppercase">Type</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-text-tertiary uppercase">Cost Added</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-text-tertiary uppercase">Total Cost</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-text-tertiary uppercase">Qty In</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-text-tertiary uppercase">Qty Out</th>
                                            <th className="px-6 py-4 text-right text-xs font-medium text-text-tertiary uppercase">Lead Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {journey.stages.map((stage) => (
                                            <tr key={stage.id} className="hover:bg-surface-alt transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="font-mono text-text-primary">{stage.order_of_stage}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-text-primary font-medium">{stage.label}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge
                                                        variant="info"
                                                        style={{
                                                            backgroundColor: `${getStageColor(stage.stage_type)}20`,
                                                            color: getStageColor(stage.stage_type),
                                                            borderColor: getStageColor(stage.stage_type)
                                                        }}
                                                    >
                                                        {stage.stage_type}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="font-mono text-text-secondary">
                                                        ${stage.unit_cost_added.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="font-mono text-success font-medium">
                                                        ${stage.cumulative_unit_cost.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="font-mono text-text-secondary">
                                                        {stage.quantity_in.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="font-mono text-text-primary">
                                                        {stage.quantity_out.toLocaleString()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className="font-mono text-text-tertiary">
                                                        {stage.lead_time_days} days
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </>
                )}
            </main>
        </div>
    );
}
