import { NextResponse } from 'next/server'
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Rest of the function...
}