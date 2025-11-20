'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check, Clock, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

const pricingOptions = [
  {
    name: 'Hourly Consultation',
    price: '$250',
    unit: '/hour',
    description: 'Perfect for specific technical challenges or quick consultations',
    features: [
      'Expert technical guidance',
      'No charge for initial discussion',
      'Flexible scheduling',
      'Pay only for time used',
      'Detailed session summary',
    ],
    icon: Clock,
    color: 'from-blue-500 to-cyan-500',
    cta: 'Schedule Consultation',
  },
  {
    name: 'Project-Based',
    price: 'Custom',
    unit: 'quote',
    description: 'Fixed-price solutions for well-defined projects with clear deliverables',
    features: [
      'Detailed project scope',
      'Fixed timeline & budget',
      'Progress milestones',
      'Money-back guarantee',
      'Post-launch support included',
    ],
    icon: Zap,
    color: 'from-purple-500 to-pink-500',
    popular: true,
    cta: 'Get Quote',
  },
  {
    name: 'Retainer Service',
    price: 'Starting $5k',
    unit: '/month',
    description: 'Ongoing support and development for growing businesses',
    features: [
      'Dedicated monthly hours',
      'Priority support queue',
      'Regular strategy sessions',
      'Proactive monitoring',
      'Discounted hourly rate',
    ],
    icon: Users,
    color: 'from-orange-500 to-red-500',
    cta: 'Discuss Options',
  },
];

export function PricingSection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section className="relative min-h-screen py-20 px-4" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Flexible Payment Options
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose the engagement model that works best for your business
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {pricingOptions.map((option, index) => (
            <motion.div
              key={option.name}
              className="relative group"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {option.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="relative h-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all overflow-hidden">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-5 group-hover:opacity-10 transition-opacity`} />

                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${option.color} mb-6`}>
                    <option.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">{option.name}</h3>
                  
                  <div className="flex items-baseline mb-4">
                    <span className="text-4xl font-bold text-white">{option.price}</span>
                    <span className="text-gray-400 ml-2">{option.unit}</span>
                  </div>

                  <p className="text-gray-400 mb-8">{option.description}</p>

                  <ul className="space-y-3 mb-8">
                    {option.features.map((feature) => (
                      <li key={feature} className="flex items-start text-gray-300">
                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full bg-gradient-to-r ${option.color} text-white hover:shadow-lg transition-all`}
                    size="lg"
                  >
                    {option.cta}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional info */}
        <motion.div
          className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-800/50 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Our Commitment to You
          </h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
              <p className="text-gray-300">Satisfaction Guarantee</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">No</div>
              <p className="text-gray-300">Charges for Initial Consultation</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400 mb-2">24/7</div>
              <p className="text-gray-300">Support for Active Projects</p>
            </div>
          </div>
          <p className="text-gray-400 mt-8">
            All pricing is transparent with no hidden fees. We believe in building long-term partnerships.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
