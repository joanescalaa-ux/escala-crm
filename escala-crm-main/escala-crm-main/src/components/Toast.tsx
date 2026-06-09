'use client'

import { useEffect, useState, createContext, useContext, useCallback } from 'react'
import { X } from 'lucide-react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextType {
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextType>({ addToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div
        className="fixed bottom-6 right-6 flex flex-col gap-2 z-50"
        style={{ maxWidth: 360 }}
      >
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="toast-enter flex items-start gap-3 bg-white rounded-lg shadow-lg p-4"
            style={{
              borderLeft: `3px solid ${toast.type === 'success' ? '#0891B2' : toast.type === 'error' ? '#EF4444' : '#F59E0B'}`,
              minWidth: 280,
            }}
          >
            <span className="flex-1 text-sm" style={{ color: '#0F172A' }}>
              {toast.message}
            </span>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 mt-0.5"
              style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
