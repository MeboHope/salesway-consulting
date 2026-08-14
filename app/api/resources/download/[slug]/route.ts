import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;

    // Get resource details
    const { data: resource, error: resourceError } = await supabase
      .from('resources')
      .select('file_url, file_name')
      .eq('slug', slug)
      .single();

    if (resourceError || !resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    if (!resource.file_url) {
      return NextResponse.json(
        { error: 'No file URL available' },
        { status: 400 }
      );
    }

    // Redirect to the file URL
    return NextResponse.redirect(resource.file_url);
  } catch (error) {
    console.error('Error downloading resource:', error);
    return NextResponse.json(
      { error: 'Failed to download resource' },
      { status: 500 }
    );
  }
}
