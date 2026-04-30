import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import FeaturesBar from './components/FeaturesBar'
import DestinationsAnimated from './components/DestinationsAnimated'
import JourneyCategories from './components/JourneyCategories'
import VideoStrip from './components/VideoStrip'
import FeaturedExperience from './components/FeaturedExperience'
import PackagesAnimated from './components/PackagesAnimated'
import StatsAnimated from './components/StatsAnimated'
import TestimonialsAnimated from './components/TestimonialsAnimated'
import CTAAnimated from './components/CTAAnimated'
import Footer from './components/Footer'

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger)

function App() {
  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    
    // Refresh ScrollTrigger on window resize
    const handleResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <FeaturesBar />
        <DestinationsAnimated />
        <JourneyCategories />
        <VideoStrip />
        <FeaturedExperience />
        <PackagesAnimated />
        <StatsAnimated />
        <TestimonialsAnimated />
        <CTAAnimated />
      </main>
      <Footer />
    </div>
  )
}

export default App
