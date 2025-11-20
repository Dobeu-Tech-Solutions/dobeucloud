'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ExternalLink, Github, ArrowUpRight } from 'lucide-react';

// Mock portfolio data - will be replaced with MongoDB data
const portfolioItems = [
  {
    id: '1',
    title: 'E-Commerce Platform Modernization',
    category: 'Full-Stack Development',
    description: 'Migrated legacy PHP application to modern Next.js stack with 3x performance improvement',
    image: '/portfolio/ecommerce.jpg',
    tags: ['Next.js', 'MongoDB', 'Stripe', 'AWS'],
    metrics: { performance: '+300%', conversion: '+45%', loadTime: '1.2s' },
    testimonial: 'Dobeu transformed our outdated system into a modern powerhouse.',
    link: 'https://example.com',
  },
  {
    id: '2',
    title: 'Workflow Automation Suite',
    category: 'Process Automation',
    description: 'Built custom automation system saving 40+ hours per week in manual tasks',
    image: '/portfolio/automation.jpg',
    tags: ['Python', 'API Integration', 'Zapier', 'Node.js'],
    metrics: { timeSaved: '40hrs/week', efficiency: '+85%', ROI: '250%' },
    testimonial: 'The automation solution exceeded all our expectations.',
    github: 'https://github.com',
  },
  {
    id: '3',
    title: 'Healthcare Data Platform',
    category: 'Database & Security',
    description: 'HIPAA-compliant data management system with advanced analytics',
    image: '/portfolio/healthcare.jpg',
    tags: ['PostgreSQL', 'Security', 'React', 'Docker'],
    metrics: { uptime: '99.9%', dataProcessed: '1TB+', compliance: '100%' },
    testimonial: 'Security and performance were both exceptional.',
  },
  {
    id: '4',
    title: 'Real-Time Analytics Dashboard',
    category: 'Data Visualization',
    description: 'Custom dashboard processing 1M+ events daily with real-time insights',
    image: '/portfolio/analytics.jpg',
    tags: ['React', 'WebSockets', 'D3.js', 'Redis'],
    metrics: { events: '1M+/day', latency: '<100ms', accuracy: '99.9%' },
  },
  {
    id: '5',
    title: 'Mobile App Backend Infrastructure',
    category: 'API Development',
    description: 'Scalable backend supporting 100k+ active users with microservices architecture',
    image: '/portfolio/mobile.jpg',
    tags: ['Node.js', 'Kubernetes', 'GraphQL', 'Redis'],
    metrics: { users: '100k+', uptime: '99.99%', responseTime: '<50ms' },
  },
  {
    id: '6',
    title: 'AI-Powered Content Management',
    category: 'Machine Learning',
    description: 'Intelligent CMS with automated tagging and content recommendations',
    image: '/portfolio/ai-cms.jpg',
    tags: ['Python', 'TensorFlow', 'Next.js', 'OpenAI'],
    metrics: { accuracy: '95%', timeToPublish: '-60%', engagement: '+120%' },
  },
];

const categories = ['All', 'Full-Stack Development', 'Process Automation', 'Database & Security', 'Data Visualization', 'API Development', 'Machine Learning'];

export function PortfolioSection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [displayedItems, setDisplayedItems] = useState(3);
  const [filteredItems, setFilteredItems] = useState(portfolioItems);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredItems(portfolioItems);
    } else {
      setFilteredItems(portfolioItems.filter(item => item.category === selectedCategory));
    }
    setDisplayedItems(3);
  }, [selectedCategory]);

  const loadMore = () => {
    setDisplayedItems(prev => Math.min(prev + 3, filteredItems.length));
  };

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
            Our Work Speaks for Itself
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real projects, real results. See how we've helped businesses transform their technology.
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Portfolio grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredItems.slice(0, displayedItems).map((item, index) => (
              <motion.div
                key={item.id}
                className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                layout
              >
                {/* Image placeholder */}
                <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white/20">
                      {item.title.charAt(0)}
                    </span>
                  </div>
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
                      >
                        <ExternalLink className="w-5 h-5 text-white" />
                      </a>
                    )}
                    {item.github && (
                      <a
                        href={item.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
                      >
                        <Github className="w-5 h-5 text-white" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="text-sm text-blue-400 mb-2">{item.category}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{item.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-800 text-gray-400 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Metrics */}
                  {item.metrics && (
                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-800">
                      {Object.entries(item.metrics).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-sm font-semibold text-white">{value}</div>
                          <div className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Load more button */}
        {displayedItems < filteredItems.length && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={loadMore}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              Load More Projects
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          className="text-center mt-16 p-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-blue-800/50 rounded-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Build Something Amazing?
          </h3>
          <p className="text-gray-400 mb-6">
            Let's discuss how we can transform your technology challenges into opportunities.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors"
          >
            Start Your Project
          </a>
        </motion.div>
      </div>
    </section>
  );
}
