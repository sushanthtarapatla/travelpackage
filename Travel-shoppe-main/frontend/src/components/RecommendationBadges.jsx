import {
  getRecommendationTagClass,
  getRecommendationTags
} from '../utils/recommendationTags'
import './RecommendationBadges.css'

const RecommendationBadges = ({ item }) => {
  const tags = getRecommendationTags(item)

  if (!tags.length) return null

  return (
    <div className="recommendation-badges" aria-label="Recommendation tags">
      {tags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className={`recommendation-badge ${getRecommendationTagClass(tag)}`}
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

export default RecommendationBadges
