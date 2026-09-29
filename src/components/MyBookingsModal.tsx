import React from 'react';
import { X, Calendar, Car, MapPin, Trash2, CheckCircle2, XCircle, PlusCircle } from 'lucide-react';
import { BookingRecord } from '../data/detailingData';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingRecord[];
  onCancelBooking: (reference: string) => void;
  onDeleteBooking: (reference: string) => void;
  onStartNewBooking: () => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onCancelBooking,
  onDeleteBooking,
  onStartNewBooking,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-end bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="my-bookings-title"
    >
      <div className="w-full max-w-xl h-full bg-[#0A0A0A] border-l border-[#A50F1B]/60 flex flex-col justify-between overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)]">
        {/* Drawer Header */}
        <div className="p-6 bg-[#141414] border-b border-[#C9CCD1]/15 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono-tabular uppercase tracking-widest text-[#E8B84A] block">
              CLIENT GARAGE LOG · LOCALSTORAGE SYNCED
            </span>
            <h2
              id="my-bookings-title"
              className="font-display text-3xl text-[#F3EFE8] uppercase tracking-wider mt-0.5"
            >
              My Detailing Bookings ({bookings.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close My Bookings panel"
            className="w-10 h-10 bg-[#1C1C1C] hover:bg-[#A50F1B] text-[#F3EFE8] border border-[#C9CCD1]/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bookings List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-16 px-4 bg-[#141414] border border-[#C9CCD1]/15">
              <Car className="w-10 h-10 text-[#9A9A9F] mx-auto mb-3" />
              <h3 className="font-display text-2xl text-[#F3EFE8] uppercase tracking-wider mb-1">
                No Active Reservations Yet
              </h3>
              <p className="text-xs text-[#9A9A9F] max-w-sm mx-auto mb-6">
                Your scheduled studio and mobile detailing appointments in the 209 Area will appear here automatically.
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartNewBooking();
                }}
                className="px-5 py-3 bg-[#A50F1B] hover:bg-[#D91E2E] text-[#F3EFE8] text-xs font-semibold uppercase tracking-wider border border-[#D91E2E] transition-colors cursor-pointer"
              >
                Schedule First Detail →
              </button>
            </div>
          ) : (
            bookings.map((b) => {
              const isCancelled = b.status === 'Cancelled';
              return (
                <div
                  key={b.reference}
                  className={`p-5 bg-[#141414] border transition-colors ${
                    isCancelled ? 'border-[#C9CCD1]/10 opacity-70' : 'border-[#A50F1B]/50'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#C9CCD1]/15">
                    <div className="flex items-center gap-2">
                      <span className="font-mono-tabular text-sm font-semibold text-[#D91E2E]">
                        {b.reference}
                      </span>
                      <span aria-hidden="true" className="text-[#9A9A9F]">
                        ·
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-mono-tabular uppercase">
                        {isCancelled ? (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-[#9A9A9F]" />
                            <span className="text-[#9A9A9F]">Cancelled</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#E8B84A]" />
                            <span className="text-[#E8B84A]">{b.status}</span>
                          </>
                        )}
                      </span>
                    </div>
                    <span className="font-mono-tabular text-lg font-semibold text-[#F3EFE8]">
                      ${b.totalPrice}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl text-[#F3EFE8] uppercase tracking-wider">
                    {b.packageName}
                  </h3>
                  {b.addonNames.length > 0 && (
                    <p className="text-xs text-[#C9CCD1] mt-0.5">
                      Add-ons: {b.addonNames.join(' · ')}
                    </p>
                  )}

                  <div className="mt-3 space-y-1.5 text-xs text-[#9A9A9F]">
                    <div className="flex items-center gap-2">
                      <Car className="w-3.5 h-3.5 text-[#D91E2E] shrink-0" />
                      <span className="text-[#F3EFE8]">
                        {b.vehicleYear} {b.vehicleMake} {b.vehicleModel} ({b.vehicleType})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#D91E2E] shrink-0" />
                      <span className="font-mono-tabular text-[#F3EFE8]">
                        {b.date} at {b.timeSlot}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#D91E2E] shrink-0" />
                      <span>
                        {b.serviceLocation === 'mobile' ? 'Mobile Concierge' : '209 Studio'} —{' '}
                        {b.customerAddress}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#C9CCD1]/10 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-[#9A9A9F]">
                      Client: {b.customerName} ({b.customerPhone})
                    </span>
                    <div className="flex items-center gap-2">
                      {!isCancelled && (
                        <button
                          type="button"
                          onClick={() => onCancelBooking(b.reference)}
                          className="px-3 py-1.5 bg-[#1C1C1C] hover:bg-[#5E0A10] text-xs text-[#C9CCD1] hover:text-[#F3EFE8] border border-[#C9CCD1]/15 transition-colors cursor-pointer whitespace-nowrap"
                        >
                          Cancel Slot
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onDeleteBooking(b.reference)}
                        aria-label={`Remove booking ${b.reference}`}
                        className="p-1.5 bg-[#1C1C1C] hover:bg-[#A50F1B] text-[#9A9A9F] hover:text-[#F3EFE8] border border-[#C9CCD1]/15 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-6 bg-[#141414] border-t border-[#C9CCD1]/15 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              onStartNewBooking();
            }}
            className="w-full py-3 bg-[#A50F1B] hover:bg-[#D91E2E] text-[#F3EFE8] text-xs font-semibold uppercase tracking-wider border border-[#D91E2E] flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            Book Another Vehicle
          </button>
        </div>
      </div>
    </div>
  );
};
