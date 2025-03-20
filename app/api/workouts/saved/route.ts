import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const workouts = await prisma.savedWorkout.findMany({
      where: {
        userEmail: session.user.email
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ workouts });
  } catch (error) {
    console.error('Error fetching saved workouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch saved workouts' },
      { status: 500 }
    );
  }
} 