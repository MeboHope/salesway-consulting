import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { createClient } from '@/lib/supabase/server';

const resendApiKey =
  process.env.RESEND_API_KEY;

const resendFromEmail =
  process.env.RESEND_FROM_EMAIL;

const resendToEmail =
  process.env.RESEND_TO_EMAIL;

const resend = resendApiKey
  ? new Resend(resendApiKey)
  : null;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const name = String(
      body?.name || ''
    ).trim();

    const email = String(
      body?.email || ''
    )
      .trim()
      .toLowerCase();

    if (!name) {
      return NextResponse.json(
        {
          error:
            'Please enter your name.',
        },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          error:
            'Please enter your email address.',
        },
        { status: 400 }
      );
    }

    /*
     * Basic email validation.
     */
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        {
          error:
            'Please enter a valid email address.',
        },
        { status: 400 }
      );
    }

    const supabase =
      await createClient();

    /*
     * Check whether this email already exists.
     */
    const {
      data: existingSubscriber,
      error: lookupError,
    } = await supabase
      .from('newsletter_subscribers')
      .select('id, email')
      .eq('email', email)
      .maybeSingle();

    if (lookupError) {
      console.error(
        'Newsletter lookup error:',
        JSON.stringify(
          lookupError,
          null,
          2
        )
      );

      return NextResponse.json(
        {
          error:
            'We could not process your subscription. Please try again.',
        },
        { status: 500 }
      );
    }

    /*
     * Existing subscriber.
     */
    if (existingSubscriber) {
      return NextResponse.json({
        success: true,
        alreadySubscribed: true,
        emailSent: false,
      });
    }

    /*
     * Save the subscriber.
     *
     * confirmed=true is intentional for the
     * current Salesway implementation because
     * we are not implementing a double-opt-in
     * confirmation workflow yet.
     */
    const {
      error: databaseError,
    } = await supabase
      .from('newsletter_subscribers')
      .insert({
        name,
        email,
        consent: true,
        confirmed: true,
      });

    if (databaseError) {
      console.error(
        'Newsletter database error:',
        JSON.stringify(
          databaseError,
          null,
          2
        )
      );

      return NextResponse.json(
        {
          error:
            'We could not save your subscription. Please try again.',
        },
        { status: 500 }
      );
    }

    /*
     * If Resend isn't configured, the
     * subscription has still been saved.
     */
    if (
      !resend ||
      !resendFromEmail
    ) {
      console.warn(
        'Resend is not configured. Subscriber saved successfully, but no email was sent.'
      );

      return NextResponse.json({
        success: true,
        alreadySubscribed: false,
        emailSent: false,
      });
    }

    const safeName =
      escapeHtml(name);

    const safeEmail =
      escapeHtml(email);

    /*
     * Send welcome email to subscriber.
     */
    const {
      error: subscriberEmailError,
    } = await resend.emails.send({
      from: resendFromEmail,
      to: [email],
      subject:
        'Welcome to Salesway Consulting',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="
            margin:0;
            padding:0;
            background:#f5f7fa;
            font-family:Arial,Helvetica,sans-serif;
          ">
            <div style="
              max-width:600px;
              margin:40px auto;
              background:#ffffff;
              padding:40px;
              border-radius:12px;
            ">
              <h1 style="
                color:#123b5d;
                margin-top:0;
              ">
                Welcome to Salesway Consulting
              </h1>

              <p>
                Hi ${safeName},
              </p>

              <p>
                Thank you for subscribing to
                the Salesway Consulting newsletter.
              </p>

              <p>
                You'll receive practical insights
                on sales, strategy, marketing and
                sustainable business growth.
              </p>

              <p>
                We look forward to sharing valuable
                ideas with you.
              </p>

              <p>
                Regards,<br />
                <strong>
                  Salesway Consulting
                </strong>
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (subscriberEmailError) {
      console.error(
        'Subscriber email error:',
        JSON.stringify(
          subscriberEmailError,
          null,
          2
        )
      );
    }

    /*
     * Notify the company/admin.
     */
    if (resendToEmail) {
      const {
        error: adminEmailError,
      } = await resend.emails.send({
        from: resendFromEmail,
        to: [resendToEmail],
        subject:
          'New Salesway Newsletter Subscriber',
        html: `
          <!DOCTYPE html>
          <html>
            <body style="
              font-family:Arial,Helvetica,sans-serif;
              line-height:1.6;
            ">
              <h2>
                New Newsletter Subscriber
              </h2>

              <p>
                <strong>Name:</strong>
                ${safeName}
              </p>

              <p>
                <strong>Email:</strong>
                ${safeEmail}
              </p>

              <p>
                This subscriber has been saved
                in the Salesway Consulting database.
              </p>
            </body>
          </html>
        `,
      });

      if (adminEmailError) {
        console.error(
          'Admin notification error:',
          JSON.stringify(
            adminEmailError,
            null,
            2
          )
        );
      }
    }

    return NextResponse.json({
      success: true,
      alreadySubscribed: false,
      emailSent:
        !subscriberEmailError,
    });
  } catch (error) {
    console.error(
      'Newsletter subscription error:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Something went wrong while subscribing. Please try again.',
      },
      { status: 500 }
    );
  }
}