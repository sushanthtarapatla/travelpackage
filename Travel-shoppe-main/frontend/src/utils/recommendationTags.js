export const recommendationTagSuggestions = [
  'Best Seller',
  'Trending Now',
  'Budget Friendly',
  'Luxury Pick',
  'Family Favorite',
  'Honeymoon Special',
  'Adventure Hotspot',
  'Limited Slots',
  'High Demand',
  'Newly Added'
]

export const parseRecommendationTags = (value = '') =>
  value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)

export const getRecommendationTags = (item = {}) => {
  if (Array.isArray(item.recommendationTags) && item.recommendationTags.length) {
    return item.recommendationTags.filter(Boolean)
  }

  return [item.tag || item.recommendation].filter(Boolean)
}

export const getRecommendationTagClass = (tag = '') => {
  const normalized = tag.toLowerCase()

  if (normalized.includes('best seller')) return 'gold'
  if (normalized.includes('trending') || normalized.includes('limited') || normalized.includes('demand')) return 'red'
  if (normalized.includes('budget')) return 'green'
  if (normalized.includes('luxury') || normalized.includes('honeymoon')) return 'purple'
  if (normalized.includes('family')) return 'blue'
  if (normalized.includes('adventure')) return 'orange'
  if (normalized.includes('new')) return 'teal'

  return 'neutral'
}
