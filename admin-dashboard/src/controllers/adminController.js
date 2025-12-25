import { countDocuments, find } from '../models/User';
import { countDocuments as _countDocuments, find as _find } from '../models/Restaurant';
import { countDocuments as __countDocuments, aggregate, find as __find } from '../models/Order';

const stats = async (req, res, next) => {
  try {
    const users = await countDocuments();
    const restaurant = await _countDocuments();
    const orders = await __countDocuments();
    const revenueAgg = await aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]);
    const revenue = (revenueAgg[0] && revenueAgg[0].total) || 0;
    res.json({ users, restaurant, orders, revenue });
  } catch (err) { next(err); }
};

const listUsers = async (req, res, next) => {
  try {
    const users = await find().select('-password -refreshToken').limit(500);
    res.json(users);
  } catch (err) { next(err); }
};

const listrestaurant = async (req, res, next) => {
  try {
    const rests = await _find().limit(500);
    res.json(rests);
  } catch (err) { next(err); }
};

const listOrders = async (req, res, next) => {
  try {
    const orders = await __find().sort({ createdAt: -1 }).limit(500);
    res.json(orders);
  } catch (err) { next(err); }
};

export default { stats, listUsers, listrestaurant, listOrders };
