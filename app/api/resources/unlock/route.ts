import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function sendDownloadEmail(email: string, name: string, resourceTitle: string, downloadLink: string) {
  if (!resend) {
    console.warn('Resend API key not configured. Email not sent.');
    return;
  }

  try {
    await resend.emails.send({
      from: 'Salesway Consulting <noreply@saleswayconsulting.com>',
      to: email,
      subject: `Your download: ${resourceTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Download Your Resource</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #2563eb;">Your Resource is Ready!</h2>
              <p>Hi ${name || 'there'},</p>
              <p>Thank you for your interest in <strong>${resourceTitle}</strong>.</p>
              <p>You can download your resource using the link below:</p>
              <div style="margin: 30px 0;">
                <a href="${downloadLink}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Download Now</a>
              </div>
              <p>This link will expire in 24 hours for security.</p>
              <p>We'll also send you practical growth tips and insights to help your business grow.</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 12px; color: #6b7280;">
                Best regards,<br>
                The Salesway Consulting Team
              </p>
            </div>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't fail the request if email fails
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, resourceId } = body;

    if (!email || !resourceId) {
      return NextResponse.json(
        { error: 'Email and resource ID are required' },
        { status: 400 }
      );
    }

    // Get resource details
    const { data: resource, error: resourceError } = await supabase
      .from('resources')
      .select('title, file_url, slug')
      .eq('id', resourceId)
      .single();

    if (resourceError || !resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    // Add to subscribers table
    const { error: subscriberError } = await supabase
      .from('newsletter_subscribers')
      .upsert(
        {
          email,
          name,
          consent: true,
          confirmed: false,
          created_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      );

    if (subscriberError) {
      console.error('Error adding subscriber:', subscriberError);
    }

    // Generate download link
    const downloadLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/resources/download/${resource.slug}`;

    // Send email with download link
    await sendDownloadEmail(email, name || '', resource.title, downloadLink);

    return NextResponse.json({
      success: true,
      downloadLink,
      message: 'Check your email for the download link',
    });
  } catch (error) {
    console.error('Error unlocking resource:', error);
    return NextResponse.json(
      { error: 'Failed to unlock resource' },
      { status: 500 }
    );
  }
}
