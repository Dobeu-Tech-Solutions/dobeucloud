'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navigation } from '@/components/navigation';
import { useLanguage } from '@/components/language-context';
import { trackFormSubmission } from '@/lib/analytics';
import { 
  FileText, 
  Upload, 
  Calendar,
  DollarSign,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

const quoteSchema = z.object({
  // Contact Information
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().min(2, 'Company name is required'),
  
  // Project Details
  projectName: z.string().min(5, 'Project name must be at least 5 characters'),
  projectType: z.string().min(1, 'Please select a project type'),
  budget: z.string().min(1, 'Please select a budget range'),
  timeline: z.string().min(1, 'Please select a timeline'),
  
  // Requirements
  description: z.string().min(50, 'Please provide a detailed description (min 50 characters)'),
  services: z.array(z.string()).min(1, 'Please select at least one service'),
  
  // Additional
  hasExistingSystem: z.boolean(),
  existingSystemDetails: z.string().optional(),
  attachments: z.any().optional(),
  urgency: z.string(),
  preferredContactMethod: z.string(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

const projectTypes = [
  { value: 'new_development', label: 'New Development' },
  { value: 'modernization', label: 'System Modernization' },
  { value: 'integration', label: 'API/System Integration' },
  { value: 'automation', label: 'Process Automation' },
  { value: 'consulting', label: 'Tech Consulting' },
  { value: 'other', label: 'Other' },
];

const budgetRanges = [
  { value: 'under_5k', label: 'Under $5,000' },
  { value: '5k_10k', label: '$5,000 - $10,000' },
  { value: '10k_25k', label: '$10,000 - $25,000' },
  { value: '25k_50k', label: '$25,000 - $50,000' },
  { value: 'over_50k', label: 'Over $50,000' },
  { value: 'flexible', label: 'Flexible/To Be Discussed' },
];

const timelines = [
  { value: 'asap', label: 'ASAP' },
  { value: '1_month', label: 'Within 1 month' },
  { value: '2_3_months', label: '2-3 months' },
  { value: '3_6_months', label: '3-6 months' },
  { value: 'flexible', label: 'Flexible' },
];

const services = [
  'Full-Stack Development',
  'API Development',
  'Database Design',
  'Cloud Infrastructure',
  'DevOps & CI/CD',
  'Security Audit',
  'Performance Optimization',
  'UI/UX Design',
  'Mobile Development',
  'Data Analytics',
  'Machine Learning',
  'Technical Consulting',
];

export default function QuoteRequestPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      services: [],
      hasExistingSystem: false,
      urgency: 'normal',
      preferredContactMethod: 'email',
    },
  });

  const hasExistingSystem = watch('hasExistingSystem');

  const nextStep = async () => {
    const fieldsToValidate = 
      currentStep === 1 ? ['name', 'email', 'phone', 'company'] :
      currentStep === 2 ? ['projectName', 'projectType', 'budget', 'timeline'] :
      [];
    
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    
    try {
      // Track form submission
      trackFormSubmission('quote_request', {
        project_type: data.projectType,
        budget_range: data.budget,
        timeline: data.timeline,
        services_count: data.services.length,
      });

      // Submit to API
      const response = await fetch('/api/quotes/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quote request');
      }

      toast.success('Quote request submitted successfully!');
      router.push('/quotes/success');
    } catch (error) {
      toast.error('Failed to submit quote request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Request a Quote</h1>
            <p className="text-xl text-gray-400">
              Tell us about your project and we'll provide a detailed quote
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-400">
                {currentStep === 1 ? 'Contact Information' :
                 currentStep === 2 ? 'Project Details' : 'Requirements'}
              </span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <Card className="bg-gray-900/50 border-gray-800 p-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Step 1: Contact Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white mb-6">Contact Information</h2>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        {...register('name')}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="John Doe"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
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
                        Phone Number
                      </label>
                      <input
                        {...register('phone')}
                        type="tel"
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Company *
                      </label>
                      <input
                        {...register('company')}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                        placeholder="Acme Inc."
                      />
                      {errors.company && (
                        <p className="mt-1 text-sm text-red-500">{errors.company.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Project Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white mb-6">Project Details</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Name *
                    </label>
                    <input
                      {...register('projectName')}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                      placeholder="E-commerce Platform Modernization"
                    />
                    {errors.projectName && (
                      <p className="mt-1 text-sm text-red-500">{errors.projectName.message}</p>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Project Type *
                      </label>
                      <select
                        {...register('projectType')}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select project type</option>
                        {projectTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      {errors.projectType && (
                        <p className="mt-1 text-sm text-red-500">{errors.projectType.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Budget Range *
                      </label>
                      <select
                        {...register('budget')}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select budget range</option>
                        {budgetRanges.map(budget => (
                          <option key={budget.value} value={budget.value}>
                            {budget.label}
                          </option>
                        ))}
                      </select>
                      {errors.budget && (
                        <p className="mt-1 text-sm text-red-500">{errors.budget.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Timeline *
                      </label>
                      <select
                        {...register('timeline')}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        <option value="">Select timeline</option>
                        {timelines.map(timeline => (
                          <option key={timeline.value} value={timeline.value}>
                            {timeline.label}
                          </option>
                        ))}
                      </select>
                      {errors.timeline && (
                        <p className="mt-1 text-sm text-red-500">{errors.timeline.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Urgency Level *
                      </label>
                      <select
                        {...register('urgency')}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        <option value="low">Low - We're planning ahead</option>
                        <option value="normal">Normal - Standard timeline</option>
                        <option value="high">High - Need to start soon</option>
                        <option value="urgent">Urgent - Need immediate help</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Requirements */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white mb-6">Project Requirements</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Project Description *
                    </label>
                    <textarea
                      {...register('description')}
                      rows={5}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                      placeholder="Please describe your project in detail, including goals, challenges, and expected outcomes..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Required Services * (select all that apply)
                    </label>
                    <div className="grid md:grid-cols-3 gap-3">
                      {services.map(service => (
                        <label
                          key={service}
                          className="flex items-center gap-3 p-3 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-blue-500 transition-colors cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value={service}
                            {...register('services')}
                            className="w-4 h-4 bg-gray-800 border-gray-700 rounded text-blue-500 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-300">{service}</span>
                        </label>
                      ))}
                    </div>
                    {errors.services && (
                      <p className="mt-1 text-sm text-red-500">{errors.services.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-3 text-gray-300">
                      <input
                        type="checkbox"
                        {...register('hasExistingSystem')}
                        className="w-4 h-4 bg-gray-800 border-gray-700 rounded text-blue-500 focus:ring-blue-500"
                      />
                      Do you have an existing system that needs integration?
                    </label>
                  </div>

                  {hasExistingSystem && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Existing System Details
                      </label>
                      <textarea
                        {...register('existingSystemDetails')}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                        placeholder="Please describe your current system, technologies used, and integration requirements..."
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Preferred Contact Method *
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-gray-300">
                        <input
                          type="radio"
                          value="email"
                          {...register('preferredContactMethod')}
                          className="w-4 h-4 text-blue-500"
                        />
                        Email
                      </label>
                      <label className="flex items-center gap-2 text-gray-300">
                        <input
                          type="radio"
                          value="phone"
                          {...register('preferredContactMethod')}
                          className="w-4 h-4 text-blue-500"
                        />
                        Phone
                      </label>
                      <label className="flex items-center gap-2 text-gray-300">
                        <input
                          type="radio"
                          value="both"
                          {...register('preferredContactMethod')}
                          className="w-4 h-4 text-blue-500"
                        />
                        Either
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Submit Quote Request
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
