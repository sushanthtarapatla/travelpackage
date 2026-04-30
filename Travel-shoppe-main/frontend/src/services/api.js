// Mock Data - No backend required
const mockDestinations = [
  {
    _id: '1',
    name: 'Maldives',
    slug: 'maldives',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=700&q=85&fit=crop',
    price: 'From ₹1,25,000',
    priceValue: 125000,
    featured: true,
    order: 1
  },
  {
    _id: '2',
    name: 'Greece',
    slug: 'greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700&q=85&fit=crop',
    price: 'From ₹1,45,000',
    priceValue: 145000,
    featured: true,
    order: 2
  },
  {
    _id: '3',
    name: 'Switzerland',
    slug: 'switzerland',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=700&q=85&fit=crop',
    price: 'From ₹1,60,000',
    priceValue: 160000,
    featured: true,
    order: 3
  },
  {
    _id: '4',
    name: 'Dubai',
    slug: 'dubai',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=700&q=85&fit=crop',
    price: 'From ₹95,000',
    priceValue: 95000,
    order: 4
  },
  {
    _id: '5',
    name: 'Bali',
    slug: 'bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700&q=85&fit=crop',
    price: 'From ₹85,000',
    priceValue: 85000,
    order: 5
  },
  {
    _id: '6',
    name: 'Japan',
    slug: 'japan',
    image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=700&q=85&fit=crop',
    price: 'From ₹1,75,000',
    priceValue: 175000,
    order: 6
  },
  {
    _id: '7',
    name: 'Paris',
    slug: 'paris',
    image: 'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?w=700&q=85&fit=crop',
    price: 'From ₹1,50,000',
    priceValue: 150000,
    order: 7
  },
  {
    _id: '8',
    name: 'Tuscany',
    slug: 'tuscany',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=700&q=85&fit=crop',
    price: 'From ₹1,30,000',
    priceValue: 130000,
    order: 8
  }
];

const mockPackages = [
  {
    _id: '1',
    name: 'Overwater Bungalow Escape',
    slug: 'overwater-bungalow-escape',
    location: 'Maldives',
    image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=700&q=85&fit=crop',
    tag: 'Most Popular',
    description: 'Wake up above the turquoise lagoon in a private overwater villa. Snorkel with manta rays, dine under the stars on your own deck.',
    duration: '7 Nights',
    guests: '2 Adults',
    inclusions: ['All Inclusive'],
    price: '₹1,25,000',
    priceValue: 125000,
    featured: true,
    order: 1
  },
  {
    _id: '2',
    name: 'Santorini Sunset Romance',
    slug: 'santorini-sunset-romance',
    location: 'Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700&q=85&fit=crop',
    tag: 'Romantic',
    description: 'Drift through whitewashed villages, sip volcanic wines and watch the legendary Oia sunset paint the sky in gold.',
    duration: '6 Nights',
    guests: '2 Adults',
    inclusions: ['Flights Included'],
    price: '₹1,45,000',
    priceValue: 145000,
    featured: true,
    order: 2
  },
  {
    _id: '3',
    name: 'Alpine Luxury & Glacier Trail',
    slug: 'alpine-luxury-glacier-trail',
    location: 'Switzerland',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=700&q=85&fit=crop',
    tag: 'Adventure',
    description: 'Stay in a chalet perched above the clouds. Ski pristine powder, ride the Glacier Express and indulge in Swiss fondue evenings.',
    duration: '8 Nights',
    guests: '2 Adults',
    inclusions: ['Visa Assistance'],
    price: '₹1,60,000',
    priceValue: 160000,
    featured: true,
    order: 3
  }
];

const mockTestimonials = [
  {
    _id: '1',
    name: 'Priya & Rohan Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    quote: 'Travel turned our honeymoon into a fairy tale. Every single detail was perfect — from the overwater villa in the Maldives to the private sunset dinner.',
    trip: 'Maldives Honeymoon',
    rating: 5,
    featured: true,
    order: 1
  },
  {
    _id: '2',
    name: 'Arjun Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    quote: 'The Switzerland trip was beyond imagination. The team thought of everything — private transfers, hidden gems we\'d never have found alone, impeccable hotels.',
    trip: 'Swiss Alps Adventure',
    rating: 5,
    featured: true,
    order: 2
  },
  {
    _id: '3',
    name: 'Meera & Family Kapoor',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    quote: 'Our family trip to Greece was smooth, fun, and absolutely magical. The kids loved every moment and the concierge was available at any hour for support.',
    trip: 'Greece Family Holiday',
    rating: 5,
    featured: true,
    order: 3
  }
];

const mockJourneyCategories = [
  { _id: '1', name: 'Honeymoon Escapes', slug: 'honeymoon-escapes', icon: '♥', active: true, order: 1 },
  { _id: '2', name: 'Family Holidays', slug: 'family-holidays', icon: '⚇', active: false, order: 2 },
  { _id: '3', name: 'Adventure & Thrills', slug: 'adventure-thrills', icon: '⚙', active: false, order: 3 },
  { _id: '4', name: 'Cultural Experiences', slug: 'cultural-experiences', icon: '⛩', active: false, order: 4 },
  { _id: '5', name: 'Luxury Getaways', slug: 'luxury-getaways', icon: '✦', active: false, order: 5 },
  { _id: '6', name: 'Business Travel', slug: 'business-travel', icon: '✈', active: false, order: 6 }
];

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Destinations API
export const getDestinations = async () => {
  await delay(300); // Simulate API delay
  return { success: true, count: mockDestinations.length, data: mockDestinations };
};

export const getDestination = async (slug) => {
  await delay(200);
  const destination = mockDestinations.find(d => d.slug === slug);
  if (!destination) throw new Error('Destination not found');
  return { success: true, data: destination };
};

// Packages API
export const getPackages = async () => {
  await delay(300);
  return { success: true, count: mockPackages.length, data: mockPackages };
};

export const getFeaturedPackages = async () => {
  await delay(200);
  const featured = mockPackages.filter(p => p.featured);
  return { success: true, count: featured.length, data: featured };
};

export const getPackage = async (slug) => {
  await delay(200);
  const pkg = mockPackages.find(p => p.slug === slug);
  if (!pkg) throw new Error('Package not found');
  return { success: true, data: pkg };
};

// Testimonials API
export const getTestimonials = async () => {
  await delay(300);
  return { success: true, count: mockTestimonials.length, data: mockTestimonials };
};

export const getFeaturedTestimonials = async () => {
  await delay(200);
  const featured = mockTestimonials.filter(t => t.featured);
  return { success: true, count: featured.length, data: featured };
};

// Journey Categories API
export const getJourneyCategories = async () => {
  await delay(200);
  return { success: true, count: mockJourneyCategories.length, data: mockJourneyCategories };
};

// Contact API - Mock submission
export const submitContact = async (data) => {
  await delay(500);
  console.log('Mock contact submission:', data);
  return { 
    success: true, 
    message: 'Thank you for your enquiry. We will contact you soon!',
    data: { _id: Date.now().toString(), ...data, createdAt: new Date().toISOString() }
  };
};

const api = { get: () => {}, post: () => {} };
export default api;
