import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Star,
  Check,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Maximize2,
  CalendarCheck,
  Send,
  CheckCircle2,
} from 'lucide-react';
import {
  BRAND_IMAGES,
  MARQUEE_KEYWORDS,
  TRUST_PILLARS,
  SERVICES_LIST,
  PACKAGES_LIST,
  GALLERY_ITEMS,
  HOW_IT_WORKS_STEPS,
  REVIEWS_LIST,
  FAQ_ITEMS,
  BookingRecord,
  GalleryItem,
} from './data/detailingData';
import { YgoLogo } from './components/YgoLogo';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { BookingSystem } from './components/BookingSystem';
import { MyBookingsModal } from './components/MyBookingsModal';

const STORAGE_KEY = 'ygo_detailing_bookings_v1';

const INITIAL_SAMPLE_BOOKING: BookingRecord = {
  reference: 'YGO-24-8209',
  createdAt: '2026-09-28T16:30:00.000Z',
  packageId: 'pkg-premium',
  packageName: 'Premium Detail',
  addonIds: ['addon-engine'],
  addonNames: ['Engine Bay Steam & Satin Detail'],
  vehicleType: 'Coupe',
  vehicleMake: 'Chevrolet',
  vehicleModel: 'Chevelle SS 396',
  vehicleYear: '1969',
  date: '2026-10-03',
  timeSlot: '10:30 AM',
  serviceLocation: 'shop',
  customerName: 'Marcus Castellanos',
  customerPhone: '+1 (209) 555-0188',
  customerEmail: 'marcus.c@example.com',
  customerAddress: 'YGO Detailing Studio — 209 Area, California',
  notes: 'Show car prep before Lodi classic cruise night.',
  totalPrice: 334,
  status: 'Confirmed',
};

export default function App() {
  // Brief Loading Screen State
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Booking Pre-selection State
  const [selectedPackageId, setSelectedPackageId] = useState<string>('pkg-premium');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [pricingPreviewSize, setPricingPreviewSize] = useState<'Sedan' | 'SUV' | 'Truck'>('Sedan');

  // Saved Bookings State (localStorage)
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore storage errors
    }
    return [INITIAL_SAMPLE_BOOKING];
  });
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState<boolean>(false);

  // Gallery Filter & Lightbox State
  const [galleryFilter, setGalleryFilter] = useState<string>('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  // Reviews Carousel State
  const [activeReviewIndex, setActiveReviewIndex] = useState<number>(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState<boolean>(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Quick Contact Callback Form State
  const [contactName, setContactName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactMessage, setContactMessage] = useState<string>('');
  const [contactSent, setContactSent] = useState<boolean>(false);

  // Animated Counters State
  const [countersStarted, setCountersStarted] = useState<boolean>(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, prefersReducedMotion ? 50 : 650);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 36);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Persist bookings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    } catch {
      // Ignore storage errors
    }
  }, [bookings]);

  // Auto-advance testimonials carousel
  useEffect(() => {
    if (isCarouselPaused) return;
    const interval = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % REVIEWS_LIST.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isCarouselPaused]);

  // IntersectionObserver for stat counters
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setCountersStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookPackage = (packageId: string) => {
    setSelectedServiceId(null);
    setSelectedPackageId(packageId);
    scrollToSection('booking');
  };

  const handleBookStandaloneService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    scrollToSection('booking');
  };

  const handleSaveBooking = (newBooking: BookingRecord) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  const handleCancelBooking = (reference: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.reference === reference ? { ...b, status: 'Cancelled' } : b))
    );
  };

  const handleDeleteBooking = (reference: string) => {
    setBookings((prev) => prev.filter((b) => b.reference !== reference));
  };

  const filteredGallery =
    galleryFilter === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === galleryFilter);

  const sizeSurcharge =
    pricingPreviewSize === 'SUV' ? 40 : pricingPreviewSize === 'Truck' ? 55 : 0;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) return;
    setContactSent(true);
    setContactName('');
    setContactPhone('');
    setContactMessage('');
  };

  const activeBookingsCount = bookings.filter((b) => b.status === 'Confirmed').length;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F3EFE8] flex flex-col selection:bg-[#A50F1B] selection:text-[#F3EFE8]">
      {/* LOADING SCREEN WITH ANIMATED SVG CREST */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => setShowSplash(false)}
            className="fixed inset-0 z-[100] bg-[#000000] flex flex-col items-center justify-center p-6 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center"
            >
              <YgoLogo variant="badge" className="w-40 h-40 mb-4" />
              <div className="w-44 h-0.5 bg-[#1C1C1C] overflow-hidden">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 0.65, ease: 'easeInOut' }}
                  className="w-full h-full bg-gradient-to-r from-transparent via-[#D91E2E] to-transparent"
                />
              </div>
              <p className="mt-3 text-[11px] font-mono-tabular uppercase tracking-[0.28em] text-[#9A9A9F]">
                YGO DETAILING · EST. 2024 · 209 AREA
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. TOP NAVIGATION BAR (Strict 3-Zone Top Bar Contract) */}
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#A50F1B]/40 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
            : 'bg-gradient-to-b from-black/90 to-transparent py-4 border-b border-[#C9CCD1]/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark & Crest (Single Element) */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('home');
            }}
            className="focus-visible:outline-2 focus-visible:outline-[#D91E2E]"
          >
            <YgoLogo variant="navbar" />
          </a>

          {/* Zone 2: 5 Clean Navigation Links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden lg:flex items-center gap-8 text-xs font-semibold uppercase tracking-[0.16em] text-[#C9CCD1]"
          >
            <a
              href="#services"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('services');
              }}
              className="hover:text-[#F3EFE8] py-1 border-b-2 border-transparent hover:border-[#D91E2E] transition-colors whitespace-nowrap"
            >
              Services
            </a>
            <a
              href="#packages"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('packages');
              }}
              className="hover:text-[#F3EFE8] py-1 border-b-2 border-transparent hover:border-[#D91E2E] transition-colors whitespace-nowrap"
            >
              Packages
            </a>
            <a
              href="#gallery"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('gallery');
              }}
              className="hover:text-[#F3EFE8] py-1 border-b-2 border-transparent hover:border-[#D91E2E] transition-colors whitespace-nowrap"
            >
              Gallery
            </a>
            <a
              href="#reviews"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('reviews');
              }}
              className="hover:text-[#F3EFE8] py-1 border-b-2 border-transparent hover:border-[#D91E2E] transition-colors whitespace-nowrap"
            >
              Reviews
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('contact');
              }}
              className="hover:text-[#F3EFE8] py-1 border-b-2 border-transparent hover:border-[#D91E2E] transition-colors whitespace-nowrap"
            >
              Contact
            </a>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMyBookingsOpen(true)}
              className="px-3.5 py-2 bg-[#141414] hover:bg-[#1C1C1C] text-[#F3EFE8] text-xs font-mono-tabular uppercase tracking-wider border border-[#C9CCD1]/20 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-[#E8B84A]" />
              <span className="hidden sm:inline">My Bookings</span>
              <span>({activeBookingsCount})</span>
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('booking')}
              className="btn-shine px-5 py-2.5 bg-[#A50F1B] hover:bg-[#D91E2E] text-[#F3EFE8] text-xs font-semibold uppercase tracking-[0.14em] border border-[#D91E2E] shadow-[0_0_20px_rgba(165,15,27,0.55)] transition-all cursor-pointer whitespace-nowrap"
            >
              Book Now
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden p-2 bg-[#141414] text-[#F3EFE8] border border-[#C9CCD1]/20 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0A0A0A] border-b border-[#A50F1B]/50 px-6 py-5 space-y-3">
            {[
              { id: 'home', label: 'Home' },
              { id: 'services', label: 'Services' },
              { id: 'packages', label: 'Packages & Pricing' },
              { id: 'gallery', label: 'Before / After Gallery' },
              { id: 'booking', label: 'Book Appointment' },
              { id: 'reviews', label: 'Client Reviews' },
              { id: 'contact', label: 'Contact & 209 Area Info' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left py-2 font-display text-xl tracking-wider uppercase text-[#F3EFE8] hover:text-[#D91E2E] border-b border-[#C9CCD1]/10"
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* 2. HERO SECTION (Full-Screen Dark Cinematic Background + Light Sweep Shine) */}
      <section
        id="home"
        className="relative min-h-screen pt-28 pb-16 flex flex-col justify-between overflow-hidden hero-shine-sweep"
      >
        {/* Background Classic Crimson Car Image with Measured Contrast Scrim */}
        <div className="absolute inset-0 z-0 bg-[#000000]">
          <img
            src={BRAND_IMAGES.heroClassicCar}
            alt="Vintage crimson red classic muscle car inside YGO Detailing luxury dark garage studio"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-55 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#000000] via-[#0A0A0A]/85 to-[#5E0A10]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#000000]/80" />
        </div>

        {/* Main Hero Content Grid */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left 8 Columns: Editorial Kicker, Headline, CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-8"
            >
              {/* Unboxed Metadata Kicker (Zero-Pill Discipline) */}
              <div className="flex flex-wrap items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#C9CCD1] mb-4">
                <span className="font-retro italic text-[#E8B84A] text-sm tracking-widest normal-case">
                  Est. 2024
                </span>
                <span aria-hidden="true" className="text-[#A50F1B]">
                  ·
                </span>
                <span>209 Area, California</span>
                <span aria-hidden="true" className="text-[#A50F1B]">
                  ·
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#F3EFE8] font-mono-tabular">
                  <span className="text-[#E8B84A]">★★★★★</span> 5.0 from 50+ happy customers
                </span>
              </div>

              {/* Main Display Headline */}
              <h1 className="font-display text-5xl sm:text-7xl lg:text-[84px] leading-[0.94] uppercase tracking-[0.04em] text-chrome max-w-3xl mb-6">
                Where Every Ride Gets the{' '}
                <span className="text-crimson-chrome">Royal Shine</span>
              </h1>

              {/* Concrete Value Proposition Subtext */}
              <p className="text-base sm:text-lg text-[#C9CCD1] max-w-2xl leading-relaxed mb-8">
                Concierge multi-stage paint correction, 9H liquid quartz ceramic armor, and 212°F steam interior restoration. Crafted for classic muscle, exotic sports cars, and daily drivers in our 209 Studio or at your driveway.
              </p>

              {/* Two CTAs: Primary Crimson + Secondary Silver Frame */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => scrollToSection('booking')}
                  className="btn-shine px-8 py-4 bg-[#A50F1B] hover:bg-[#D91E2E] text-[#F3EFE8] text-sm font-semibold uppercase tracking-[0.16em] border border-[#D91E2E] shadow-[0_0_35px_rgba(165,15,27,0.7)] flex items-center gap-3 transition-all cursor-pointer whitespace-nowrap"
                >
                  Book Your Detail Now
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection('services')}
                  className="px-7 py-4 bg-[#141414]/90 hover:bg-[#1C1C1C] text-[#F3EFE8] text-sm font-semibold uppercase tracking-[0.16em] border border-[#C9CCD1]/30 hover:border-[#C9CCD1]/60 transition-colors cursor-pointer whitespace-nowrap"
                >
                  Explore Services & Pricing
                </button>
              </div>
            </motion.div>

            {/* Right 4 Columns: Vintage Circular SVG Crest Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-4 flex flex-col items-center lg:items-end"
            >
              <div className="p-6 bg-[#0A0A0A]/85 backdrop-blur-md border border-[#A50F1B]/50 flex flex-col items-center text-center max-w-xs w-full shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
                <YgoLogo variant="badge" className="w-44 h-44 mb-4" />
                <p className="font-retro italic text-sm text-[#E8B84A] mb-1">
                  &ldquo;Showroom Perfection, Zero Shortcuts&rdquo;
                </p>
                <p className="text-xs text-[#9A9A9F] font-mono-tabular">
                  STUDIO BAY & MOBILE VAN · +1 (209) 555-0142
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Animated Stat Counters Bar at Bottom of Hero */}
        <div
          ref={statsRef}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 border-t border-[#C9CCD1]/15"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <span className="font-mono-tabular text-3xl sm:text-4xl font-semibold text-[#F3EFE8] block">
                {countersStarted ? '50+' : '0'} <span className="text-[#E8B84A] text-2xl">★★★★★</span>
              </span>
              <span className="text-xs uppercase tracking-widest text-[#9A9A9F] mt-1 block">
                Verified 5-Star Reviews in 209
              </span>
            </div>

            <div>
              <span className="font-mono-tabular text-3xl sm:text-4xl font-semibold text-[#F3EFE8] block">
                {countersStarted ? '500+' : '0'}
              </span>
              <span className="text-xs uppercase tracking-widest text-[#9A9A9F] mt-1 block">
                Classic & Modern Cars Detailed
              </span>
            </div>

            <div>
              <span className="font-mono-tabular text-3xl sm:text-4xl font-semibold text-[#D91E2E] block">
                {countersStarted ? '100%' : '0%'}
              </span>
              <span className="text-xs uppercase tracking-widest text-[#9A9A9F] mt-1 block">
                LED Walk-Around Satisfaction Guarantee
              </span>
            </div>

            <div>
              <span className="font-mono-tabular text-3xl sm:text-4xl font-semibold text-[#F3EFE8] block">
                EST. 2024
              </span>
              <span className="text-xs uppercase tracking-widest text-[#9A9A9F] mt-1 block">
                Serving Stockton, Modesto, Tracy & Lodi
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* INFINITE MARQUEE STRIP OF SERVICE KEYWORDS */}
      <div className="bg-[#141414] border-y border-[#A50F1B]/45 py-3.5 overflow-hidden select-none">
        <div className="animate-marquee flex items-center gap-8">
          {[...MARQUEE_KEYWORDS, ...MARQUEE_KEYWORDS].map((kw, index) => (
            <div key={`${kw}-${index}`} className="flex items-center gap-8 shrink-0">
              <span className="font-display text-xl tracking-[0.18em] uppercase text-[#F3EFE8]">
                {kw}
              </span>
              <span className="text-[#D91E2E] text-sm" aria-hidden="true">
                ★
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. TRUST BAR (4 Architectural Pillars) */}
      <section className="py-16 bg-[#0A0A0A] border-b border-[#C9CCD1]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                className="p-6 bg-[#141414] border border-[#C9CCD1]/15 hover:border-[#A50F1B] transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono-tabular text-[#D91E2E] mb-3">
                    <span>STANDARD {pillar.number}</span>
                    <Shield className="w-4 h-4 text-[#E8B84A]" />
                  </div>
                  <h2 className="font-display text-2xl text-[#F3EFE8] uppercase tracking-wider mb-2">
                    {pillar.title}
                  </h2>
                  <p className="text-xs text-[#9A9A9F] leading-relaxed mb-4">
                    {pillar.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#C9CCD1]/10 text-[11px] font-mono-tabular text-[#C9CCD1]">
                  {pillar.metric}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SERVICES SECTION (8 Specialist Detailing Capabilities) */}
      <section id="services" className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-xs font-mono-tabular uppercase tracking-[0.22em] text-[#D91E2E] mb-2">
                01 · CRAFT & CAPABILITIES
              </p>
              <h2 className="font-display text-4xl sm:text-6xl text-chrome uppercase tracking-wider">
                Precision Automotive Services
              </h2>
            </div>
            <p className="text-sm text-[#9A9A9F] max-w-md">
              Every treatment starts with an ultrasonic paint depth reading and deionized water decontamination. Select any service below to load it directly into the booking calculator.
            </p>
          </div>

          {/* 8 Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES_LIST.map((srv) => (
              <motion.article
                key={srv.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35 }}
                className="bg-[#141414] border border-[#C9CCD1]/15 hover:border-[#D91E2E] p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 group"
              >
                <div>
                  {/* Unboxed Editorial Number & Category */}
                  <div className="flex items-center justify-between text-xs font-mono-tabular text-[#9A9A9F] mb-3">
                    <span>
                      {srv.number}. {srv.category.toUpperCase()}
                    </span>
                    <span className="text-[#C9CCD1]">{srv.duration}</span>
                  </div>

                  <h3 className="font-display text-2xl text-[#F3EFE8] group-hover:text-[#D91E2E] transition-colors uppercase tracking-wider mb-2">
                    {srv.title}
                  </h3>

                  <p className="text-xs text-[#9A9A9F] leading-relaxed mb-4">
                    {srv.shortDesc}
                  </p>

                  {/* Concrete Outcome Metric */}
                  <div className="py-2 px-3 bg-[#0A0A0A] border-l-2 border-[#A50F1B] text-[11px] font-mono-tabular text-[#E8B84A] mb-4">
                    {srv.outcomeMetric}
                  </div>

                  <ul className="space-y-1.5 mb-6">
                    {srv.highlights.map((item) => (
                      <li key={item} className="text-xs text-[#C9CCD1] flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#D91E2E] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#C9CCD1]/15 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono-tabular uppercase text-[#9A9A9F] block">
                      STARTING AT
                    </span>
                    <span className="font-mono-tabular text-2xl font-semibold text-[#F3EFE8]">
                      ${srv.price}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBookStandaloneService(srv.id)}
                    className="px-3.5 py-2 bg-[#1C1C1C] group-hover:bg-[#A50F1B] text-[#F3EFE8] text-xs font-semibold uppercase tracking-wider border border-[#C9CCD1]/20 group-hover:border-[#D91E2E] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Book Service →
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PACKAGES / PRICING SECTION (3 Signature Tiers + Pre-Selection into Booking Form) */}
      <section id="packages" className="py-24 bg-[#141414] border-y border-[#C9CCD1]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-xs font-mono-tabular uppercase tracking-[0.22em] text-[#D91E2E] mb-2">
                02 · TRANSPARENT TIERED PRICING
              </p>
              <h2 className="font-display text-4xl sm:text-6xl text-chrome uppercase tracking-wider">
                Signature Detailing Packages
              </h2>
            </div>

            {/* Interactive Vehicle Size Price Preview Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="text-xs font-mono-tabular uppercase tracking-wider text-[#9A9A9F]">
                Preview Price By Vehicle Size:
              </span>
              <div className="inline-flex bg-[#0A0A0A] p-1 border border-[#C9CCD1]/20 self-start">
                {(['Sedan', 'SUV', 'Truck'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setPricingPreviewSize(sz)}
                    className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap ${
                      pricingPreviewSize === sz
                        ? 'bg-[#A50F1B] text-[#F3EFE8]'
                        : 'text-[#9A9A9F] hover:text-[#F3EFE8]'
                    }`}
                  >
                    {sz === 'Sedan' ? 'Coupe / Sedan' : sz === 'SUV' ? 'Mid / Full SUV' : 'Truck / Van'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Package Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {PACKAGES_LIST.map((pkg) => {
              const displayPrice = pkg.basePrice + sizeSurcharge;
              return (
                <div
                  key={pkg.id}
                  className={`bg-[#0A0A0A] p-8 flex flex-col justify-between transition-all duration-200 ${
                    pkg.popular
                      ? 'border-2 border-[#D91E2E] shadow-[0_0_45px_rgba(165,15,27,0.3)] relative'
                      : 'border border-[#C9CCD1]/20 hover:border-[#C9CCD1]/45'
                  }`}
                >
                  <div>
                    {/* Clean Unboxed Kicker Line */}
                    <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-[#C9CCD1]/15 text-xs font-mono-tabular">
                      <span className="text-[#9A9A9F] uppercase">{pkg.duration}</span>
                      {pkg.popular ? (
                        <span className="text-[#E8B84A] font-semibold uppercase tracking-widest">
                          ★ MOST POPULAR CHOICE
                        </span>
                      ) : (
                        <span className="text-[#C9CCD1] uppercase">STUDIO OR MOBILE</span>
                      )}
                    </div>

                    <h3 className="font-display text-4xl text-[#F3EFE8] uppercase tracking-wider">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-[#9A9A9F] mt-1 mb-6">{pkg.tagline}</p>

                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="font-mono-tabular text-5xl font-semibold text-[#F3EFE8]">
                        ${displayPrice}
                      </span>
                      <span className="text-xs font-mono-tabular text-[#9A9A9F] uppercase">
                        / {pricingPreviewSize} Rate
                      </span>
                    </div>
                    <p className="text-xs text-[#C9CCD1] mb-6 pb-6 border-b border-[#C9CCD1]/15">
                      Ideal for: {pkg.idealFor}
                    </p>

                    {/* Checklist */}
                    <ul className="space-y-3 mb-8">
                      {pkg.features.map((feat) => (
                        <li key={feat} className="text-xs text-[#F3EFE8] flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-[#D91E2E] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleBookPackage(pkg.id)}
                    className={`btn-shine w-full py-4 text-xs font-semibold uppercase tracking-[0.16em] transition-all cursor-pointer whitespace-nowrap ${
                      pkg.popular
                        ? 'bg-[#A50F1B] hover:bg-[#D91E2E] text-[#F3EFE8] border border-[#D91E2E] shadow-[0_0_25px_rgba(165,15,27,0.5)]'
                        : 'bg-[#1C1C1C] hover:bg-[#A50F1B] text-[#F3EFE8] border border-[#C9CCD1]/25 hover:border-[#D91E2E]'
                    }`}
                  >
                    Book This Package (${displayPrice}) →
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. BEFORE / AFTER GALLERY & MASONRY SHOWCASE WITH LIGHTBOX */}
      <section id="gallery" className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-mono-tabular uppercase tracking-[0.22em] text-[#D91E2E] mb-2">
                03 · VERIFIED STUDIO RESULTS
              </p>
              <h2 className="font-display text-4xl sm:text-6xl text-chrome uppercase tracking-wider">
                Before & After Transformations
              </h2>
            </div>
            <p className="text-sm text-[#9A9A9F] max-w-md">
              Drag the interactive inspection slider below to compare oxidized, swirl-marred paintwork against our two-stage jewel polish and 9H liquid ceramic finish.
            </p>
          </div>

          {/* Interactive Drag-to-Compare Slider */}
          <div className="mb-20">
            <BeforeAfterSlider onBookTransformation={handleBookPackage} />
          </div>

          {/* Filterable Portfolio Grid Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pt-8 border-t border-[#C9CCD1]/15">
            <div>
              <h3 className="font-display text-3xl text-[#F3EFE8] uppercase tracking-wider">
                Recent 209 Studio & Mobile Portfolio
              </h3>
              <p className="text-xs text-[#9A9A9F]">
                Click any project card to inspect full-resolution telemetry and treatment specs.
              </p>
            </div>

            {/* Interactive Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {['All', 'Classic Restoration', 'Ceramic Coating', 'Paint Correction', 'Interior Detail'].map(
                (cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setGalleryFilter(cat)}
                    className={`px-3.5 py-2 text-xs font-semibold uppercase tracking-wider border transition-colors cursor-pointer whitespace-nowrap ${
                      galleryFilter === cat
                        ? 'bg-[#A50F1B] text-[#F3EFE8] border-[#D91E2E]'
                        : 'bg-[#141414] text-[#9A9A9F] border-[#C9CCD1]/15 hover:text-[#F3EFE8]'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Asymmetric Bento / Masonry Photo Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {filteredGallery.map((item, idx) => {
              const spanClass =
                idx === 0 && galleryFilter === 'All'
                  ? 'md:col-span-7'
                  : idx === 1 && galleryFilter === 'All'
                  ? 'md:col-span-5'
                  : 'md:col-span-4';

              return (
                <div
                  key={item.id}
                  onClick={() => setLightboxItem(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setLightboxItem(item);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Inspect ${item.title}`}
                  className={`${spanClass} group relative bg-[#141414] border border-[#C9CCD1]/15 hover:border-[#D91E2E] overflow-hidden cursor-pointer flex flex-col justify-end min-h-[320px]`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/20" />

                  <div className="absolute top-4 right-4 w-9 h-9 bg-black/75 border border-[#C9CCD1]/25 flex items-center justify-center text-[#F3EFE8] group-hover:bg-[#A50F1B] group-hover:border-[#D91E2E] transition-colors">
                    <Maximize2 className="w-4 h-4" />
                  </div>

                  <div className="relative z-10 p-6">
                    <div className="flex items-center gap-2 text-[11px] font-mono-tabular uppercase tracking-wider text-[#E8B84A] mb-1">
                      <span>{item.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.duration}</span>
                    </div>
                    <h4 className="font-display text-2xl text-[#F3EFE8] uppercase tracking-wider">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#C9CCD1] mt-1">{item.vehicle}</p>
                    <p className="text-[11px] font-mono-tabular text-[#9A9A9F] mt-2 pt-2 border-t border-[#C9CCD1]/15">
                      {item.metric}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS (4 Animated Editorial Steps) */}
      <section className="py-20 bg-[#141414] border-y border-[#C9CCD1]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-mono-tabular uppercase tracking-[0.22em] text-[#D91E2E] mb-2">
              04 · STREAMLINED PROCESS
            </p>
            <h2 className="font-display text-4xl sm:text-5xl text-chrome uppercase tracking-wider">
              How Your Royal Shine Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS_STEPS.map((item) => (
              <div
                key={item.step}
                className="bg-[#0A0A0A] border border-[#C9CCD1]/15 p-6 flex flex-col justify-between relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display text-4xl text-[#D91E2E]">{item.step}</span>
                    <Sparkles className="w-4 h-4 text-[#E8B84A]" />
                  </div>
                  <h3 className="font-display text-2xl text-[#F3EFE8] uppercase tracking-wider mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#9A9A9F] leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>
                <p className="text-[11px] font-mono-tabular text-[#C9CCD1] pt-3 border-t border-[#C9CCD1]/10">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CORE FEATURE: MULTI-STEP BOOKING SYSTEM */}
      <section id="booking" className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-xs font-mono-tabular uppercase tracking-[0.22em] text-[#D91E2E] mb-2">
                05 · ONLINE RESERVATION & LIVE ESTIMATOR
              </p>
              <h2 className="font-display text-4xl sm:text-6xl text-chrome uppercase tracking-wider">
                Schedule Your Detailing Bay or Mobile Van
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMyBookingsOpen(true)}
                className="px-4 py-2.5 bg-[#141414] hover:bg-[#1C1C1C] text-[#F3EFE8] text-xs font-mono-tabular uppercase tracking-wider border border-[#C9CCD1]/25 flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
              >
                <CalendarCheck className="w-4 h-4 text-[#E8B84A]" />
                View My Saved Bookings ({bookings.length})
              </button>
            </div>
          </div>

          <BookingSystem
            selectedPackageId={selectedPackageId}
            selectedServiceId={selectedServiceId}
            onSelectPackage={(pkgId) => {
              setSelectedServiceId(null);
              setSelectedPackageId(pkgId);
            }}
            onClearStandaloneService={() => setSelectedServiceId(null)}
            bookings={bookings}
            onSaveBooking={handleSaveBooking}
            onOpenMyBookings={() => setIsMyBookingsOpen(true)}
          />
        </div>
      </section>

      {/* 9. CLIENT REVIEWS & TESTIMONIAL CAROUSEL (5.0 Average · 50+ Reviews) */}
      <section
        id="reviews"
        className="py-24 bg-[#141414] border-y border-[#C9CCD1]/15"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Rating Summary Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-xs font-mono-tabular uppercase tracking-[0.22em] text-[#D91E2E] mb-2">
                06 · VERIFIED 209 AREA REPUTATION
              </p>
              <h2 className="font-display text-4xl sm:text-6xl text-chrome uppercase tracking-wider">
                5.0 <span className="text-[#E8B84A]">★★★★★</span> From 50+ Happy Customers
              </h2>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setActiveReviewIndex(
                    (prev) => (prev - 1 + REVIEWS_LIST.length) % REVIEWS_LIST.length
                  )
                }
                aria-label="Previous testimonial"
                className="w-11 h-11 bg-[#0A0A0A] hover:bg-[#A50F1B] text-[#F3EFE8] border border-[#C9CCD1]/25 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs font-mono-tabular text-[#C9CCD1] px-2">
                0{activeReviewIndex + 1} / 0{REVIEWS_LIST.length}
              </span>
              <button
                type="button"
                onClick={() =>
                  setActiveReviewIndex((prev) => (prev + 1) % REVIEWS_LIST.length)
                }
                aria-label="Next testimonial"
                className="w-11 h-11 bg-[#0A0A0A] hover:bg-[#A50F1B] text-[#F3EFE8] border border-[#C9CCD1]/25 flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Featured Active Carousel Spotlight + 3-Card Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Spotlight Active Review (Left 5 Columns) */}
            <div className="lg:col-span-5 bg-[#0A0A0A] border-2 border-[#A50F1B] p-8 flex flex-col justify-between shadow-[0_0_35px_rgba(165,15,27,0.2)]">
              <div>
                <div className="flex items-center justify-between text-xs font-mono-tabular mb-4">
                  <span className="text-[#E8B84A] tracking-widest">★★★★★ 5.0 VERIFIED</span>
                  <span className="text-[#9A9A9F]">{REVIEWS_LIST[activeReviewIndex].date}</span>
                </div>

                <blockquote className="text-base sm:text-lg text-[#F3EFE8] leading-relaxed mb-6">
                  &ldquo;{REVIEWS_LIST[activeReviewIndex].quote}&rdquo;
                </blockquote>

                <div className="p-3.5 bg-[#141414] border-l-2 border-[#D91E2E] text-xs font-mono-tabular text-[#E8B84A] mb-6">
                  Outcome: {REVIEWS_LIST[activeReviewIndex].outcome}
                </div>
              </div>

              <div className="pt-4 border-t border-[#C9CCD1]/15">
                <p className="font-display text-2xl text-[#F3EFE8] uppercase tracking-wider">
                  {REVIEWS_LIST[activeReviewIndex].name}
                </p>
                <p className="text-xs text-[#9A9A9F]">
                  {REVIEWS_LIST[activeReviewIndex].roleOrCity} ·{' '}
                  <span className="text-[#C9CCD1]">{REVIEWS_LIST[activeReviewIndex].vehicle}</span>
                </p>
              </div>
            </div>

            {/* All 6 Reviews Selector List (Right 7 Columns) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {REVIEWS_LIST.map((rev, idx) => {
                const isSelected = idx === activeReviewIndex;
                return (
                  <button
                    key={rev.id}
                    type="button"
                    onClick={() => setActiveReviewIndex(idx)}
                    className={`text-left p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#1C1C1C] border-[#D91E2E]'
                        : 'bg-[#0A0A0A] border-[#C9CCD1]/15 hover:border-[#C9CCD1]/35'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono-tabular mb-2">
                        <span className="text-[#E8B84A]">★★★★★</span>
                        <span className="text-[#9A9A9F]">{rev.service}</span>
                      </div>
                      <p className="text-xs text-[#C9CCD1] line-clamp-3 mb-3">
                        &ldquo;{rev.quote}&rdquo;
                      </p>
                    </div>
                    <div className="pt-2 border-t border-[#C9CCD1]/10">
                      <p className="text-xs font-semibold text-[#F3EFE8]">{rev.name}</p>
                      <p className="text-[11px] text-[#9A9A9F] truncate">{rev.vehicle}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 10. FAQ & CONTACT SECTION (209 Area Studio & Direct Concierge Line) */}
      <section id="contact" className="py-24 bg-[#0A0A0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left 6 Columns: Frequently Asked Questions */}
            <div className="lg:col-span-6">
              <p className="text-xs font-mono-tabular uppercase tracking-[0.22em] text-[#D91E2E] mb-2">
                07 · STUDIO & MOBILE FAQ
              </p>
              <h2 className="font-display text-4xl sm:text-5xl text-chrome uppercase tracking-wider mb-8">
                Detailing Questions Answered
              </h2>

              <div className="space-y-3">
                {FAQ_ITEMS.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={faq.question}
                      className="bg-[#141414] border border-[#C9CCD1]/15"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <span className="font-display text-xl text-[#F3EFE8] uppercase tracking-wider">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#D91E2E] shrink-0 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs text-[#9A9A9F] leading-relaxed border-t border-[#C9CCD1]/10">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right 6 Columns: Direct 209 Area Contact & Callback Request */}
            <div className="lg:col-span-6">
              <p className="text-xs font-mono-tabular uppercase tracking-[0.22em] text-[#D91E2E] mb-2">
                08 · DIRECT CONCIERGE DISPATCH
              </p>
              <h2 className="font-display text-4xl sm:text-5xl text-chrome uppercase tracking-wider mb-6">
                Contact YGO Detailing
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <a
                  href="tel:+12095550142"
                  className="p-5 bg-[#141414] border border-[#C9CCD1]/15 hover:border-[#D91E2E] transition-colors block"
                >
                  <Phone className="w-5 h-5 text-[#D91E2E] mb-2" />
                  <span className="text-[11px] font-mono-tabular uppercase text-[#9A9A9F] block">
                    CALL OR TEXT 209 DISPATCH
                  </span>
                  <span className="font-mono-tabular text-lg font-semibold text-[#F3EFE8] mt-0.5 block">
                    +1 (209) 555-0142
                  </span>
                </a>

                <a
                  href="mailto:hello@ygodetailing.com"
                  className="p-5 bg-[#141414] border border-[#C9CCD1]/15 hover:border-[#D91E2E] transition-colors block"
                >
                  <Mail className="w-5 h-5 text-[#D91E2E] mb-2" />
                  <span className="text-[11px] font-mono-tabular uppercase text-[#9A9A9F] block">
                    EMAIL STUDIO CONCIERGE
                  </span>
                  <span className="font-mono-tabular text-sm font-semibold text-[#F3EFE8] mt-1 block">
                    hello@ygodetailing.com
                  </span>
                </a>

                <div className="p-5 bg-[#141414] border border-[#C9CCD1]/15">
                  <MapPin className="w-5 h-5 text-[#D91E2E] mb-2" />
                  <span className="text-[11px] font-mono-tabular uppercase text-[#9A9A9F] block">
                    STUDIO & SERVICE TERRITORY
                  </span>
                  <span className="text-xs font-semibold text-[#F3EFE8] mt-1 block">
                    209 Area, California, USA (Stockton · Modesto · Tracy · Lodi · Manteca)
                  </span>
                </div>

                <div className="p-5 bg-[#141414] border border-[#C9CCD1]/15">
                  <Clock className="w-5 h-5 text-[#D91E2E] mb-2" />
                  <span className="text-[11px] font-mono-tabular uppercase text-[#9A9A9F] block">
                    OPERATING HOURS
                  </span>
                  <span className="text-xs font-semibold text-[#F3EFE8] mt-1 block">
                    Mon – Sat: 8:00 AM – 7:00 PM · Sun: Studio Curing
                  </span>
                </div>
              </div>

              {/* Quick Custom Quote / Callback Form */}
              <div className="p-6 bg-[#141414] border border-[#A50F1B]/45">
                <h3 className="font-display text-2xl text-[#F3EFE8] uppercase tracking-wider mb-1">
                  Have a Classic Restoration or Fleet Inquiry?
                </h3>
                <p className="text-xs text-[#9A9A9F] mb-4">
                  Leave your name and 209 number for a callback within 15 minutes.
                </p>

                {contactSent ? (
                  <div className="p-4 bg-[#0A0A0A] border border-[#E8B84A] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs text-[#F3EFE8]">
                      <CheckCircle2 className="w-5 h-5 text-[#E8B84A] shrink-0" />
                      <span>
                        Inquiry received! Our lead detailer will call or text you shortly.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setContactSent(false)}
                      className="text-xs font-mono-tabular underline text-[#C9CCD1] cursor-pointer whitespace-nowrap"
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Your Name *"
                        aria-label="Your Name"
                        className="px-3.5 py-2.5 bg-[#0A0A0A] border border-[#C9CCD1]/25 text-xs text-[#F3EFE8] focus:border-[#D91E2E] focus:outline-none"
                      />
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="Phone Number *"
                        aria-label="Phone Number"
                        className="px-3.5 py-2.5 bg-[#0A0A0A] border border-[#C9CCD1]/25 text-xs text-[#F3EFE8] focus:border-[#D91E2E] focus:outline-none font-mono-tabular"
                      />
                    </div>
                    <input
                      type="text"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Vehicle year/make & question (e.g. wet sanding on 1968 Mustang)"
                      aria-label="Vehicle and question"
                      className="w-full px-3.5 py-2.5 bg-[#0A0A0A] border border-[#C9CCD1]/25 text-xs text-[#F3EFE8] focus:border-[#D91E2E] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-[#A50F1B] hover:bg-[#D91E2E] text-[#F3EFE8] text-xs font-semibold uppercase tracking-wider border border-[#D91E2E] flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Request Callback
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. QUIET ARCHITECTURAL FOOTER WITH VINTAGE BADGE */}
      <footer className="bg-[#000000] border-t border-[#A50F1B]/45 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#C9CCD1]/15">
            {/* Col 1: SVG Crest + Tagline */}
            <div className="md:col-span-5 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <YgoLogo variant="badge" className="w-28 h-28 shrink-0" />
              <div>
                <p className="font-display text-3xl text-[#F3EFE8] uppercase tracking-wider">
                  YGO Detailing
                </p>
                <p className="font-retro italic text-xs text-[#E8B84A] mb-2">
                  Est. 2024 · Where Every Ride Gets the Royal Shine
                </p>
                <p className="text-xs text-[#9A9A9F] max-w-xs">
                  Premium Car Detailing, Paint Correction & 9H Ceramic Coating across the 209 Area, California.
                </p>
              </div>
            </div>

            {/* Col 2: Navigation Mirror */}
            <div className="md:col-span-4">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#C9CCD1] mb-3">
                NAVIGATION
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#9A9A9F]">
                <a href="#home" className="hover:text-[#F3EFE8] transition-colors">
                  Home
                </a>
                <a href="#services" className="hover:text-[#F3EFE8] transition-colors">
                  Services
                </a>
                <a href="#packages" className="hover:text-[#F3EFE8] transition-colors">
                  Pricing Packages
                </a>
                <a href="#gallery" className="hover:text-[#F3EFE8] transition-colors">
                  Before & After
                </a>
                <a href="#booking" className="hover:text-[#F3EFE8] transition-colors">
                  Online Booking
                </a>
                <a href="#reviews" className="hover:text-[#F3EFE8] transition-colors">
                  5.0 ★ Reviews
                </a>
              </div>
            </div>

            {/* Col 3: Social & Direct Contact */}
            <div className="md:col-span-3">
              <p className="text-xs font-mono-tabular uppercase tracking-widest text-[#C9CCD1] mb-3">
                CONNECT IN THE 209
              </p>
              <p className="text-xs text-[#F3EFE8] font-mono-tabular mb-1">+1 (209) 555-0142</p>
              <p className="text-xs text-[#9A9A9F] mb-4">hello@ygodetailing.com</p>
              <div className="flex items-center gap-4 text-xs font-mono-tabular uppercase tracking-wider text-[#C9CCD1]">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('contact');
                  }}
                  className="hover:text-[#D91E2E] transition-colors"
                >
                  Instagram
                </a>
                <span aria-hidden="true" className="text-[#A50F1B]">
                  ·
                </span>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('contact');
                  }}
                  className="hover:text-[#D91E2E] transition-colors"
                >
                  TikTok
                </a>
                <span aria-hidden="true" className="text-[#A50F1B]">
                  ·
                </span>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('contact');
                  }}
                  className="hover:text-[#D91E2E] transition-colors"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9A9A9F]">
            <p>© {new Date().getFullYear()} YGO Detailing (Est. 2024). All rights reserved.</p>
            <p className="font-mono-tabular">
              209 AREA, CALIFORNIA · 5.0 ★★★★★ FROM 50+ HAPPY CUSTOMERS
            </p>
          </div>
        </div>
      </footer>

      {/* LIGHTBOX MODAL FOR GALLERY ITEMS */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="max-w-4xl w-full bg-[#141414] border border-[#A50F1B] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.95)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] bg-black">
              <img
                src={lightboxItem.image}
                alt={lightboxItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                aria-label="Close lightbox"
                className="absolute top-4 right-4 w-10 h-10 bg-black/80 hover:bg-[#A50F1B] text-[#F3EFE8] border border-[#C9CCD1]/30 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono-tabular uppercase text-[#E8B84A] mb-1">
                  <span>{lightboxItem.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{lightboxItem.duration}</span>
                  <span aria-hidden="true">·</span>
                  <span>{lightboxItem.metric}</span>
                </div>
                <h3
                  id="lightbox-title"
                  className="font-display text-3xl text-[#F3EFE8] uppercase tracking-wider"
                >
                  {lightboxItem.title}
                </h3>
                <p className="text-xs text-[#9A9A9F] mt-1 max-w-xl">{lightboxItem.description}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const pkgId = lightboxItem.packageId;
                  setLightboxItem(null);
                  handleBookPackage(pkgId);
                }}
                className="px-6 py-3.5 bg-[#A50F1B] hover:bg-[#D91E2E] text-[#F3EFE8] text-xs font-semibold uppercase tracking-wider border border-[#D91E2E] shrink-0 transition-colors cursor-pointer whitespace-nowrap"
              >
                Book Similar Treatment →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MY BOOKINGS DRAWER MODAL */}
      <MyBookingsModal
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
        onDeleteBooking={handleDeleteBooking}
        onStartNewBooking={() => scrollToSection('booking')}
      />
    </div>
  );
}
