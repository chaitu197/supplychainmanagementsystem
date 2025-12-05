export default function Card({
    children,
    className = '',
    padding = 'md',
    status = 'none',
    onClick
}) {
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };

    const statusClasses = {
        none: '',
        success: 'border-success/30 bg-success-dim/5',
        warning: 'border-warning/30 bg-warning-dim/5',
        danger: 'border-danger/30 bg-danger-dim/5',
        info: 'border-info/30 bg-info-dim/5',
    };

    return (
        <div
            onClick={onClick}
            className={`card ${paddingClasses[padding]} ${statusClasses[status]} ${className} ${onClick ? 'cursor-pointer' : ''
                }`}
        >
            {children}
        </div>
    );
}
