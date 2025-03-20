import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { title, content } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const savedWorkout = await prisma.savedWorkout.create({
      data: {
        title,
        content,
        userEmail: session.user.email,
      }
    });

    return NextResponse.json({ workout: savedWorkout });
  } catch (error) {
    console.error('Error saving workout:', error);
    return NextResponse.json(
      { error: 'Failed to save workout' },
      { status: 500 }
    );
  }
} 