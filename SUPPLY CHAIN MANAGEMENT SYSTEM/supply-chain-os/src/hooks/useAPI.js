import { useState, useEffect } from 'react';
import { mockData } from '../utils/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const USE_MOCK_DATA = false; // Now using real backend API with ML models!

// Generic API hook
function useAPI(endpoint, method = 'GET', body = null, dependencies = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            if (USE_MOCK_DATA) {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 500));

                // Return mock data based on endpoint
                const mockResponse = getMockDataForEndpoint(endpoint, body);
                setData(mockResponse);
            } else {
                const options = {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                };

                if (body && method !== 'GET') {
                    options.body = JSON.stringify(body);
                }

                const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const result = await response.json();
                setData(result);
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, dependencies);

    return { data, loading, error, refetch: fetchData };
}

// Helper to get mock data based on endpoint
function getMockDataForEndpoint(endpoint, body) {
    switch (endpoint) {
        case '/api/dashboard-metrics':
            return mockData.dashboardMetrics;
        case '/api/forecast-demand':
            return mockData.forecastData;
        case '/api/supplier-scores':
            return mockData.suppliers;
        case '/api/reorder-suggestions':
            return mockData.reorderSuggestions;
        case '/api/inventory':
            return mockData.inventory;
        case '/api/optimize-route':
            return mockData.routeOptimization;
        default:
            return null;
    }
}

// Specific hooks for each endpoint
export function useDashboardMetrics() {
    return useAPI('/api/dashboard-metrics', 'GET');
}

export function useForecastDemand(filters) {
    return useAPI('/api/forecast-demand', 'POST', filters, [JSON.stringify(filters)]);
}

export function useSupplierScores() {
    return useAPI('/api/supplier-scores', 'GET');
}

export function usePOSuggestions() {
    return useAPI('/api/reorder-suggestions', 'GET');
}

export function useInventory(filters) {
    return useAPI('/api/inventory', 'GET', null, [JSON.stringify(filters)]);
}

export function useReorderSuggestions() {
    return useAPI('/api/reorder-suggestions', 'GET');
}

export function useRouteOptimization(orders) {
    return useAPI('/api/optimize-route', 'POST', { orders }, [JSON.stringify(orders)]);
}

export function useOrders() {
    return useAPI('/api/orders', 'GET');
}

