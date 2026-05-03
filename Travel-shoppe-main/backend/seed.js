const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Destination = require('./models/Destination');
const Package = require('./models/Package');
const Testimonial = require('./models/Testimonial');
const JourneyCategory = require('./models/JourneyCategory');

dotenv.config();

const connectDB = require('./config/db');

// Sample data
const destinations = [
  {
    name: 'Maldives',
    slug: 'maldives',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=700&q=85&fit=crop',
    price: 'From ₹1,25,000',
    priceValue: 125000,
    tag: 'Beach Paradise',
    featured: true,
    order: 1
  },
  {
    name: 'Greece',
    slug: 'greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=700&q=85&fit=crop',
    price: 'From ₹1,45,000',
    priceValue: 145000,
    tag: 'Island Hopping',
    featured: true,
    order: 2
  },
  {
    name: 'Switzerland',
    slug: 'switzerland',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=700&q=85&fit=crop',
    price: 'From ₹1,60,000',
    priceValue: 160000,
    tag: 'Mountain Escape',
    featured: true,
    order: 3
  },
  {
    name: 'Dubai',
    slug: 'dubai',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=700&q=85&fit=crop',
    price: 'From ₹95,000',
    priceValue: 95000,
    tag: 'Urban Luxury',
    order: 4
  },
  {
    name: 'Bali',
    slug: 'bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=700&q=85&fit=crop',
    price: 'From ₹85,000',
    priceValue: 85000,
    tag: 'Cultural Retreat',
    order: 5
  },
  {
    name: 'Japan',
    slug: 'japan',
    image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65?w=700&q=85&fit=crop',
    price: 'From ₹1,75,000',
    priceValue: 175000,
    tag: 'Ancient Wonders',
    order: 6
  },
  {
    name: 'Paris',
    slug: 'paris',
    image: 'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?w=700&q=85&fit=crop',
    price: 'From ₹1,50,000',
    priceValue: 150000,
    tag: 'Romantic Gateway',
    order: 7
  },
  {
    name: 'Tuscany',
    slug: 'tuscany',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=700&q=85&fit=crop',
    price: 'From ₹1,30,000',
    priceValue: 130000,
    tag: 'Wine Country',
    order: 8
  }
];

const packages = [
  {
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

const testimonials = [
  {
    name: 'Priya & Rohan Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80',
    quote: 'Travel turned our honeymoon into a fairy tale. Every single detail was perfect — from the overwater villa in the Maldives to the private sunset dinner.',
    trip: 'Maldives Honeymoon',
    rating: 5,
    featured: true,
    order: 1
  },
  {
    name: 'Arjun Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
    quote: 'The Switzerland trip was beyond imagination. The team thought of everything — private transfers, hidden gems we\'d never have found alone, impeccable hotels.',
    trip: 'Swiss Alps Adventure',
    rating: 5,
    featured: true,
    order: 2
  },
  {
    name: 'Meera & Family Kapoor',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80',
    quote: 'Our family trip to Greece was smooth, fun, and absolutely magical. The kids loved every moment and the concierge was available at any hour for support.',
    trip: 'Greece Family Holiday',
    rating: 5,
    featured: true,
    order: 3
  }
];

const journeyCategories = [
  { name: 'Honeymoon Escapes', slug: 'honeymoon-escapes', icon: '♥', active: true, order: 1 },
  { name: 'Family Holidays', slug: 'family-holidays', icon: '⚇', order: 2 },
  { name: 'Adventure & Thrills', slug: 'adventure-thrills', icon: '⚙', order: 3 },
  { name: 'Cultural Experiences', slug: 'cultural-experiences', icon: '⛩', order: 4 },
  { name: 'Luxury Getaways', slug: 'luxury-getaways', icon: '✦', order: 5 },
  { name: 'Business Travel', slug: 'business-travel', icon: '✈', order: 6 }
];

// Import data
const importData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Destination.deleteMany();
    await Package.deleteMany();
    await Testimonial.deleteMany();
    await JourneyCategory.deleteMany();
    
    console.log('Data cleared...');
    
    // Insert new data
    await Destination.insertMany(destinations);
    await Package.insertMany(packages);
    await Testimonial.insertMany(testimonials);
    await JourneyCategory.insertMany(journeyCategories);
    
    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await connectDB();
    
    await Destination.deleteMany();
    await Package.deleteMany();
    await Testimonial.deleteMany();
    await JourneyCategory.deleteMany();
    
    console.log('Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run script based on argument
if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}
