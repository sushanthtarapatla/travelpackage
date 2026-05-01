import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

const unwrap = (response) => response.data;

// Destinations API
export const getDestinations = async () => unwrap(await api.get('/destinations'));
export const createDestination = async (data) => unwrap(await api.post('/destinations', data));
export const updateDestination = async (id, data) => unwrap(await api.put(`/destinations/${id}`, data));
export const deleteDestination = async (id) => unwrap(await api.delete(`/destinations/${id}`));
export const cancelBooking = (id) => {
  return axios.put(`/api/bookings/${id}/cancel`);
};
export const getDestination = async (slug) => unwrap(await api.get(`/destinations/${slug}`));

// Packages API
export const getPackages = async () => unwrap(await api.get('/packages'));
export const createPackage = async (data) => unwrap(await api.post('/packages', data));
export const updatePackage = async (id, data) => unwrap(await api.put(`/packages/${id}`, data));
export const deletePackage = async (id) => unwrap(await api.delete(`/packages/${id}`));

export const getFeaturedPackages = async () => unwrap(await api.get('/packages/featured'));

export const getPackage = async (slug) => unwrap(await api.get(`/packages/${slug}`));

// Testimonials API
export const getTestimonials = async () => unwrap(await api.get('/testimonials'));

export const getFeaturedTestimonials = async () => unwrap(await api.get('/testimonials/featured'));

// Journey Categories API
export const getJourneyCategories = async () => unwrap(await api.get('/journey-categories'));

// Contact API
export const submitContact = async (data) => unwrap(await api.post('/contacts', data));

// Booking API
export const createBooking = async (data) => unwrap(await api.post('/bookings', data));
export const getBookings = async () => unwrap(await api.get('/bookings'));
export const getBookingsByPhone = async (phone) => unwrap(await api.get(`/bookings/phone/${phone}`));
export const cancelBooking = async (id) => unwrap(await api.put(`/bookings/${id}/cancel`));

export default api;
