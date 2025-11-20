'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Send, Phone, Mail, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackFormSubmission as trackApolloForm } from '@/lib/apollo';
import { trackFormSubmission } from '@/lib/analytics';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
  newsletter: z.boolean().default(false),
  smsOptIn: z.boolean().default(false),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactSection() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Track form submission with Apollo
      trackApolloForm('contact_form', {
        subject: data.subject,
        has_phone: !!data.phone,
        has_company: !!data.company,
        newsletter_opted: data.newsletter,
        sms_opted: data.smsOptIn,
      });

      // Track form submission with Google Analytics and custom analytics
      trackFormSubmission('contact_form', {
        subject: data.subject,
        has_phone: !!data.phone,
        has_company: !!data.company,
        newsletter_opted: data.newsletter,
        sms_opted: data.smsOptIn,
      });

      // TODO: Implement API call to save contact
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setIsSuccess(true);
      reset();
      
      // Reset success state after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen py-20 px-4" ref={ref} id="contact">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Let's Build Something Together
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Ready to transform your business technology? We're here to help.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-white mb-8">Get in Touch</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Phone className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Phone</h4>
                  <p className="text-gray-400">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-500">Mon-Fri 9AM-6PM EST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Mail className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Email</h4>
                  <p className="text-gray-400">hello@dobeu.cloud</p>
                  <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <MapPin className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Office</h4>
                  <p className="text-gray-400">Remote First Company</p>
                  <p className="text-sm text-gray-500">Serving clients worldwide</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Response Time</h4>
                  <p className="text-gray-400">Usually within 2-4 hours</p>
                  <p className="text-sm text-gray-500">Emergency support available 24/7</p>
                </div>
              </div>
            </div>

            {/* Quick FAQ */}
            <div className="mt-12 p-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl">
              <h4 className="font-semibold text-white mb-4">Common Questions</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2 text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Free initial consultation - no strings attached</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>We work with businesses of all sizes</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>100% money-back guarantee on all projects</span>
                </li>
                <li className="flex items-start gap-2 text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Flexible payment terms available</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    {...register('name')}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Company
                  </label>
                  <input
                    {...register('company')}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Acme Inc."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  {...register('subject')}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Project inquiry"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  {...register('message')}
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Tell us about your project..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 text-sm text-gray-400">
                  <input
                    {...register('newsletter')}
                    type="checkbox"
                    className="w-4 h-4 bg-gray-900 border-gray-700 rounded text-blue-500 focus:ring-blue-500"
                  />
                  Subscribe to our newsletter for tech insights and updates
                </label>

                <label className="flex items-center gap-3 text-sm text-gray-400">
                  <input
                    {...register('smsOptIn')}
                    type="checkbox"
                    className="w-4 h-4 bg-gray-900 border-gray-700 rounded text-blue-500 focus:ring-blue-500"
                  />
                  Opt-in to receive SMS notifications about your project
                </label>
              </div>

              <Button
                type="submit"
                size="lg"
                className={`w-full ${
                  isSuccess
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
                } text-white`}
                disabled={isSubmitting || isSuccess}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : isSuccess ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Message Sent!
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Send Message
                  </span>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
