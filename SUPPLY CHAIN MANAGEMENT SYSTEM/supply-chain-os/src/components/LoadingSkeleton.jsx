export default function LoadingSkeleton({ variant = 'card', count = 1, height = 'auto' }) {
    const variants = {
        card: 'h-32 rounded-lg',
        table: 'h-12 rounded',
        chart: 'h-64 rounded-lg',
        text: 'h-4 rounded',
    };

    const skeletonClass = `bg-surface-alt animate-pulse ${variants[variant]}`;

    return (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className={skeletonClass}
                    style={{ height: height !== 'auto' ? height : undefined }}
                />
            ))}
        </div>
    );
}
