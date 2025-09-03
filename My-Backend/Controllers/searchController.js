// Controllers/searchController.js
const Menu = require('../Models/MenuModel');
const Restaurant = require('../Models/RestaurantModel');
const mongoose = require('mongoose');

// Utility function to clamp values
const clamp = (v, min, max, def) => {
  if (v === undefined || v === null) return def;
  const n = Number(v);
  if (Number.isNaN(n)) return def;
  return Math.max(min, Math.min(max, n));
};

/**
 * Search Menus with filtering options
 * @param {Object} params - Filter parameters
 * @returns {Object} Paginated Menu results
 */
async function searchMenus({ q, category, minPrice, maxPrice, sort, page, limit }) {
  const skip = (page - 1) * limit;
  const filter = {};
  
  // Build filter object
  if (category) filter.category = category;
  if (minPrice != null || maxPrice != null) {
    filter.price = {};
    if (minPrice != null) filter.price.$gte = minPrice;
    if (maxPrice != null) filter.price.$lte = maxPrice;
  }

  let query;
  let totalPromise;
  
  // Text search if query provided
  if (q) {
    query = Menu.find({ $text: { $search: q }, ...filter }, { score: { $meta: 'textScore' } });
    totalPromise = Menu.countDocuments({ $text: { $search: q }, ...filter });
    if (sort === 'relevance') query.sort({ score: { $meta: 'textScore' } });
  } else {
    query = Menu.find(filter);
    totalPromise = Menu.countDocuments(filter);
  }

  // Apply sorting
  if (sort === 'price_asc') query.sort({ price: 1 });
  else if (sort === 'price_desc') query.sort({ price: -1 });
  else if (!q) query.sort({ createdAt: -1 });

  // Pagination and population
  query = query.skip(skip).limit(limit).populate('restaurant', 'name email phone');

  const [items, total] = await Promise.all([query.lean(), totalPromise]);
  return { items, total, page, pages: Math.ceil(total / limit) };
}

/**
 * Search restaurants with filtering options
 * @param {Object} params - Filter parameters
 * @returns {Object} Paginated restaurant results
 */
async function searchRestaurants({ q, minRating, maxDistance, lat, lng, sort, page, limit }) {
  const skip = (page - 1) * limit;

  // Geo-aware search if coordinates provided
  if (lat != null && lng != null) {
    const geoNearStage = {
      $geoNear: {
        near: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        distanceField: 'distance',
        spherical: true,
        query: { rating: { $gte: minRating || 0 } }
      }
    };
    
    if (maxDistance != null) geoNearStage.$geoNear.maxDistance = Number(maxDistance);

    const pipeline = [geoNearStage];
    if (q) pipeline.push({ $match: { $text: { $search: q } } });

    // Join with partner info
    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'partner', // references User _id 
        foreignField: '_id',
        as: 'partnerDoc'
      }
    });
    pipeline.push({ $unwind: { path: '$partnerDoc', preserveNullAndEmptyArrays: true } });

    // Apply sorting
    if (sort === 'distance') pipeline.push({ $sort: { distance: 1 } });
    else pipeline.push({ $sort: { rating: -1 } });

    // Pagination
    pipeline.push({ $skip: skip }, { $limit: limit });

    // Project only necessary fields
    pipeline.push({
      $project: {
        name: 1, description: 1, address: 1, rating: 1, ratingCount: 1, 
        categories: 1, distance: 1,
        'partnerDoc._id': 1, 'partnerDoc.name': 1, 'partnerDoc.email': 1, 'partnerDoc.phone': 1
      }
    });

    const items = await Restaurant.aggregate(pipeline);

    // Get total count
    const countPipeline = [geoNearStage];
    if (q) countPipeline.push({ $match: { $text: { $search: q } } });
    countPipeline.push({ $count: 'total' });
    const countResult = await Restaurant.aggregate(countPipeline);
    const total = (countResult[0] && countResult[0].total) || 0;
    
    return { items, total, page, pages: Math.ceil(total / limit) };
  }

  // Fallback to simple find query
  const filter = { rating: { $gte: minRating || 0 } };
  if (q) filter.$text = { $search: q };

  let query = Restaurant.find(filter).select('-__v').populate('partnerInfo', 'name email phone').lean();
  if (sort === 'rating') query.sort({ rating: -1 });
  else query.sort({ createdAt: -1 });

  const [items, total] = await Promise.all([
    query.skip(skip).limit(limit), 
    Restaurant.countDocuments(filter)
  ]);
  
  return { items, total, page, pages: Math.ceil(total / limit) };
}

/**
 * Unified search endpoint for both Menus and restaurants
 */
exports.unifiedSearch = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = clamp(req.query.limit, 1, 50, 12);

    // Collect all parameters
    const params = {
      q,
      page,
      limit,
      category: req.query.category,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : null,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : null,
      sort: req.query.sort,
      minRating: req.query.minRating ? Number(req.query.minRating) : 0,
      maxDistance: req.query.maxDistance ? Number(req.query.maxDistance) : null,
      lat: req.query.lat ? Number(req.query.lat) : null,
      lng: req.query.lng ? Number(req.query.lng) : null,
    };

    // Run both searches in parallel
    const [Menus, restaurants] = await Promise.all([
      searchMenus(params),
      searchRestaurants(params)
    ]);

    // Determine preferred result type
    const requestedType = (req.query.type || '').toLowerCase();
    let preferred;
    
    if (requestedType === 'menu' || requestedType === 'restaurant') {
      preferred = requestedType;
    } else if (params.lat != null && params.lng != null) {
      preferred = 'restaurant';
    } else if (params.category || params.minPrice != null || params.maxPrice != null || 
               (params.sort && params.sort.includes('price'))) {
      preferred = 'menu';
    } else {
      preferred = (Menus.total >= restaurants.total) ? 'menu' : 'restaurant';
    }

    return res.json({
      preferred,
      Menus,
      restaurants
    });
  } catch (err) {
    console.error('unifiedSearch error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Filter menu items by category, price range, etc.
 * Perfect for price slider integration
 */
exports.filterMenu = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = clamp(req.query.limit, 1, 50, 12);
    
    // Price range from slider (frontend should send minPrice and maxPrice)
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : null;

    const results = await searchMenus({
      q,
      category: req.query.category,
      minPrice,
      maxPrice,
      sort: req.query.sort || 'price_asc',
      page,
      limit
    });

    return res.json(results);
  } catch (err) {
    console.error('filterMenu error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Filter restaurants by rating, distance, etc.
 * Perfect for rating and distance sliders
 */
exports.filterRestaurants = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = clamp(req.query.limit, 1, 50, 12);
    
    // Rating and distance from sliders
    const minRating = req.query.minRating ? Number(req.query.minRating) : 0;
    const maxDistance = req.query.maxDistance ? Number(req.query.maxDistance) : null;

    const results = await searchRestaurants({
      q,
      minRating,
      maxDistance,
      lat: req.query.lat ? Number(req.query.lat) : null,
      lng: req.query.lng ? Number(req.query.lng) : null,
      sort: req.query.sort || 'rating',
      page,
      limit
    });

    return res.json(results);
  } catch (err) {
    console.error('filterRestaurants error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};