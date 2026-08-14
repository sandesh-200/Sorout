import HeroSection from '@/components/marketing/hero/index'
import Pricing  from '@/components/marketing/pricing/index'
import Faqs from '@/components/marketing/faq/index'
import Features from '@/components/marketing/features/index'
import Footer from '@/components/marketing/footer'

const LandingPage = () => {
  return (
    <div>
        <HeroSection/>
        <Pricing/>
        <Features/>
        <Faqs/>
        <Footer/>
    </div>
  )
}

export default LandingPage