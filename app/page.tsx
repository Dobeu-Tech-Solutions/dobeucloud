import { HeroSection } from '@/components/landing/hero-section';
import { ServicesSection } from '@/components/landing/services-section';
import { PricingSection } from '@/components/landing/pricing-section';
import { PortfolioSection } from '@/components/landing/portfolio-section';
import { SocialFeedSection } from '@/components/landing/social-feed-section';
import { ContactSection } from '@/components/landing/contact-section';
import { InfiniteScrollContainer } from '@/components/landing/infinite-scroll-container';

export default function HomePage() {
  return (
    <InfiniteScrollContainer>
      <HeroSection />
      <ServicesSection />
      <PricingSection />
      <PortfolioSection />
      <SocialFeedSection />
      <ContactSection />
    </InfiniteScrollContainer>
  );
}