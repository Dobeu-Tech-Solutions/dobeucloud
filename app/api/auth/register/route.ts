import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      supabaseId,
      email,
      name,
      phone,
      company,
      newsletterSubscribed = false,
      smsOptIn = false,
      emailVerified = false,
    } = body;

    if (!supabaseId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { supabaseId }],
    });

    if (existingUser) {
      // Update existing user (in case of OAuth login)
      existingUser.supabaseId = supabaseId;
      existingUser.emailVerified = emailVerified || existingUser.emailVerified;
      if (name) existingUser.name = name;
      if (phone) existingUser.phone = phone;
      await existingUser.save();

      return NextResponse.json({ user: existingUser }, { status: 200 });
    }

    // Create new user
    const user = await User.create({
      supabaseId,
      email,
      name,
      phone,
      emailVerified,
      newsletterSubscribed,
      smsOptIn,
      role: 'client',
      language: 'en',
      theme: 'system',
    });

    // Log analytics event
    // TODO: Add analytics logging

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
