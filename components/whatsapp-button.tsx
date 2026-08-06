'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="animate-fade-up rounded-2xl border border-border bg-card p-4 shadow-2xl max-w-[280px]">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-sm font-semibold">Chat with us</div>
                <div className="text-xs text-muted-foreground">Typically replies quickly</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <a
            href="https://wa.me/254750481060?text=Hi%20Rachel,%20I'd%20like%20to%20learn%20more%20about%20Salesway%20Consulting's%20services."
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" />
            Start WhatsApp Chat
          </a>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-transform hover:scale-105"
        aria-label="Chat on WhatsApp"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
      </button>
    </div>
  );
}
