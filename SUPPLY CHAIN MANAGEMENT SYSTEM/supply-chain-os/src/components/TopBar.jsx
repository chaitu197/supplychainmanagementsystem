import { Link, useLocation } from 'react-router-dom';

export default function TopBar({ user = { name: 'User' }, onLogout }) {
    const location = useLocation();

    const navLinks = [
        { path: '/dashboard', label: 'Dashboard' },
        { path: '/forecasting', label: 'Forecasting' },
        { path: '/procurement', label: 'Procurement' },
        { path: '/inventory', label: 'Inventory' },
        { path: '/warehouse', label: 'Warehouse' },
        { path: '/logistics', label: 'Logistics' },
        { path: '/orders', label: 'Orders' },
        { path: '/returns', label: 'Returns' },
        { path: '/analytics', label: 'Analytics' },
        { path: '/journey', label: 'Journey' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-surface border-b border-border sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center">
                        <h1 className="text-xl font-heading text-text-primary tracking-tight">
                            Supply Chain OS
                        </h1>
                    </Link>

                    {/* Navigation Links - Hidden on mobile */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.path)
                                    ? 'bg-accent text-void'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-text-secondary hidden sm:block">
                            {user.name}
                        </span>
                        <button
                            onClick={onLogout}
                            className="text-sm text-text-tertiary hover:text-text-primary transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
