'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Code2, 
  Cloud, 
  Zap, 
  Database, 
  Shield, 
  Workflow,
  Globe,
  Smartphone,
  BarChart
} from 'lucide-react';

const services = [
  {
    icon: Code2,
    title: 'Full-Stack Development',
    description: 'Custom web applications, APIs, and mobile-responsive solutions built with modern technologies.',
    features: ['React/Next.js', 'Node.js/Python', 'Database Design', 'API Integration'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Cloud,
    title: 'VPS Management & Hosting',
    description: 'Reliable hosting solutions with expert server management and optimization.',
    features: ['Server Setup', 'Performance Tuning', 'Security Hardening', '24/7 Monitoring'],
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Workflow Automation',
    description: 'Streamline your business processes with intelligent automation solutions.',
    features: ['Process Mapping', 'Integration Setup', 'Custom Workflows', 'ROI Analysis'],
    color: 'from-orange-500 to-red-500',
  },
];

const additionalServices = [
  { icon: Database, title: 'Database Management', description: 'Optimize and secure your data infrastructure' },
  { icon: Shield, title: 'Security Audits', description: 'Comprehensive security assessments and solutions' },
  { icon: Workflow, title: 'API Integrations', description: 'Connect your tools and services seamlessly' },
  { icon: Globe, title: 'Web Development', description: 'Modern, fast, and SEO-optimized websites' },
  { icon: Smartphone, title: 'Mobile Solutions', description: 'Cross-platform mobile applications' },
  { icon: BarChart, title: 'Analytics Setup', description: 'Data-driven insights for your business' },
];

export function ServicesSection() {
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
            Our Core Services
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            We offer comprehensive tech solutions tailored to your business needs
          </p>
        </motion.div>

        {/* Main services grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="relative group"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                   style={{ backgroundImage: `linear-gradient(to right, ${service.color})` }} />
              
              <div className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all">
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${service.color} mb-6`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-400 mb-6">{service.description}</p>
                
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-gray-300">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional services */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-2xl font-semibold text-white mb-4">
            Additional Services
          </h3>
          <p className="text-gray-400">
            We also provide specialized solutions for your unique requirements
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
        >
          {additionalServices.map((service, index) => (
            <motion.div
              key={service.title}
              className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:bg-gray-900/50 hover:border-gray-700 transition-all"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <service.icon className="w-10 h-10 text-blue-500 mb-4" />
              <h4 className="text-lg font-semibold text-white mb-2">{service.title}</h4>
              <p className="text-gray-400 text-sm">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <p className="text-lg text-gray-400 mb-6">
            Don't see what you need? We offer custom solutions for unique challenges.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            Discuss Your Project
          </a>
        </motion.div>
      </div>
    </section>
  );
}
