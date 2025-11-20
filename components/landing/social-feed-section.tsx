'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';
import { Twitter, Linkedin, Heart, MessageCircle, Share2, RefreshCw } from 'lucide-react';

// Mock social media data - will be replaced with real API calls
const mockTwitterPosts = [
  {
    id: '1',
    author: 'Dobeu Tech',
    handle: '@dobeutech',
    avatar: '/avatar.jpg',
    content: 'Just launched a new automation workflow that reduced client processing time by 85%! 🚀 The power of well-integrated systems never ceases to amaze. #Automation #TechConsulting',
    timestamp: '2h ago',
    likes: 42,
    retweets: 12,
    replies: 5,
  },
  {
    id: '2',
    author: 'Dobeu Tech',
    handle: '@dobeutech',
    avatar: '/avatar.jpg',
    content: 'Pro tip: Before adding new tools to your tech stack, audit what you already have. You might be surprised how much functionality is going unused. 💡 #TechStrategy',
    timestamp: '5h ago',
    likes: 28,
    retweets: 8,
    replies: 3,
  },
  {
    id: '3',
    author: 'Dobeu Tech',
    handle: '@dobeutech',
    avatar: '/avatar.jpg',
    content: 'Successfully migrated a client from shared hosting to a managed VPS. Page load times went from 4.2s to 0.8s. Performance matters! ⚡ #WebPerformance #Hosting',
    timestamp: '1d ago',
    likes: 67,
    retweets: 23,
    replies: 9,
  },
];

const mockLinkedInPosts = [
  {
    id: '1',
    author: 'Dobeu Tech Solutions',
    avatar: '/avatar.jpg',
    content: 'The hidden cost of technical debt in small businesses: A thread on why investing in proper infrastructure early saves money long-term...',
    preview: 'When small businesses grow rapidly, technical infrastructure often becomes an afterthought. Here\'s why that\'s a costly mistake and how to avoid it.',
    timestamp: '1d ago',
    reactions: 156,
    comments: 23,
    shares: 15,
  },
  {
    id: '2',
    author: 'Dobeu Tech Solutions',
    avatar: '/avatar.jpg',
    content: 'Case Study: How we helped a local retailer integrate their online and offline inventory systems, resulting in 40% reduction in stock discrepancies.',
    preview: 'Integration doesn\'t have to be complex. Sometimes the simplest solutions yield the biggest results.',
    timestamp: '3d ago',
    reactions: 89,
    comments: 12,
    shares: 8,
  },
  {
    id: '3',
    author: 'Dobeu Tech Solutions',
    avatar: '/avatar.jpg',
    content: 'Why every business needs a technology roadmap in 2025: Strategic planning for digital transformation doesn\'t have to break the bank.',
    preview: 'A well-planned technology roadmap can be the difference between reactive problem-solving and proactive growth.',
    timestamp: '1w ago',
    reactions: 234,
    comments: 45,
    shares: 32,
  },
];

export function SocialFeedSection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [activeTab, setActiveTab] = useState<'twitter' | 'linkedin'>('twitter');
  const [isLoading, setIsLoading] = useState(false);

  const refreshFeed = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <section className="relative min-h-screen py-20 px-4" ref={ref}>
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Stay Connected
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Follow our journey and get tech insights on social media
          </p>
        </motion.div>

        {/* Social media tabs */}
        <motion.div
          className="flex justify-center gap-4 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <button
            onClick={() => setActiveTab('twitter')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
              activeTab === 'twitter'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Twitter className="w-5 h-5" />
            Twitter
          </button>
          <button
            onClick={() => setActiveTab('linkedin')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
              activeTab === 'linkedin'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Linkedin className="w-5 h-5" />
            LinkedIn
          </button>
          <button
            onClick={refreshFeed}
            className="p-3 bg-gray-800 text-gray-400 rounded-full hover:bg-gray-700 transition-all"
            disabled={isLoading}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </motion.div>

        {/* Feed content */}
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {activeTab === 'twitter' ? (
            <div className="space-y-6">
              {mockTwitterPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      D
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-white">{post.author}</span>
                        <span className="text-gray-500">{post.handle}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500">{post.timestamp}</span>
                      </div>
                      <p className="text-gray-300 mb-4">{post.content}</p>
                      <div className="flex items-center gap-6 text-gray-500">
                        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                          <MessageCircle className="w-5 h-5" />
                          {post.replies}
                        </button>
                        <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                          <RefreshCw className="w-5 h-5" />
                          {post.retweets}
                        </button>
                        <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                          <Heart className="w-5 h-5" />
                          {post.likes}
                        </button>
                        <button className="flex items-center gap-2 hover:text-blue-500 transition-colors ml-auto">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {mockLinkedInPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold">
                      D
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white">{post.author}</span>
                        <span className="text-gray-500 text-sm">{post.timestamp}</span>
                      </div>
                      <p className="text-gray-300 mb-3">{post.content}</p>
                      <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                        <p className="text-gray-400 text-sm">{post.preview}</p>
                      </div>
                      <div className="flex items-center gap-6 text-gray-500 text-sm">
                        <span className="flex items-center gap-2">
                          <span className="text-blue-500">👍</span>
                          {post.reactions} reactions
                        </span>
                        <span>{post.comments} comments</span>
                        <span>{post.shares} shares</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Follow CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-gray-400 mb-6">
            Get daily tech insights and business automation tips
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://twitter.com/dobeutech"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              <Twitter className="w-5 h-5" />
              Follow on Twitter
            </a>
            <a
              href="https://linkedin.com/company/dobeu-tech-solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              Connect on LinkedIn
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
