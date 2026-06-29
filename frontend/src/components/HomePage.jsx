import Navbar from './Navbar'
import HeroCarousel from './HeroCarousel'
import Features from './Features'
import AboutUs from './AboutUs'
import PricingPlans from './PricingPlans'
import CtaSection from './CtaSection'
import Footer from './Footer'

function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroCarousel />
        <Features />
        <AboutUs />
        <PricingPlans />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}

export default HomePage
