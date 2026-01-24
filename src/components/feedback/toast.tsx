'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { CheckCircle, AlertCircle, InfoCircle, XClose } from '@untitledui/icons';

/**
 * Toast Notification System
 * Provides user feedback for actions, errors, and success messages
 */

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextValue {
    showToast: (type: ToastType, message: string, duration?: number) => void;
    showSuccess: (message: string, duration?: number) => void;
    showError: (message: string, duration?: number) => void;
    showInfo: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (type: ToastType, message: string, duration: number = 5000) => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast: Toast = { id, type, message, duration };

        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    };

    const showSuccess = (message: string, duration?: number) => {
        showToast('success', message, duration);
    };

    const showError = (message: string, duration?: number) => {
        showToast('error', message, duration);
    };

    const showInfo = (message: string, duration?: number) => {
        showToast('info', message, duration);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo }}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({
    toasts,
    onRemove,
}: {
    toasts: Toast[];
    onRemove: (id: string) => void;
}) {
    return (
        <div
            className="pointer-events-none fixed right-4 top-4 z-50 flex flex-col gap-2"
            role="region"
            aria-label="Notifications"
        >
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Auto-dismiss animation
        if (toast.duration && toast.duration > 0) {
            const timer = setTimeout(() => {
                setIsExiting(true);
                setTimeout(() => onRemove(toast.id), 300);
            }, toast.duration - 300);

            return () => clearTimeout(timer);
        }
    }, [toast, onRemove]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => onRemove(toast.id), 300);
    };

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-success-600" />;
            case 'error':
                return <AlertCircle className="h-5 w-5 text-error-600" />;
            case 'info':
                return <InfoCircle className="h-5 w-5 text-brand-600" />;
        }
    };

    const getStyles = () => {
        const base = 'border-l-4';
        switch (toast.type) {
            case 'success':
                return `${base} border-success-600 bg-success-50`;
            case 'error':
                return `${base} border-error-600 bg-error-50`;
            case 'info':
                return `${base} border-brand-600 bg-brand-50`;
        }
    };

    const getTextColor = () => {
        switch (toast.type) {
            case 'success':
                return 'text-success-900';
            case 'error':
                return 'text-error-900';
            case 'info':
                return 'text-brand-900';
        }
    };

    return (
        <div
            role="alert"
            aria-live="polite"
            className={`
                pointer-events-auto flex min-w-[320px] max-w-md items-start gap-3
                rounded-lg p-4 shadow-lg
                transition-all duration-300
                ${getStyles()}
                ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
            `}
        >
            {getIcon()}
            <p className={`flex-1 text-sm font-medium ${getTextColor()}`}>
                {toast.message}
            </p>
            <button
                onClick={handleClose}
                className={`flex-shrink-0 rounded p-0.5 transition-colors hover:bg-black/10 ${getTextColor()}`}
                aria-label="Close notification"
            >
                <XClose className="h-4 w-4" />
            </button>
        </div>
    );
}
