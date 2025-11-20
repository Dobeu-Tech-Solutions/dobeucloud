import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Quote from '@/lib/models/Quote';
import Contact from '@/lib/models/Contact';
import Analytics from '@/lib/models/Analytics';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      projectName,
      projectType,
      budget,
      timeline,
      description,
      services,
      hasExistingSystem,
      existingSystemDetails,
      urgency,
      preferredContactMethod,
    } = body;

    await dbConnect();

    // Get current user if authenticated
    const supabase = createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Create contact record
    const contact = await Contact.create({
      name,
      email,
      phone,
      company,
      subject: `Quote Request: ${projectName}`,
      message: description,
      source: 'quote_request',
      priority: urgency === 'urgent' ? 'high' : urgency === 'high' ? 'high' : 'medium',
      metadata: {
        ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
        referrer: request.headers.get('referer'),
      },
    });

    // Calculate estimated cost based on budget range
    const budgetMap: Record<string, { min: number; max: number }> = {
      'under_5k': { min: 1000, max: 5000 },
      '5k_10k': { min: 5000, max: 10000 },
      '10k_25k': { min: 10000, max: 25000 },
      '25k_50k': { min: 25000, max: 50000 },
      'over_50k': { min: 50000, max: 100000 },
      'flexible': { min: 0, max: 0 },
    };

    const budgetRange = budgetMap[budget] || { min: 0, max: 0 };
    const estimatedAmount = budgetRange.min + (budgetRange.max - budgetRange.min) / 2;

    // Create quote
    const quote = await Quote.create({
      client: user?.id || contact._id, // Use authenticated user ID or contact ID
      projectName,
      projectScope: description,
      services,
      issueDate: new Date(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      status: 'draft',
      items: [
        {
          service: services.join(', '),
          description: `${projectType} - ${timeline}`,
          quantity: 1,
          rate: estimatedAmount,
          amount: estimatedAmount,
        },
      ],
      subtotal: estimatedAmount,
      discount: 0,
      discountType: 'percentage',
      total: estimatedAmount,
      currency: 'USD',
      notes: `Additional Information:\n${hasExistingSystem ? `Existing System: ${existingSystemDetails}` : 'No existing system'}\nUrgency: ${urgency}\nPreferred Contact: ${preferredContactMethod}`,
    });

    // Track analytics
    await Analytics.create({
      event: 'quote_requested',
      category: 'conversion',
      userId: user?.id,
      sessionId: request.headers.get('x-session-id') || 'unknown',
      data: {
        quoteId: quote.quoteNumber,
        projectType,
        budget,
        timeline,
        servicesCount: services.length,
        urgency,
      },
    });

    // Send notification email to admin
    if (process.env.ADMIN_EMAIL) {
      await fetch('/api/emails/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: process.env.ADMIN_EMAIL,
          subject: `New Quote Request: ${projectName}`,
          html: `
            <h2>New Quote Request Received</h2>
            <p><strong>Contact:</strong> ${name} (${email})</p>
            <p><strong>Company:</strong> ${company}</p>
            <p><strong>Project:</strong> ${projectName}</p>
            <p><strong>Type:</strong> ${projectType}</p>
            <p><strong>Budget:</strong> ${budget}</p>
            <p><strong>Timeline:</strong> ${timeline}</p>
            <p><strong>Urgency:</strong> ${urgency}</p>
            <p><strong>Services:</strong> ${services.join(', ')}</p>
            <p><strong>Description:</strong></p>
            <p>${description}</p>
            <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/quotes/${quote._id}">View Quote</a></p>
          `,
        }),
      });
    }

    return NextResponse.json(
      {
        success: true,
        quoteNumber: quote.quoteNumber,
        contactId: contact._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Quote request error:', error);
    return NextResponse.json(
      { error: 'Failed to submit quote request' },
      { status: 500 }
    );
  }
}
