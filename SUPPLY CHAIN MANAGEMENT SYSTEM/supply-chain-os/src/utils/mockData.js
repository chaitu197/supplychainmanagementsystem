// Mock data for development
export const mockData = {
    dashboardMetrics: {
        kpis: {
            onTimeDelivery: { value: 94.2, trend: { value: 2.1, direction: 'up' } },
            stockoutEvents: { value: 3, trend: { value: 40, direction: 'down' } },
            forecastAccuracy: { value: 87.5, trend: { value: 3.2, direction: 'up' } },
            openPOs: { value: 24, trend: { value: 12, direction: 'up' } },
        },
        demandData: Array.from({ length: 30 }, (_, i) => ({
            date: new Date(2024, 11, i + 1).toISOString().split('T')[0],
            demand: 1000 + Math.random() * 500,
            capacity: 1500,
        })),
        shipmentData: {
            inTransit: 142,
            dispatched: 89,
            delivered: 1245,
            delayed: 7,
        },
        recentActivity: [
            { id: 1, type: 'PO', message: 'PO #4521 approved - Supplier: TechParts Inc', time: '10 min ago' },
            { id: 2, type: 'Shipment', message: 'Shipment #8821 delayed - ETA updated to Dec 8', time: '25 min ago' },
            { id: 3, type: 'Alert', message: 'Reorder alert - Product SKU-4422 below threshold', time: '1 hour ago' },
        ],
    },

    forecastData: {
        productId: 'SKU-1001',
        horizonDays: 30,
        series: Array.from({ length: 30 }, (_, i) => ({
            date: `Day ${i + 1}`,
            demand: 1000 + Math.random() * 200 + (i > 20 ? 300 : 0),
            lowerBound: 900 + Math.random() * 100,
            upperBound: 1100 + Math.random() * 200 + (i > 20 ? 300 : 0),
        })),
        insights: [
            'Seasonal spike expected in Week 3 (+22%)',
            'Confidence: High (92%)',
            'Recommendation: Increase stock by 1,200 units',
        ],
        confidence: 0.92,
    },

    suppliers: [
        { id: 1, name: 'TechParts Inc', leadTimeDays: 7, defectRate: 0.8, costIndex: 2, aiScore: 92 },
        { id: 2, name: 'GlobalCo', leadTimeDays: 14, defectRate: 2.1, costIndex: 1, aiScore: 78 },
        { id: 3, name: 'QuickShip', leadTimeDays: 3, defectRate: 1.2, costIndex: 3, aiScore: 85 },
        { id: 4, name: 'ReliableSupply', leadTimeDays: 10, defectRate: 1.5, costIndex: 2, aiScore: 88 },
    ],

    reorderSuggestions: [
        { id: 1, sku: 'SKU-4422', product: 'Widget Pro', quantity: 1200, reason: 'Forecast spike + Low stock', supplierId: 1 },
        { id: 2, sku: 'SKU-7788', product: 'Gadget Plus', quantity: 800, reason: 'Below safety threshold', supplierId: 3 },
    ],

    inventory: [
        { id: 1, sku: '4422', product: 'Widget Pro', quantity: 120, status: 'low', warehouse: 'WH-01' },
        { id: 2, sku: '7788', product: 'Gadget Plus', quantity: 45, status: 'critical', warehouse: 'WH-02' },
        { id: 3, sku: '9901', product: 'Tool Master', quantity: 850, status: 'healthy', warehouse: 'WH-01' },
        { id: 4, sku: '1234', product: 'Super Widget', quantity: 320, status: 'healthy', warehouse: 'WH-01' },
        { id: 5, sku: '5678', product: 'Mega Gadget', quantity: 75, status: 'low', warehouse: 'WH-02' },
    ],

    routeOptimization: {
        vehicleId: 'V-001',
        stops: [
            { orderId: '8821', address: '123 Main St', eta: '10:30 AM', sequence: 1 },
            { orderId: '8822', address: '456 Oak Ave', eta: '11:15 AM', sequence: 2 },
            { orderId: '8823', address: '789 Elm Rd', eta: '12:00 PM', sequence: 3 },
        ],
        totalDistance: 45,
        totalTime: 135,
    },
};
