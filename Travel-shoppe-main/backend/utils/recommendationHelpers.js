const Booking = require('../models/Booking');

const normalizeKey = (value) => {
  if (typeof value !== 'string') return '';
  return value.trim().toLowerCase();
};

const normalizeRecommendationTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags
      .map((tag) => String(tag).trim())
      .filter(Boolean);
  }

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizeRecommendationTagsPayload = (payload) => {
  if (!payload || !Object.prototype.hasOwnProperty.call(payload, 'recommendationTags')) {
    return payload;
  }

  return {
    ...payload,
    recommendationTags: normalizeRecommendationTags(payload.recommendationTags)
  };
};

const buildBookingMetrics = async () => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const metrics = await Booking.aggregate([
    {
      $match: {
        status: { $ne: 'cancelled' }
      }
    },
    {
      $group: {
        _id: '$destination',
        totalBookings: { $sum: 1 },
        totalPeople: { $sum: '$people' },
        recentBookings: {
          $sum: {
            $cond: [
              { $gte: ['$createdAt', sevenDaysAgo] },
              1,
              0
            ]
          }
        }
      }
    }
  ]);

  return metrics.reduce((acc, item) => {
    acc[normalizeKey(item._id)] = {
      totalBookings: item.totalBookings,
      totalPeople: item.totalPeople,
      recentBookings: item.recentBookings
    };
    return acc;
  }, {});
};

const enrichWithDynamicTags = async (items, keyField, priceField = 'priceValue') => {
  if (!items.length) {
    return [];
  }

  const bookingMetrics = await buildBookingMetrics();

  const enriched = items.map((item) => {
    const key = normalizeKey(item[keyField]);
    const metrics = bookingMetrics[key] || {
      totalBookings: 0,
      totalPeople: 0,
      recentBookings: 0
    };
    return {
      ...item._doc,
      recommendationSourceKey: key,
      recommendationPrice: typeof item[priceField] === 'number' ? item[priceField] : Infinity,
      recommendationMetrics: metrics
    };
  });

  const bestSellerCount = Math.max(...enriched.map((item) => item.recommendationMetrics.totalBookings));
  const trendingCount = Math.max(...enriched.map((item) => item.recommendationMetrics.recentBookings));
  const popularCount = Math.max(...enriched.map((item) => item.recommendationMetrics.totalPeople));
  const budgetFriendlyPrice = Math.min(...enriched.map((item) => item.recommendationPrice));

  return enriched.map((item) => {
    const storedTags = normalizeRecommendationTags(item.recommendationTags);
    if (storedTags.length) {
      const base = { ...item };
      delete base.recommendationSourceKey;
      delete base.recommendationPrice;
      delete base.recommendationMetrics;

      return {
        ...base,
        recommendationTags: storedTags
      };
    }

    const tags = [];
    const metrics = item.recommendationMetrics;

    if (item.recommendationPrice === budgetFriendlyPrice) {
      tags.push('Budget Friendly');
    }
    if (metrics.totalBookings > 0 && metrics.totalBookings === bestSellerCount) {
      tags.push('Best Seller');
    }
    if (metrics.recentBookings > 0 && metrics.recentBookings === trendingCount) {
      tags.push('Trending Now');
    }
    if (metrics.totalPeople > 0 && metrics.totalPeople === popularCount) {
      tags.push('High Demand');
    }

    const base = { ...item };
    delete base.recommendationSourceKey;
    delete base.recommendationPrice;
    delete base.recommendationMetrics;

    return {
      ...base,
      recommendationTags: tags
    };
  });
};

module.exports = {
  enrichWithDynamicTags,
  normalizeRecommendationTagsPayload
};
