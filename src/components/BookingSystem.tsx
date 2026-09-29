import React, { useState, useEffect, useMemo } from 'react';
import {
  Check,
  Calendar as CalendarIcon,
  Clock,
  Car,
  MapPin,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  Download,
  FileText,
  Wrench,
} from 'lucide-react';
import {
  PACKAGES_LIST,
  SERVICES_LIST,
  ADDON_OPTIONS,
  VEHICLE_TYPES,
  TIME_SLOTS,
  BookingRecord,
} from '../data/detailingData';

interface BookingSystemProps {
  selectedPackageId: string;
  selectedServiceId: string | null;
  onSelectPackage: (pkgId: string) => void;
  onClearStandaloneService: () => void;
  bookings: BookingRecord[];
  onSaveBooking: (booking: BookingRecord) => void;
  onOpenMyBookings: () => void;
}

const POPULAR_VEHICLE_PRESETS = [
  { type: 'Coupe' as const, year: '1969', make: 'Chevrolet', model: 'Chevelle SS' },
  { type: 'Sedan' as const, year: '2024', make: 'Tesla', model: 'Model 3 Performance' },
  { type: 'SUV' as const, year: '2023', make: 'Porsche', model: 'Macan GTS' },
  { type: 'Truck' as const, year: '2023', make: 'Ford', model: 'F-150 Raptor' },
];

export const BookingSystem: React.FC<BookingSystemProps> = ({
  selectedPackageId,
  selectedServiceId,
  onSelectPackage,
  onClearStandaloneService,
  bookings,
  onSaveBooking,
  onOpenMyBookings,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectionMode, setSelectionMode] = useState<'package' | 'service'>('package');
  const [activeServiceId, setActiveServiceId] = useState<string>('srv-full-detail');
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  // Step 2: Vehicle State
  const [vehicleType, setVehicleType] = useState<'Sedan' | 'Coupe' | 'SUV' | 'Truck' | 'Van'>('Sedan');
  const [vehicleYear, setVehicleYear] = useState<string>('2023');
  const [vehicleMake, setVehicleMake] = useState<string>('');
  const [vehicleModel, setVehicleModel] = useState<string>('');

  // Step 3: Date & Time State
  const availableDates = useMemo(() => {
    const dates: { iso: string; dayName: string; dayNum: string; monthName: string; isSunday: boolean }[] = [];
    const base = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.toLocaleDateString('en-US', { day: '2-digit' });
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      dates.push({
        iso,
        dayName,
        dayNum,
        monthName,
        isSunday: d.getDay() === 0,
      });
    }
    return dates;
  }, []);

  const firstOpenDate = useMemo(() => {
    const found = availableDates.find((d) => !d.isSunday);
    return found ? found.iso : availableDates[0]?.iso || '2026-10-01';
  }, [availableDates]);

  const [selectedDate, setSelectedDate] = useState<string>(firstOpenDate);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:30 AM');

  // Step 4: Location & Customer Details
  const [serviceLocation, setServiceLocation] = useState<'shop' | 'mobile'>('shop');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Validation & Confirmation State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  // Sync external service/package selection from cards
  useEffect(() => {
    if (selectedServiceId) {
      setSelectionMode('service');
      setActiveServiceId(selectedServiceId);
      setConfirmedBooking(null);
    }
  }, [selectedServiceId]);

  useEffect(() => {
    if (selectedPackageId && !selectedServiceId) {
      setSelectionMode('package');
      setConfirmedBooking(null);
    }
  }, [selectedPackageId, selectedServiceId]);

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  // Determine which time slots are unavailable for the chosen date
  const unavailableSlotsForDate = useMemo(() => {
    const bookedSlots = bookings
      .filter((b) => b.date === selectedDate && b.status !== 'Cancelled')
      .map((b) => b.timeSlot);

    // Deterministic busy slot based on date character sum so every date has realistic studio occupancy
    const charSum = selectedDate.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const defaultBusySlot = TIME_SLOTS[charSum % TIME_SLOTS.length].id;

    return new Set([...bookedSlots, defaultBusySlot]);
  }, [bookings, selectedDate]);

  // Ensure selectedTimeSlot is valid when date changes
  useEffect(() => {
    if (unavailableSlotsForDate.has(selectedTimeSlot)) {
      const firstAvailable = TIME_SLOTS.find((slot) => !unavailableSlotsForDate.has(slot.id));
      if (firstAvailable) {
        setSelectedTimeSlot(firstAvailable.id);
      }
    }
  }, [selectedDate, unavailableSlotsForDate, selectedTimeSlot]);

  // Live Price Breakdown Calculation
  const priceBreakdown = useMemo(() => {
    const selectedPkg = PACKAGES_LIST.find((p) => p.id === selectedPackageId) || PACKAGES_LIST[1];
    const selectedSrv = SERVICES_LIST.find((s) => s.id === activeServiceId) || SERVICES_LIST[7];

    const baseName = selectionMode === 'package' ? selectedPkg.name : selectedSrv.title;
    const basePrice = selectionMode === 'package' ? selectedPkg.basePrice : selectedSrv.price;
    const duration = selectionMode === 'package' ? selectedPkg.duration : selectedSrv.duration;

    const vehicleObj = VEHICLE_TYPES.find((v) => v.id === vehicleType) || VEHICLE_TYPES[0];
    const vehicleSurcharge = vehicleObj.surcharge;

    const chosenAddonObjs = ADDON_OPTIONS.filter((a) => selectedAddons.includes(a.id));
    const addonsTotal = chosenAddonObjs.reduce((sum, a) => sum + a.price, 0);

    const mobileFee = serviceLocation === 'mobile' ? 35 : 0;

    const total = basePrice + vehicleSurcharge + addonsTotal + mobileFee;

    return {
      baseName,
      basePrice,
      duration,
      vehicleSurcharge,
      chosenAddonObjs,
      addonsTotal,
      mobileFee,
      total,
    };
  }, [selectionMode, selectedPackageId, activeServiceId, vehicleType, selectedAddons, serviceLocation]);

  const validateCurrentStep = (): boolean => {
    setErrorMessage(null);
    if (currentStep === 2) {
      if (!vehicleMake.trim() || !vehicleModel.trim()) {
        setErrorMessage('Please enter your vehicle make and model (or click one of the quick presets below).');
        return false;
      }
      const yr = parseInt(vehicleYear, 10);
      if (isNaN(yr) || yr < 1930 || yr > 2027) {
        setErrorMessage('Please enter a valid vehicle year between 1930 and 2027.');
        return false;
      }
    } else if (currentStep === 3) {
      if (!selectedDate) {
        setErrorMessage('Please select a preferred appointment date.');
        return false;
      }
      if (!selectedTimeSlot || unavailableSlotsForDate.has(selectedTimeSlot)) {
        setErrorMessage('Please choose an available time slot.');
        return false;
      }
    } else if (currentStep === 4) {
      if (customerName.trim().length < 2) {
        setErrorMessage('Please enter your full name.');
        return false;
      }
      const phoneDigits = customerPhone.replace(/\D/g, '');
      if (phoneDigits.length < 7) {
        setErrorMessage('Please enter a valid phone number so our detailer can text your confirmation.');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail.trim())) {
        setErrorMessage('Please enter a valid email address for your booking receipt.');
        return false;
      }
      if (serviceLocation === 'mobile' && customerAddress.trim().length < 5) {
        setErrorMessage('Please enter your street address & city in the 209 Area for Mobile Detailing.');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(5, prev + 1));
    }
  };

  const handlePrevStep = () => {
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const reference = `YGO-24-${randomCode}`;

    const newBooking: BookingRecord = {
      reference,
      createdAt: new Date().toISOString(),
      packageId: selectionMode === 'package' ? selectedPackageId : activeServiceId,
      packageName: priceBreakdown.baseName,
      addonIds: selectedAddons,
      addonNames: priceBreakdown.chosenAddonObjs.map((a) => a.name),
      vehicleType,
      vehicleMake: vehicleMake.trim(),
      vehicleModel: vehicleModel.trim(),
      vehicleYear: vehicleYear.trim(),
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      serviceLocation,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      customerAddress:
        serviceLocation === 'mobile'
          ? customerAddress.trim()
          : 'YGO Detailing Studio — 209 Area, California',
      notes: notes.trim(),
      totalPrice: priceBreakdown.total,
      status: 'Confirmed',
    };

    onSaveBooking(newBooking);
    setConfirmedBooking(newBooking);
  };

  const handleDownloadIcs = (booking: BookingRecord) => {
    const dateClean = booking.date.replace(/-/g, '');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//YGO Detailing 209 Area//Booking Concierge//EN',
      'BEGIN:VEVENT',
      `UID:${booking.reference}@ygodetailing.com`,
      `DTSTAMP:${dateClean}T090000Z`,
      `DTSTART:${dateClean}T170000Z`,
      `DTEND:${dateClean}T210000Z`,
      `SUMMARY:YGO Detailing: ${booking.packageName} (${booking.vehicleYear} ${booking.vehicleMake} ${booking.vehicleModel})`,
      `DESCRIPTION:Booking Ref: ${booking.reference} | Time: ${booking.timeSlot} | Total Estimate: $${booking.totalPrice}`,
      `LOCATION:${booking.customerAddress}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${booking.reference}-YGO-Detailing.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetNewBooking = () => {
    setConfirmedBooking(null);
    setCurrentStep(1);
    setErrorMessage(null);
  };

  const stepsMeta = [
    { num: 1, label: 'Service & Package' },
    { num: 2, label: 'Vehicle Specs' },
    { num: 3, label: 'Date & Time' },
    { num: 4, label: 'Location & Contact' },
    { num: 5, label: 'Review & Confirm' },
  ];

  if (confirmedBooking) {
    return (
      <div className="bg-[#141414] border border-[#A50F1B] p-6 sm:p-10 shadow-[0_0_50px_rgba(165,15,27,0.22)]">
        <div className="max-w-2xl mx-auto text-center">
          {/* Animated Checkmark Crest */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#A50F1B]/20 border-2 border-[#D91E2E] flex items-center justify-center shadow-[0_0_30px_rgba(217,30,46,0.5)]">
            <CheckCircle2 className="w-10 h-10 text-[#E8B84A]" />
          </div>

          <p className="text-xs font-mono-tabular uppercase tracking-[0.25em] text-[#E8B84A] mb-2">
            RESERVATION CONFIRMED · 209 AREA CONCIERGE
          </p>
          <h3 className="font-display text-4xl sm:text-5xl text-[#F3EFE8] uppercase tracking-wider mb-3">
            Your Ride Is on the Schedule
          </h3>
          <p className="text-sm text-[#9A9A9F] max-w-lg mx-auto mb-8">
            We have logged your appointment for your{' '}
            <span className="text-[#F3EFE8] font-medium">
              {confirmedBooking.vehicleYear} {confirmedBooking.vehicleMake} {confirmedBooking.vehicleModel}
            </span>
            . Keep your reference code handy for drop-off or mobile arrival.
          </p>

          {/* Reference Code Banner */}
          <div className="bg-[#0A0A0A] border border-[#C9CCD1]/25 p-6 mb-8 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-[#C9CCD1]/15">
              <div>
                <span className="text-[11px] font-mono-tabular uppercase tracking-widest text-[#9A9A9F] block">
                  BOOKING REFERENCE NUMBER
                </span>
                <span className="font-mono-tabular text-2xl sm:text-3xl font-semibold text-[#D91E2E] tracking-wider">
                  {confirmedBooking.reference}
                </span>
              </div>
              <div className="sm:text-right">
                <span className="text-[11px] font-mono-tabular uppercase tracking-widest text-[#9A9A9F] block">
                  ESTIMATED TOTAL
                </span>
                <span className="font-mono-tabular text-2xl sm:text-3xl font-semibold text-[#F3EFE8]">
                  ${confirmedBooking.totalPrice}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#9A9A9F] block">Selected Treatment</span>
                <span className="text-[#F3EFE8] font-semibold mt-0.5 block">
                  {confirmedBooking.packageName}
                </span>
                {confirmedBooking.addonNames.length > 0 && (
                  <span className="text-[#C9CCD1] block mt-1">
                    + {confirmedBooking.addonNames.join(' · ')}
                  </span>
                )}
              </div>
              <div>
                <span className="text-[#9A9A9F] block">Appointment Slot</span>
                <span className="text-[#F3EFE8] font-semibold font-mono-tabular mt-0.5 block">
                  {confirmedBooking.date} at {confirmedBooking.timeSlot}
                </span>
              </div>
              <div>
                <span className="text-[#9A9A9F] block">Vehicle Details</span>
                <span className="text-[#F3EFE8] font-semibold mt-0.5 block">
                  {confirmedBooking.vehicleYear} {confirmedBooking.vehicleMake} {confirmedBooking.vehicleModel} ({confirmedBooking.vehicleType})
                </span>
              </div>
              <div>
                <span className="text-[#9A9A9F] block">Service Mode & Location</span>
                <span className="text-[#F3EFE8] font-semibold mt-0.5 block">
                  {confirmedBooking.serviceLocation === 'mobile' ? 'Mobile Concierge Van' : '209 Studio Drop-Off'} — {confirmedBooking.customerAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => handleDownloadIcs(confirmedBooking)}
              className="px-5 py-3 bg-[#1C1C1C] hover:bg-[#262626] text-[#F3EFE8] text-xs font-semibold uppercase tracking-wider border border-[#C9CCD1]/25 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4 text-[#D91E2E]" />
              Download Calendar (.ICS)
            </button>
            <button
              type="button"
              onClick={onOpenMyBookings}
              className="px-5 py-3 bg-[#A50F1B] hover:bg-[#D91E2E] text-[#F3EFE8] text-xs font-semibold uppercase tracking-wider border border-[#D91E2E] flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-4 h-4" />
              View in My Bookings ({bookings.length})
            </button>
            <button
              type="button"
              onClick={handleResetNewBooking}
              className="px-5 py-3 bg-transparent hover:bg-[#1C1C1C] text-[#9A9A9F] hover:text-[#F3EFE8] text-xs font-semibold uppercase tracking-wider border border-[#C9CCD1]/15 transition-colors cursor-pointer whitespace-nowrap"
            >
              Book Another Vehicle
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left 8 Columns: Multi-Step Interactive Form */}
      <div className="lg:col-span-8 bg-[#141414] border border-[#C9CCD1]/15 p-6 sm:p-8">
        {/* Stepper Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-2 mb-3 overflow-x-auto pb-2">
            {stepsMeta.map((s) => {
              const isActive = currentStep === s.num;
              const isCompleted = currentStep > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    if (s.num < currentStep) {
                      setErrorMessage(null);
                      setCurrentStep(s.num);
                    }
                  }}
                  disabled={s.num > currentStep}
                  className={`flex items-center gap-2 text-left transition-colors whitespace-nowrap ${
                    s.num < currentStep ? 'cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <span
                    className={`w-7 h-7 flex items-center justify-center text-xs font-mono-tabular font-semibold border transition-colors ${
                      isActive
                        ? 'bg-[#A50F1B] text-[#F3EFE8] border-[#D91E2E]'
                        : isCompleted
                        ? 'bg-[#1C1C1C] text-[#E8B84A] border-[#A50F1B]'
                        : 'bg-[#0A0A0A] text-[#9A9A9F] border-[#C9CCD1]/15'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : `0${s.num}`}
                  </span>
                  <span
                    className={`text-xs font-medium hidden sm:inline ${
                      isActive ? 'text-[#F3EFE8] font-semibold' : 'text-[#9A9A9F]'
                    }`}
                  >
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Progress Bar Track */}
          <div className="w-full h-1 bg-[#0A0A0A] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#5E0A10] via-[#A50F1B] to-[#D91E2E] transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Error Validation Banner */}
        {errorMessage && (
          <div
            role="alert"
            className="mb-6 p-4 bg-[#5E0A10]/40 border-l-4 border-[#D91E2E] flex items-start gap-3 text-xs text-[#F3EFE8]"
          >
            <AlertCircle className="w-4 h-4 text-[#D91E2E] shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: CHOOSE PACKAGE OR SERVICE */}
        {currentStep === 1 && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-mono-tabular uppercase tracking-widest text-[#D91E2E] block">
                  STEP 01 OF 05
                </span>
                <h3 className="font-display text-3xl text-[#F3EFE8] uppercase tracking-wider mt-0.5">
                  Select Detailing Package or Service
                </h3>
              </div>

              {/* Segmented Toggle: Full Packages vs Standalone Services */}
              <div className="flex items-center bg-[#0A0A0A] p-1 border border-[#C9CCD1]/15 self-start">
                <button
                  type="button"
                  onClick={() => {
                    setSelectionMode('package');
                    onClearStandaloneService();
                  }}
                  className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                    selectionMode === 'package'
                      ? 'bg-[#A50F1B] text-[#F3EFE8]'
                      : 'text-[#9A9A9F] hover:text-[#F3EFE8]'
                  }`}
                >
                  Signature Packages
                </button>
                <button
                  type="button"
                  onClick={() => setSelectionMode('service')}
                  className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                    selectionMode === 'service'
                      ? 'bg-[#A50F1B] text-[#F3EFE8]'
                      : 'text-[#9A9A9F] hover:text-[#F3EFE8]'
                  }`}
                >
                  Individual Services
                </button>
              </div>
            </div>

            {selectionMode === 'package' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {PACKAGES_LIST.map((pkg) => {
                  const isSelected = selectedPackageId === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => onSelectPackage(pkg.id)}
                      className={`text-left p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#1C1C1C] border-[#D91E2E] shadow-[0_0_25px_rgba(165,15,27,0.3)]'
                          : 'bg-[#0A0A0A] border-[#C9CCD1]/15 hover:border-[#C9CCD1]/35'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] font-mono-tabular uppercase tracking-widest text-[#9A9A9F]">
                            {pkg.duration}
                          </span>
                          {pkg.popular && (
                            <span className="text-[11px] font-mono-tabular uppercase tracking-widest text-[#E8B84A]">
                              ★ MOST POPULAR
                            </span>
                          )}
                        </div>
                        <h4 className="font-display text-2xl text-[#F3EFE8] uppercase tracking-wider">
                          {pkg.name}
                        </h4>
                        <p className="text-xs text-[#9A9A9F] mt-1 mb-4 line-clamp-2">
                          {pkg.tagline}
                        </p>
                      </div>
                      <div className="pt-3 border-t border-[#C9CCD1]/10 flex items-baseline justify-between">
                        <span className="font-mono-tabular text-2xl font-semibold text-[#F3EFE8]">
                          ${pkg.basePrice}
                        </span>
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#D91E2E]">
                          {isSelected ? 'Selected ✓' : 'Choose →'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {SERVICES_LIST.map((srv) => {
                  const isSelected = activeServiceId === srv.id;
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setActiveServiceId(srv.id)}
                      className={`text-left p-4 border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-[#1C1C1C] border-[#D91E2E] shadow-[0_0_20px_rgba(165,15,27,0.25)]'
                          : 'bg-[#0A0A0A] border-[#C9CCD1]/15 hover:border-[#C9CCD1]/35'
                      }`}
                    >
                      <div>
                        <span className="text-[11px] font-mono-tabular text-[#9A9A9F]">
                          {srv.number}. {srv.category} · {srv.duration}
                        </span>
                        <h4 className="font-display text-xl text-[#F3EFE8] uppercase tracking-wider mt-0.5">
                          {srv.title}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-mono-tabular text-lg font-semibold text-[#F3EFE8] block">
                          ${srv.price}
                        </span>
                        <span className="text-[11px] text-[#D91E2E] uppercase font-semibold">
                          {isSelected ? 'Selected' : 'Select'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Optional Add-On Enhancements */}
            <div className="pt-6 border-t border-[#C9CCD1]/15">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#C9CCD1] mb-3">
                OPTIONAL STUDIO ADD-ONS & ENHANCEMENTS
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ADDON_OPTIONS.map((addon) => {
                  const checked = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={`p-3.5 text-left border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                        checked
                          ? 'bg-[#1C1C1C] border-[#A50F1B] text-[#F3EFE8]'
                          : 'bg-[#0A0A0A] border-[#C9CCD1]/15 text-[#9A9A9F] hover:text-[#F3EFE8]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`w-4 h-4 shrink-0 border flex items-center justify-center ${
                            checked ? 'bg-[#A50F1B] border-[#D91E2E]' : 'border-[#C9CCD1]/35'
                          }`}
                        >
                          {checked && <Check className="w-3 h-3 text-[#F3EFE8]" />}
                        </span>
                        <span className="text-xs font-medium truncate">{addon.name}</span>
                      </div>
                      <span className="text-xs font-mono-tabular font-semibold text-[#F3EFE8] shrink-0">
                        +${addon.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: VEHICLE DETAILS */}
        {currentStep === 2 && (
          <div>
            <span className="text-xs font-mono-tabular uppercase tracking-widest text-[#D91E2E] block">
              STEP 02 OF 05
            </span>
            <h3 className="font-display text-3xl text-[#F3EFE8] uppercase tracking-wider mt-0.5 mb-6">
              Vehicle Classification & Details
            </h3>

            {/* Vehicle Body Type Selector */}
            <label className="block text-xs font-mono-tabular uppercase tracking-wider text-[#C9CCD1] mb-3">
              1. Select Vehicle Body Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              {VEHICLE_TYPES.map((vt) => {
                const active = vehicleType === vt.id;
                return (
                  <button
                    key={vt.id}
                    type="button"
                    onClick={() => setVehicleType(vt.id)}
                    className={`p-3.5 border text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-[#1C1C1C] border-[#D91E2E] shadow-[0_0_20px_rgba(165,15,27,0.3)]'
                        : 'bg-[#0A0A0A] border-[#C9CCD1]/15 hover:border-[#C9CCD1]/35'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Car className={`w-4 h-4 ${active ? 'text-[#D91E2E]' : 'text-[#9A9A9F]'}`} />
                      <span className="text-[11px] font-mono-tabular text-[#E8B84A]">
                        {vt.surcharge === 0 ? 'Base Rate' : `+$${vt.surcharge}`}
                      </span>
                    </div>
                    <p className="font-display text-xl text-[#F3EFE8] uppercase tracking-wider">
                      {vt.label}
                    </p>
                    <p className="text-[11px] text-[#9A9A9F] truncate mt-0.5">{vt.examples}</p>
                  </button>
                );
              })}
            </div>

            {/* Quick Fill Vehicle Presets for Convenience */}
            <div className="mb-6">
              <span className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#9A9A9F] block mb-2">
                Quick-Fill Popular Vehicles (Optional):
              </span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_VEHICLE_PRESETS.map((preset) => (
                  <button
                    key={`${preset.year}-${preset.model}`}
                    type="button"
                    onClick={() => {
                      setVehicleType(preset.type);
                      setVehicleYear(preset.year);
                      setVehicleMake(preset.make);
                      setVehicleModel(preset.model);
                      setErrorMessage(null);
                    }}
                    className="px-3 py-1.5 bg-[#0A0A0A] hover:bg-[#1C1C1C] text-xs text-[#C9CCD1] border border-[#C9CCD1]/15 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {preset.year} {preset.make} {preset.model}
                  </button>
                ))}
              </div>
            </div>

            {/* Year, Make, Model Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="vehicle-year"
                  className="block text-xs font-mono-tabular uppercase tracking-wider text-[#C9CCD1] mb-2"
                >
                  Model Year *
                </label>
                <input
                  id="vehicle-year"
                  type="text"
                  value={vehicleYear}
                  onChange={(e) => setVehicleYear(e.target.value)}
                  placeholder="e.g. 1969 or 2024"
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#C9CCD1]/25 text-sm text-[#F3EFE8] focus:border-[#D91E2E] focus:outline-none font-mono-tabular"
                />
              </div>
              <div>
                <label
                  htmlFor="vehicle-make"
                  className="block text-xs font-mono-tabular uppercase tracking-wider text-[#C9CCD1] mb-2"
                >
                  Vehicle Make *
                </label>
                <input
                  id="vehicle-make"
                  type="text"
                  value={vehicleMake}
                  onChange={(e) => setVehicleMake(e.target.value)}
                  placeholder="e.g. Chevrolet, Porsche, BMW"
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#C9CCD1]/25 text-sm text-[#F3EFE8] focus:border-[#D91E2E] focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="vehicle-model"
                  className="block text-xs font-mono-tabular uppercase tracking-wider text-[#C9CCD1] mb-2"
                >
                  Vehicle Model *
                </label>
                <input
                  id="vehicle-model"
                  type="text"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  placeholder="e.g. Chevelle SS, 911, M3"
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#C9CCD1]/25 text-sm text-[#F3EFE8] focus:border-[#D91E2E] focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PICK DATE & TIME SLOT */}
        {currentStep === 3 && (
          <div>
            <span className="text-xs font-mono-tabular uppercase tracking-widest text-[#D91E2E] block">
              STEP 03 OF 05
            </span>
            <h3 className="font-display text-3xl text-[#F3EFE8] uppercase tracking-wider mt-0.5 mb-6">
              Select Appointment Date & Time Slot
            </h3>

            {/* 14-Day Interactive Studio Calendar Grid */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-mono-tabular uppercase tracking-wider text-[#C9CCD1] flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[#D91E2E]" />
                  Choose Date (Next 14 Days · Sundays Closed for Studio Curing)
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={firstOpenDate}
                  onChange={(e) => {
                    if (e.target.value) setSelectedDate(e.target.value);
                  }}
                  aria-label="Custom appointment date picker"
                  className="px-2.5 py-1 bg-[#0A0A0A] border border-[#C9CCD1]/25 text-xs text-[#F3EFE8] font-mono-tabular focus:border-[#D91E2E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-7 gap-2.5">
                {availableDates.map((d) => {
                  const isSelected = selectedDate === d.iso;
                  return (
                    <button
                      key={d.iso}
                      type="button"
                      disabled={d.isSunday}
                      onClick={() => setSelectedDate(d.iso)}
                      className={`p-3 border text-center transition-all ${
                        d.isSunday
                          ? 'bg-[#0A0A0A]/50 border-[#C9CCD1]/10 text-[#9A9A9F]/40 cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#A50F1B] border-[#D91E2E] text-[#F3EFE8] shadow-[0_0_20px_rgba(165,15,27,0.35)] cursor-pointer'
                          : 'bg-[#0A0A0A] border-[#C9CCD1]/15 text-[#F3EFE8] hover:border-[#C9CCD1]/40 cursor-pointer'
                      }`}
                    >
                      <span className="text-[10px] font-mono-tabular uppercase tracking-wider block opacity-80">
                        {d.dayName}
                      </span>
                      <span className="font-display text-2xl block my-0.5">{d.dayNum}</span>
                      <span className="text-[10px] font-mono-tabular uppercase block opacity-75">
                        {d.isSunday ? 'Closed' : d.monthName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <label className="block text-xs font-mono-tabular uppercase tracking-wider text-[#C9CCD1] mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D91E2E]" />
                Select Arrival Time Window for {selectedDate}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TIME_SLOTS.map((slot) => {
                  const isUnavailable = unavailableSlotsForDate.has(slot.id);
                  const isSelected = selectedTimeSlot === slot.id && !isUnavailable;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={isUnavailable}
                      onClick={() => setSelectedTimeSlot(slot.id)}
                      className={`p-4 border text-left transition-all ${
                        isUnavailable
                          ? 'bg-[#0A0A0A]/60 border-[#C9CCD1]/10 text-[#9A9A9F]/40 cursor-not-allowed'
                          : isSelected
                          ? 'bg-[#1C1C1C] border-[#D91E2E] text-[#F3EFE8] shadow-[0_0_20px_rgba(165,15,27,0.3)] cursor-pointer'
                          : 'bg-[#0A0A0A] border-[#C9CCD1]/15 text-[#F3EFE8] hover:border-[#C9CCD1]/40 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono-tabular text-base font-semibold">
                          {slot.label}
                        </span>
                        <span
                          className={`text-[10px] font-mono-tabular uppercase tracking-wider ${
                            isUnavailable
                              ? 'text-[#9A9A9F]/50 line-through'
                              : isSelected
                              ? 'text-[#E8B84A]'
                              : 'text-[#9A9A9F]'
                          }`}
                        >
                          {isUnavailable ? 'BOOKED' : isSelected ? 'SELECTED' : 'AVAILABLE'}
                        </span>
                      </div>
                      <p className="text-xs text-[#9A9A9F] mt-1">{slot.period}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SERVICE LOCATION & CUSTOMER DETAILS */}
        {currentStep === 4 && (
          <div>
            <span className="text-xs font-mono-tabular uppercase tracking-widest text-[#D91E2E] block">
              STEP 04 OF 05
            </span>
            <h3 className="font-display text-3xl text-[#F3EFE8] uppercase tracking-wider mt-0.5 mb-6">
              Service Location & Client Contact
            </h3>

            {/* Shop vs Mobile Choice */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => setServiceLocation('shop')}
                className={`p-4 border text-left transition-all cursor-pointer ${
                  serviceLocation === 'shop'
                    ? 'bg-[#1C1C1C] border-[#D91E2E] shadow-[0_0_20px_rgba(165,15,27,0.3)]'
                    : 'bg-[#0A0A0A] border-[#C9CCD1]/15 hover:border-[#C9CCD1]/35'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display text-xl text-[#F3EFE8] uppercase tracking-wider">
                    Visit Our 209 Studio
                  </span>
                  <span className="text-xs font-mono-tabular text-[#E8B84A]">No Extra Fee</span>
                </div>
                <p className="text-xs text-[#9A9A9F]">
                  Drop off at our climate-controlled detailing bay in the 209 Area, CA with Scangrip inspection lighting.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setServiceLocation('mobile')}
                className={`p-4 border text-left transition-all cursor-pointer ${
                  serviceLocation === 'mobile'
                    ? 'bg-[#1C1C1C] border-[#D91E2E] shadow-[0_0_20px_rgba(165,15,27,0.3)]'
                    : 'bg-[#0A0A0A] border-[#C9CCD1]/15 hover:border-[#C9CCD1]/35'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display text-xl text-[#F3EFE8] uppercase tracking-wider">
                    Mobile Service at My Location
                  </span>
                  <span className="text-xs font-mono-tabular text-[#E8B84A]">+$35 Concierge</span>
                </div>
                <p className="text-xs text-[#9A9A9F]">
                  Our self-contained mobile van (onboard spot-free water & power) comes to your driveway or office across the 209.
                </p>
              </button>
            </div>

            {/* Contact Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="cust-name"
                  className="block text-xs font-mono-tabular uppercase tracking-wider text-[#C9CCD1] mb-1.5"
                >
                  Full Name *
                </label>
                <input
                  id="cust-name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Marcus Castellanos"
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#C9CCD1]/25 text-sm text-[#F3EFE8] focus:border-[#D91E2E] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="cust-phone"
                  className="block text-xs font-mono-tabular uppercase tracking-wider text-[#C9CCD1] mb-1.5"
                >
                  Phone Number (SMS Updates) *
                </label>
                <input
                  id="cust-phone"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+1 (209) 555-0199"
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#C9CCD1]/25 text-sm text-[#F3EFE8] focus:border-[#D91E2E] focus:outline-none font-mono-tabular"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="cust-email"
                  className="block text-xs font-mono-tabular uppercase tracking-wider text-[#C9CCD1] mb-1.5"
                >
                  Email Address *
                </label>
                <input
                  id="cust-email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="marcus@example.com"
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#C9CCD1]/25 text-sm text-[#F3EFE8] focus:border-[#D91E2E] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="cust-address"
                  className="block text-xs font-mono-tabular uppercase tracking-wider text-[#C9CCD1] mb-1.5"
                >
                  {serviceLocation === 'mobile'
                    ? 'Service Street Address & 209 City *'
                    : 'Your City / Neighborhood (Optional)'}
                </label>
                <input
                  id="cust-address"
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder={
                    serviceLocation === 'mobile'
                      ? 'e.g. 1420 Pacific Ave, Stockton, CA'
                      : 'e.g. Stockton / Modesto, CA'
                  }
                  className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#C9CCD1]/25 text-sm text-[#F3EFE8] focus:border-[#D91E2E] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="cust-notes"
                className="block text-xs font-mono-tabular uppercase tracking-wider text-[#C9CCD1] mb-1.5"
              >
                Paint Condition or Special Requests (Optional)
              </label>
              <textarea
                id="cust-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Black metallic paint with swirl marks on hood, gate code #2090, or pet hair in rear cargo..."
                className="w-full px-4 py-2.5 bg-[#0A0A0A] border border-[#C9CCD1]/25 text-sm text-[#F3EFE8] focus:border-[#D91E2E] focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 5: SUMMARY & CONFIRM */}
        {currentStep === 5 && (
          <form onSubmit={handleConfirmBooking}>
            <span className="text-xs font-mono-tabular uppercase tracking-widest text-[#D91E2E] block">
              STEP 05 OF 05
            </span>
            <h3 className="font-display text-3xl text-[#F3EFE8] uppercase tracking-wider mt-0.5 mb-6">
              Verify Booking Dossier & Confirm
            </h3>

            <div className="bg-[#0A0A0A] border border-[#C9CCD1]/20 p-5 mb-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#C9CCD1]/15">
                <div>
                  <span className="text-[11px] font-mono-tabular uppercase tracking-widest text-[#9A9A9F] block">
                    PRIMARY PACKAGE / SERVICE
                  </span>
                  <span className="font-display text-2xl text-[#F3EFE8] uppercase tracking-wider">
                    {priceBreakdown.baseName}
                  </span>
                  <span className="text-xs text-[#9A9A9F] block">
                    Estimated Duration: {priceBreakdown.duration}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono-tabular uppercase tracking-widest text-[#9A9A9F] block">
                    VEHICLE SPECIFICATION
                  </span>
                  <span className="font-display text-2xl text-[#F3EFE8] uppercase tracking-wider">
                    {vehicleYear} {vehicleMake} {vehicleModel}
                  </span>
                  <span className="text-xs text-[#C9CCD1] block">
                    Body Classification: {vehicleType}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#C9CCD1]/15 text-xs">
                <div>
                  <span className="text-[#9A9A9F] uppercase font-mono-tabular block mb-1">
                    DATE & ARRIVAL WINDOW
                  </span>
                  <span className="text-[#F3EFE8] font-semibold font-mono-tabular text-sm">
                    {selectedDate} · {selectedTimeSlot}
                  </span>
                </div>
                <div>
                  <span className="text-[#9A9A9F] uppercase font-mono-tabular block mb-1">
                    LOCATION MODE
                  </span>
                  <span className="text-[#F3EFE8] font-semibold text-sm">
                    {serviceLocation === 'mobile'
                      ? `Mobile Van at ${customerAddress}`
                      : 'YGO Detailing Studio (209 Area, CA)'}
                  </span>
                </div>
              </div>

              <div className="text-xs">
                <span className="text-[#9A9A9F] uppercase font-mono-tabular block mb-1">
                  CLIENT CONTACT
                </span>
                <p className="text-[#F3EFE8]">
                  {customerName} · {customerPhone} · {customerEmail}
                </p>
                {notes && <p className="text-[#9A9A9F] italic mt-1">Notes: &ldquo;{notes}&rdquo;</p>}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-[#1C1C1C] border border-[#A50F1B]/50 mb-6 text-xs text-[#C9CCD1]">
              <ShieldCheck className="w-5 h-5 text-[#E8B84A] shrink-0" />
              <span>
                Zero upfront deposit required today. You pay only after our final Scangrip LED walk-around inspection meets your 100% satisfaction.
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-3.5 bg-[#0A0A0A] hover:bg-[#1C1C1C] text-[#F3EFE8] text-xs font-semibold uppercase tracking-wider border border-[#C9CCD1]/25 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              <button
                type="submit"
                className="btn-shine px-8 py-3.5 bg-[#A50F1B] hover:bg-[#D91E2E] text-[#F3EFE8] text-sm font-semibold uppercase tracking-wider border border-[#D91E2E] shadow-[0_0_28px_rgba(165,15,27,0.6)] flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                Confirm Booking (${priceBreakdown.total})
                <Check className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Step Navigation Footer for Steps 1 to 4 */}
        {currentStep < 5 && (
          <div className="mt-8 pt-6 border-t border-[#C9CCD1]/15 flex items-center justify-between gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="px-5 py-3 bg-[#0A0A0A] hover:bg-[#1C1C1C] text-[#F3EFE8] text-xs font-semibold uppercase tracking-wider border border-[#C9CCD1]/25 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Step
              </button>
            ) : (
              <div className="text-xs text-[#9A9A9F]">
                Step 1 of 5 · Instant Online Estimator
              </div>
            )}

            <button
              type="button"
              onClick={handleNextStep}
              className="btn-shine px-7 py-3.5 bg-[#A50F1B] hover:bg-[#D91E2E] text-[#F3EFE8] text-xs font-semibold uppercase tracking-wider border border-[#D91E2E] shadow-[0_0_24px_rgba(165,15,27,0.45)] flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
            >
              Continue to {stepsMeta[currentStep]?.label}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Right 4 Columns: Live Price Estimate & Build Dossier */}
      <aside className="lg:col-span-4 bg-[#141414] border border-[#A50F1B]/45 p-6 sticky top-24">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#C9CCD1]/15">
          <div>
            <span className="text-[11px] font-mono-tabular uppercase tracking-widest text-[#E8B84A] block">
              LIVE PRICE ESTIMATE
            </span>
            <h4 className="font-display text-2xl text-[#F3EFE8] uppercase tracking-wider">
              Detailing Dossier
            </h4>
          </div>
          <Wrench className="w-5 h-5 text-[#D91E2E]" />
        </div>

        <div className="space-y-3 text-xs mb-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="text-[#9A9A9F] block">Selected Treatment</span>
              <span className="text-[#F3EFE8] font-semibold">{priceBreakdown.baseName}</span>
            </div>
            <span className="font-mono-tabular text-sm font-semibold text-[#F3EFE8]">
              ${priceBreakdown.basePrice}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#C9CCD1]/10">
            <span className="text-[#9A9A9F]">
              Vehicle Size ({vehicleType})
            </span>
            <span className="font-mono-tabular text-[#F3EFE8]">
              {priceBreakdown.vehicleSurcharge === 0
                ? 'Included'
                : `+$${priceBreakdown.vehicleSurcharge}`}
            </span>
          </div>

          {priceBreakdown.chosenAddonObjs.map((addon) => (
            <div
              key={addon.id}
              className="flex items-center justify-between gap-3 pt-2 border-t border-[#C9CCD1]/10"
            >
              <span className="text-[#C9CCD1]">{addon.name}</span>
              <span className="font-mono-tabular text-[#F3EFE8]">+${addon.price}</span>
            </div>
          ))}

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#C9CCD1]/10">
            <span className="text-[#9A9A9F]">
              {serviceLocation === 'mobile' ? '209 Mobile Concierge Van' : '209 Studio Drop-Off'}
            </span>
            <span className="font-mono-tabular text-[#F3EFE8]">
              {priceBreakdown.mobileFee === 0 ? '$0' : `+$${priceBreakdown.mobileFee}`}
            </span>
          </div>
        </div>

        {/* Total Box */}
        <div className="p-4 bg-[#0A0A0A] border border-[#C9CCD1]/20 mb-5">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-mono-tabular uppercase tracking-wider text-[#9A9A9F]">
              ESTIMATED TOTAL
            </span>
            <span className="font-mono-tabular text-3xl font-semibold text-[#F3EFE8]">
              ${priceBreakdown.total}
            </span>
          </div>
          <p className="text-[11px] text-[#9A9A9F] mt-1">
            Est. Time: {priceBreakdown.duration} · Taxes included
          </p>
        </div>

        {/* Selected Date/Time Preview */}
        <div className="space-y-2 text-xs text-[#9A9A9F] border-t border-[#C9CCD1]/15 pt-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-3.5 h-3.5 text-[#D91E2E] shrink-0" />
            <span>
              Slot: <strong className="text-[#F3EFE8] font-mono-tabular">{selectedDate}</strong> at{' '}
              <strong className="text-[#F3EFE8] font-mono-tabular">{selectedTimeSlot}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#D91E2E] shrink-0" />
            <span>
              {serviceLocation === 'mobile'
                ? 'Mobile Van Service (209 Area)'
                : 'YGO Studio — 209 Area, California'}
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
};
