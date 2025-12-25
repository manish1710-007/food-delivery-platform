import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/admin',
});

export const fetchStats = () => API.get('/stats');
export const fetchUsers = () => API.get('/users');
export const fetchOrders = () => API.get('/orders');
export const fetchrestaurant = () => API.get('/restaurant');

