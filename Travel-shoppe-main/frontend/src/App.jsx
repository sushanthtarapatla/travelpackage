import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Navigate, Route, Routes } from 'react-router-dom'
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
import AdminLogin from './components/AdminLogin'
import AdminDashboard from './components/AdminDashboard'
import BookingModal from './components/BookingModal'
import DestinationDetail from './components/DestinationDetail'
import PackageDetail from './components/PackageDetail'

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

  const HomePage = () => (
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

  const ProtectedRoute = ({ children }) => {
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true'
    return isAdminLoggedIn ? children : <Navigate to="/admin/login" replace />
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/destinations/:slug" element={<DestinationDetail />} />
        <Route path="/packages/:slug" element={<PackageDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <BookingModal />
    </>
  )
}

export default App
