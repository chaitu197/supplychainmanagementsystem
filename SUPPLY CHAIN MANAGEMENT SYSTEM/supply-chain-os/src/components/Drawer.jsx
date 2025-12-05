import { useEffect } from 'react';

export default function Drawer({ isOpen, onClose, title, children, position = 'right' }) {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const positionClasses = {
        right: 'right-0',
        left: 'left-0',
    };

    const transformClasses = {
        right: isOpen ? 'translate-x-0' : 'translate-x-full',
        left: isOpen ? 'translate-x-0' : '-translate-x-full',
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-void/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 ${positionClasses[position]} h-full w-full max-w-md z-50 
                   bg-surface border-l border-border shadow-2xl
                   transform transition-transform duration-300 ease-out ${transformClasses[position]}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="drawer-title"
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border">
                        <h2 id="drawer-title" className="text-2xl font-heading text-text-primary">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-text-tertiary hover:text-text-primary transition-colors"
                            aria-label="Close drawer"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
