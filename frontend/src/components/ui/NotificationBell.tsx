import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '@/services/api';
import { Bell, FileText, MessageSquare, X } from 'lucide-react';
import clsx from 'clsx';

interface NotificationItem {
  id: number;
  type: 'surat' | 'pengaduan';
  title: string;
  description: string;
  url: string;
  created_at: string;
}

interface PendingResponse {
  total: number;
  pending_letters: number;
  pending_complaints: number;
  items: NotificationItem[];
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery<PendingResponse>({
    queryKey: ['notifications-pending'],
    queryFn: async () => {
      const { data } = await api.get('/notifications/pending');
      return data.data;
    },
    refetchInterval: 30_000, // Poll every 30 seconds
  });

  const total = data?.total || 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-fg-secondary hover:text-fg hover:bg-subtle transition-colors"
        aria-label="Notifikasi"
      >
        <Bell className="w-5 h-5" />
        {total > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-danger-500 rounded-full ring-2 ring-surface animate-pulse-fast">
            {total > 9 ? '9+' : total}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-surface border border-border rounded-xl shadow-xl shadow-black/10 dark:shadow-black/30 z-50 overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div>
              <p className="text-sm font-semibold text-fg">Notifikasi</p>
              <p className="text-xs text-fg-secondary">
                {total === 0
                  ? 'Tidak ada notifikasi'
                  : `${total} menunggu diproses`}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-fg-muted hover:text-fg hover:bg-subtle transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Empty */}
          {!isLoading && total === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-fg-muted">
              <Bell className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-xs">Tidak ada notifikasi baru</p>
            </div>
          )}

          {/* Items */}
          {!isLoading && data?.items && data.items.length > 0 && (
            <div className="max-h-80 overflow-y-auto divide-y divide-border">
              {data.items.map((item) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  to={item.url}
                  onClick={() => setIsOpen(false)}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-subtle transition-colors"
                >
                  <div
                    className={clsx(
                      'mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                      item.type === 'surat'
                        ? 'bg-primary-500/10 text-primary-600'
                        : 'bg-amber-500/10 text-amber-600'
                    )}
                  >
                    {item.type === 'surat' ? (
                      <FileText className="w-4 h-4" />
                    ) : (
                      <MessageSquare className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-fg truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-fg-secondary truncate">
                      {item.description}
                    </p>
                    <p className="text-[10px] text-fg-muted mt-0.5">
                      {item.created_at}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Footer links */}
          {!isLoading && total > 0 && (
            <div className="flex border-t border-border">
              <Link
                to="/admin/surat/permohonan?status=menunggu"
                onClick={() => setIsOpen(false)}
                className="flex-1 px-3 py-2.5 text-xs font-medium text-fg-secondary hover:text-fg hover:bg-subtle text-center transition-colors"
              >
                Lihat Surat ({data?.pending_letters || 0})
              </Link>
              <div className="w-px bg-border" />
              <Link
                to="/admin/pengaduan"
                onClick={() => setIsOpen(false)}
                className="flex-1 px-3 py-2.5 text-xs font-medium text-fg-secondary hover:text-fg hover:bg-subtle text-center transition-colors"
              >
                Lihat Pengaduan ({data?.pending_complaints || 0})
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
