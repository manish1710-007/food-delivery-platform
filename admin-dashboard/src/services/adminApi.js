import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/admin',
});

export const getAdminAnalytics = () => API.get('/admin/analytics');

export const getAdminOrders = () => API.get('/admin/orders');

export const getAdminUsers = () => API.get('/admin/users');

export const getAdminRestaurants = () => API.get('/admin/restaurants');

export const fetchStats = () => API.get('/admin/stats');
export const fetchUsers = () => API.get('/admin/users');
export const fetchOrders = () => API.get('/admin/orders');
export const fetchRestaurants = () => API.get('/admin/restaurants');
