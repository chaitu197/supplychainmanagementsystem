export default function MetricCard({ label, value, trend, status = 'info', icon }) {
    const statusColors = {
        success: 'border-success/30 bg-success-dim/5',
        warning: 'border-warning/30 bg-warning-dim/5',
        danger: 'border-danger/30 bg-danger-dim/5',
        info: 'border-info/30 bg-info-dim/5',
    };

    const getTrendColor = () => {
        if (!trend) return '';

        // For most metrics, up is good. For stockouts/delays, down is good.
        const isPositive = trend.direction === 'up';
        const isGoodMetric = status === 'success' || status === 'info';

        if (isPositive && isGoodMetric) return 'text-success';
        if (!isPositive && isGoodMetric) return 'text-danger';
        if (isPositive && !isGoodMetric) return 'text-danger';
        return 'text-success';
    };

    return (
        <div className={`card p-6 ${statusColors[status]}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                    {icon && <span className="text-text-tertiary">{icon}</span>}
                    <p className="text-sm font-medium text-text-tertiary uppercase tracking-wider">
                        {label}
                    </p>
                </div>
                {trend && (
                    <span className={`text-xs font-mono ${getTrendColor()}`}>
                        {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
                    </span>
                )}
            </div>
            <p className="text-data-lg font-mono text-text-primary">
                {value}
            </p>
        </div>
    );
}
