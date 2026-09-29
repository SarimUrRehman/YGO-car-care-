export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  category: 'Exterior' | 'Interior' | 'Correction' | 'Protection';
  price: number;
  duration: string;
  shortDesc: string;
  outcomeMetric: string;
  highlights: string[];
}

export interface PackageTier {
  id: string;
  name: string;
  tagline: string;
  basePrice: number;
  duration: string;
  popular?: boolean;
  idealFor: string;
  features: string[];
}

export interface VehicleTypeOption {
  id: 'Sedan' | 'Coupe' | 'SUV' | 'Truck' | 'Van';
  label: 'Sedan' | 'Coupe' | 'SUV' | 'Truck' | 'Van';
  surcharge: number;
  examples: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  vehicle: string;
  category: 'Paint Correction' | 'Ceramic Coating' | 'Interior Detail' | 'Classic Restoration';
  image: string;
  duration: string;
  metric: string;
  description: string;
  packageId: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  roleOrCity: string;
  vehicle: string;
  service: string;
  rating: number;
  date: string;
  quote: string;
  outcome: string;
}

export interface BookingRecord {
  reference: string;
  createdAt: string;
  packageId: string;
  packageName: string;
  addonIds: string[];
  addonNames: string[];
  vehicleType: 'Sedan' | 'Coupe' | 'SUV' | 'Truck' | 'Van';
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  date: string;
  timeSlot: string;
  serviceLocation: 'shop' | 'mobile';
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  notes: string;
  totalPrice: number;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
}

export const BRAND_IMAGES = {
  heroClassicCar: '/src/assets/images/hero_classic_car_1790702933081.jpg',
  paintCorrectionBefore: '/src/assets/images/paint_correction_before_1790702946694.jpg',
  paintCorrectionAfter: '/src/assets/images/paint_correction_after_1790702958354.jpg',
  interiorShowcase: '/src/assets/images/interior_detail_showcase_1790702971073.jpg',
  ceramicProcess: '/src/assets/images/ceramic_coating_process_1790702983177.jpg',
};

export const MARQUEE_KEYWORDS = [
  '9H Ceramic Coating',
  'Multi-Stage Paint Correction',
  'Interior Steam Sanitization',
  'Headlight Restoration',
  'Engine Bay Detailing',
  '209 Mobile Concierge',
  'Odor & Pet Hair Extraction',
  'Classic & Show Car Prep',
  'Hydrophobic Glass Sealant',
];

export const TRUST_PILLARS = [
  {
    id: 'products',
    number: '01',
    title: 'Premium pH-Neutral Products',
    description: 'Dedicated German compounds, SiO2 ceramic sealants, and deionized spot-free water filtration on every panel.',
    metric: '100% Clear-Coat Safe',
  },
  {
    id: 'mobile',
    number: '02',
    title: 'Mobile Service Available',
    description: 'Fully self-contained mobile detailing van equipped with onboard power and deionized water across the 209 Area.',
    metric: 'Stockton · Modesto · Tracy · Lodi',
  },
  {
    id: 'guarantee',
    number: '03',
    title: '100% Satisfaction Guaranteed',
    description: 'Walk-around LED inspection before handover. If any spec misses our studio standard, we refine it on the spot.',
    metric: '5.0 ★ Across 50+ Verified Clients',
  },
  {
    id: 'detailers',
    number: '04',
    title: 'Experienced Paint Specialists',
    description: 'Trained in ultrasonic paint depth gauging, rotary & dual-action correction, and vintage classic lacquer care.',
    metric: '500+ Vehicles Restored Since 2024',
  },
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: 'srv-exterior-wash',
    number: '01',
    title: 'Exterior Wash & Wax',
    category: 'Exterior',
    price: 85,
    duration: '1.5 – 2 Hours',
    shortDesc: 'Two-bucket grit-guard hand wash, iron fallout decontamination, clay bar treatment, and carnuba-ceramic hybrid wax.',
    outcomeMetric: '3-Month Hydrophobic Shield',
    highlights: ['Foam cannon pre-soak', 'Deep barrel wheel & caliper cleaning', 'Hand-applied carnuba polymer sealant'],
  },
  {
    id: 'srv-interior-clean',
    number: '02',
    title: 'Interior Deep Clean',
    category: 'Interior',
    price: 145,
    duration: '2.5 – 3.5 Hours',
    shortDesc: '212°F dry-vapor steam sanitization, heated carpet extraction, and pH-balanced matte leather nourishment.',
    outcomeMetric: '99.9% Bacteria & Allergen Removal',
    highlights: ['Heated fabric & mat shampoo extraction', 'Air vent & crevice steam purge', 'UV-protective non-greasy leather balm'],
  },
  {
    id: 'srv-paint-correction',
    number: '03',
    title: 'Paint Correction & Polishing',
    category: 'Correction',
    price: 340,
    duration: '5 – 7 Hours',
    shortDesc: 'Precision machine compounding and jewel-stage polishing to eliminate swirl marks, oxidation, and random deep scratches.',
    outcomeMetric: '85% – 95% Swirl & Defect Removal',
    highlights: ['Digital ultrasonic paint thickness reading', 'Two-stage compound & jeweling polish', 'Isopropyl panel wipe inspection'],
  },
  {
    id: 'srv-ceramic-coating',
    number: '04',
    title: 'Ceramic Coating',
    category: 'Protection',
    price: 590,
    duration: '1 Full Day',
    shortDesc: 'Professional-grade 9H liquid quartz ceramic armor that bonds permanently to factory clear coat for unmatched candy gloss.',
    outcomeMetric: '3 to 5 Years Chemical & UV Armor',
    highlights: ['9H hardness scratch resistance', 'Extreme water-beading self-cleaning angle', 'Includes wheel face & windshield coating'],
  },
  {
    id: 'srv-headlight',
    number: '05',
    title: 'Headlight Restoration',
    category: 'Correction',
    price: 75,
    duration: '1 Hour',
    shortDesc: 'Multi-grit wet sanding, rotary compounding, and permanent UV ceramic clear-coat sealing for yellowed or hazy lenses.',
    outcomeMetric: '+140% Nighttime Beam Clarity',
    highlights: ['3-stage progressive wet sanding', 'Optical clarity machine polish', 'UV ceramic lens lock prevents re-yellowing'],
  },
  {
    id: 'srv-engine-bay',
    number: '06',
    title: 'Engine Bay Cleaning',
    category: 'Exterior',
    price: 65,
    duration: '1 Hour',
    shortDesc: 'Sensitive electronics masked, biodegradable citrus degreasing agitation, low-pressure rinse, and satin plastics dressing.',
    outcomeMetric: 'Show-Ready Satin Factory Finish',
    highlights: ['Alternator & intake safe masking', 'Hood liner & cowl degreasing', 'Non-sling OEM matte rubber conditioning'],
  },
  {
    id: 'srv-odor-pet',
    number: '07',
    title: 'Odor & Pet Hair Removal',
    category: 'Interior',
    price: 90,
    duration: '1.5 – 2 Hours',
    shortDesc: 'Electrostatic rubber grooming extraction of embedded pet fur followed by commercial ozone & chlorine-dioxide treatment.',
    outcomeMetric: '100% Neutralized Cabin Air',
    highlights: ['Multi-pass electrostatic fur extraction', 'Enzyme bio-spill neutralization', 'Ozone shock cabin cycle'],
  },
  {
    id: 'srv-full-detail',
    number: '08',
    title: 'Full Detail (Inside & Out)',
    category: 'Protection',
    price: 279,
    duration: '4 – 5 Hours',
    shortDesc: 'Our signature nose-to-tail transformation combining single-stage gloss enhancement polish with full steam interior restoration.',
    outcomeMetric: 'Complete Inside-Out Reset',
    highlights: ['Clay bar + 1-step gloss machine polish', 'Full heated interior carpet & seat extraction', 'Engine bay wipe-down & tire satin seal'],
  },
];

export const PACKAGES_LIST: PackageTier[] = [
  {
    id: 'pkg-basic',
    name: 'Basic Shine',
    tagline: 'Essential Maintenance & Express Cabin Refresh',
    basePrice: 149,
    duration: '2 – 2.5 Hours',
    idealFor: 'Daily drivers and bi-weekly maintenance in the 209',
    features: [
      'pH-Neutral Foam Cannon Pre-Soak & Two-Bucket Hand Wash',
      'Deep Wheel Barrel, Face & Brake Caliper Decontamination',
      'Microfiber Towel & Forced-Air Touchless Crevice Dry',
      '3-Month SiO2 Ceramic Spray Sealant & Satin Tire Dressing',
      'Full Interior Vacuum (Seats, Carpets, Trunk & Crevices)',
      'Interior Dash, Console & Door Panel UV Matte Wipe-Down',
      'Streak-Free Inside & Outside Optical Glass Cleaning',
    ],
  },
  {
    id: 'pkg-premium',
    name: 'Premium Detail',
    tagline: 'Complete Interior Steam Restoration & Decontamination',
    basePrice: 279,
    duration: '4 – 5 Hours',
    popular: true,
    idealFor: 'Vehicles needing deep interior extraction & paint smoothness',
    features: [
      'Everything in Basic Shine Package, plus:',
      'Iron Fallout Chemical Dissolution & Full Clay Bar Treatment',
      'Single-Stage Machine Gloss Enhancement Polish (+60% Gloss)',
      '6-Month Hydrophobic graphene-ceramic paint sealant',
      '212°F High-Temp Steam Sanitization of All Surfaces & Vents',
      'Heated Carpet & Upholstery Shampoo Extraction',
      'pH-Balanced Leather Deep Clean & Matte Conditioning Balm',
      'Door Jambs, Trunk Seals & Fuel Door Precision Detailing',
    ],
  },
  {
    id: 'pkg-ultimate',
    name: 'Ultimate Showroom',
    tagline: '2-Stage Paint Correction, 9H Ceramic & Concierge Reset',
    basePrice: 499,
    duration: '7 – 9 Hours',
    idealFor: 'Classic cars, black paintwork, and enthusiasts demanding perfection',
    features: [
      'Everything in Premium Detail Package, plus:',
      'Digital Paint Depth Gauge Inspection Across All Panels',
      'Two-Stage Machine Compounding & Jeweling (85–95% Swirl Removal)',
      '2-Year 9H Liquid Ceramic Coating on Paint, Trim & Wheels',
      'Hydrophobic Windshield & Side Glass Rain-Repellent Coating',
      'Full Engine Bay Degreasing & OEM Satin Compartment Dressing',
      'Headlight Optical Polish & UV Sealant Protection',
      'Commercial Ozone Cabin Odor Neutralization Cycle',
    ],
  },
];

export const ADDON_OPTIONS = [
  { id: 'addon-ceramic-upgrade', name: '3-Year 9H Ceramic Coating Upgrade', price: 240, duration: '+3 hrs' },
  { id: 'addon-paint-polish', name: '1-Stage Machine Swirl Removal Polish', price: 130, duration: '+2 hrs' },
  { id: 'addon-headlights', name: 'Headlight Restoration & UV Ceramic Seal', price: 65, duration: '+45 min' },
  { id: 'addon-engine', name: 'Engine Bay Steam & Satin Detail', price: 55, duration: '+45 min' },
  { id: 'addon-pet-odor', name: 'Heavy Pet Hair & Ozone Odor Treatment', price: 75, duration: '+1 hr' },
];

export const VEHICLE_TYPES: VehicleTypeOption[] = [
  { id: 'Coupe', label: 'Coupe', surcharge: 0, examples: 'Mustang, Corvette, 911, Camaro, BRZ' },
  { id: 'Sedan', label: 'Sedan', surcharge: 0, examples: 'Model 3, M3, Accord, Camry, Charger' },
  { id: 'SUV', label: 'SUV', surcharge: 40, examples: 'Model Y, Tahoe, X5, 4Runner, Escalade' },
  { id: 'Truck', label: 'Truck', surcharge: 55, examples: 'F-150, Silverado, RAM 1500, Tacoma' },
  { id: 'Van', label: 'Van', surcharge: 65, examples: 'Sprinter, Odyssey, Sienna, Transit' },
];

export const TIME_SLOTS = [
  { id: '08:00 AM', label: '08:00 AM', period: 'Morning Studio / Mobile Slot' },
  { id: '10:30 AM', label: '10:30 AM', period: 'Mid-Morning Slot' },
  { id: '01:00 PM', label: '01:00 PM', period: 'Afternoon Slot' },
  { id: '03:30 PM', label: '03:30 PM', period: 'Late Afternoon Slot' },
  { id: '05:30 PM', label: '05:30 PM', period: 'Evening Drop-Off Slot' },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: '1969 Crimson Restomod Two-Stage Correction',
    vehicle: '1969 Chevrolet Chevelle SS · 209 Studio',
    category: 'Classic Restoration',
    image: BRAND_IMAGES.heroClassicCar,
    duration: '9.5 Hours',
    metric: '94% Swirl Removal · 98.4 GU Gloss Reading',
    description: 'Full decontamination, two-stage rotary and dual-action jeweling polish on custom crimson lacquer, finished with 9H ceramic armor.',
    packageId: 'pkg-ultimate',
  },
  {
    id: 'gal-2',
    title: 'Hydrophobic 9H Ceramic Mirror Finish',
    vehicle: '2023 Dodge Charger SRT Hellcat · Stockton, CA',
    category: 'Ceramic Coating',
    image: BRAND_IMAGES.paintCorrectionAfter,
    duration: '8 Hours',
    metric: '115° Water Contact Bead Angle',
    description: 'Removed dealer-installed wash marring and locked in a wet obsidian-crimson reflection with our 5-year liquid quartz ceramic system.',
    packageId: 'pkg-ultimate',
  },
  {
    id: 'gal-3',
    title: 'Cockpit Steam & Perforated Leather Reset',
    vehicle: '2024 Porsche 911 Carrera S · Modesto, CA',
    category: 'Interior Detail',
    image: BRAND_IMAGES.interiorShowcase,
    duration: '4.5 Hours',
    metric: 'Zero Glossy Residue · Factory Matte OEM Finish',
    description: '212°F dry-vapor steam cleaning of deviated red stitching, carbon trim sanitization, and pH-neutral German leather conditioning.',
    packageId: 'pkg-premium',
  },
  {
    id: 'gal-4',
    title: 'Precision Suede Block Ceramic Application',
    vehicle: '2022 BMW M4 Competition · Tracy, CA',
    category: 'Ceramic Coating',
    image: BRAND_IMAGES.ceramicProcess,
    duration: '7.5 Hours',
    metric: '9H Hardness · 3-Year Warranty',
    description: 'Cross-hatch application of high-solids SiO2 ceramic coating inside our climate-controlled 209 Area detailing bay.',
    packageId: 'pkg-ultimate',
  },
  {
    id: 'gal-5',
    title: 'Pre-Correction Inspection Under Scangrip LED',
    vehicle: '2020 Ford Mustang GT · Manteca, CA',
    category: 'Paint Correction',
    image: BRAND_IMAGES.paintCorrectionBefore,
    duration: '6.5 Hours',
    metric: 'Eliminated 4 Years of Automated Tunnel Swirls',
    description: 'Before-stage documentation showing heavy spider-webbing and water-spot etching prior to our 2-stage microfiber cutting compound.',
    packageId: 'pkg-premium',
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Book Online in 60 Seconds',
    description: 'Select your package, vehicle size, and preferred date & time slot—choose either our 209 studio or mobile service at your driveway.',
    detail: 'Instant live price calculation with zero hidden fees',
  },
  {
    step: '02',
    title: 'We Confirm & Prep Your Bay',
    description: 'Receive an instant booking reference code. Our lead detailer confirms paint condition notes and preps bespoke pads & compounds.',
    detail: 'SMS & email confirmation with calendar invite',
  },
  {
    step: '03',
    title: 'Precision Multi-Stage Detail',
    description: 'We execute a methodical 40-point checklist using deionized spot-free water, ultrasonic depth gauges, and German polishes.',
    detail: '4 to 9 hours of uncompromising craftsmanship',
  },
  {
    step: '04',
    title: 'LED Inspection & Drive Away Happy',
    description: 'We perform a final Scangrip sun-match inspection together so you can admire the deep, liquid-glass reflection before handover.',
    detail: 'Backed by our 100% Royal Shine Guarantee',
  },
];

export const REVIEWS_LIST: ReviewItem[] = [
  {
    id: 'rev-1',
    name: 'Marcus Castellanos',
    roleOrCity: 'Classic Collector · Stockton, CA',
    vehicle: '1970 Chevelle SS 454',
    service: 'Ultimate Showroom + Ceramic Coating',
    rating: 5,
    date: '2 weeks ago',
    quote: 'I trusted YGO Detailing with my 1970 Chevelle before a weekend show in Lodi. The crimson paint had years of micro-haze under garage lights. After their two-stage correction, the depth looks like wet ruby glass.',
    outcome: 'Removed 95% of lacquer swirl marks & won Best Paint in Class',
  },
  {
    id: 'rev-2',
    name: 'Elena Rostova',
    roleOrCity: 'Physician · Modesto, CA',
    vehicle: '2023 Porsche Macan GTS (Jet Black)',
    service: 'Premium Detail (Mobile Service)',
    rating: 5,
    date: '1 month ago',
    quote: 'Their mobile van pulled up to my clinic parking lot with its own deionized water tank and quiet generator. The black paint had zero water spots afterward, and the red-stitched leather interior smells like a brand-new showroom.',
    outcome: 'Saved 4 hours of dealership waiting with zero water-spot residue',
  },
  {
    id: 'rev-3',
    name: 'Devon K. Whitaker',
    roleOrCity: 'Logistics Director · Tracy, CA',
    vehicle: '2022 Ford F-150 Raptor',
    service: 'Premium Detail + Engine Bay + Pet Hair',
    rating: 5,
    date: '3 weeks ago',
    quote: 'After a trip to Tahoe with two German Shepherds, my Raptor interior was covered in mud and embedded fur. YGO extracted every single hair and steamed the seats back to factory matte finish.',
    outcome: '100% pet hair & mountain mud extraction in 5 hours',
  },
  {
    id: 'rev-4',
    name: 'Carlos & Sofia Mendez',
    roleOrCity: 'Business Owners · Manteca, CA',
    vehicle: '2024 Tesla Model S Plaid',
    service: 'Ultimate Showroom + 9H Ceramic',
    rating: 5,
    date: '1 month ago',
    quote: 'Tesla paint is notoriously soft and came from the delivery hub with buffer trails. YGO measured the clear coat with a digital gauge, corrected every panel, and applied 9H ceramic. Washing takes 10 minutes now.',
    outcome: 'Eliminated factory delivery holograms + 3-year hydrophobic armor',
  },
  {
    id: 'rev-5',
    name: 'Brandon T. Nguyen',
    roleOrCity: 'Automotive Photographer · Lodi, CA',
    vehicle: '2021 BMW M3 Competition',
    service: 'Paint Correction & Polishing',
    rating: 5,
    date: '2 months ago',
    quote: 'As a car photographer, I notice every hologram under sunset lighting. YGO Detailing is the only shop in the 209 Area that truly understands jeweling black and dark red metallic paint without leaving filler wax.',
    outcome: 'True defect correction verified after isopropyl alcohol wipe',
  },
  {
    id: 'rev-6',
    name: 'Jasmine Al-Mansoor',
    roleOrCity: 'Real Estate Broker · Turlock, CA',
    vehicle: '2023 Mercedes-Benz GLE 53 AMG',
    service: 'Basic Shine + Leather Conditioning',
    rating: 5,
    date: '3 months ago',
    quote: 'My car is my mobile office for touring luxury homes with clients. Having YGO maintain my AMG every month keeps the wheels free of brake dust and the Nappa leather supple and matte, never greasy.',
    outcome: 'Consistent showroom presentation for daily client tours',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'Do I need to provide water or electricity for Mobile Detailing in the 209 Area?',
    answer: 'No. Our mobile concierge unit is 100% self-contained with a 100-gallon deionized spot-free water tank and quiet inverter power. Whether you are at home in Stockton, at an office park in Modesto, or in Tracy, we only need safe parking clearance beside your vehicle.',
  },
  {
    question: 'What cities in the 209 Area do you serve?',
    answer: 'We serve the entire 209 region including Stockton, Modesto, Tracy, Manteca, Lodi, Turlock, Lathrop, Ripon, Ceres, and Oakdale—plus you can always drop off your vehicle at our climate-controlled 209 Area Studio.',
  },
  {
    question: 'How long does Ceramic Coating take to cure?',
    answer: 'Our Ultimate Showroom & 9H Ceramic Coating service takes 7 to 9 hours in-studio or under our mobile canopy. The coating is dry to the touch and ready to drive upon handover, with full chemical curing achieved after 7 days (we recommend waiting 7 days before your first wash).',
  },
  {
    question: 'What is the difference between a regular wax and Paint Correction?',
    answer: 'Wax and sealants temporarily fill in tiny scratches and add surface protection, whereas Paint Correction permanently levels microscopic clear-coat imperfections (swirl marks, oxidation, etching) using precision machine polishers and German diminishing abrasives.',
  },
];
