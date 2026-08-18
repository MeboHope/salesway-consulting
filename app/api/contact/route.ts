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
      body.name || ''
    ).trim();

    const email = String(
      body.email || ''
    )
      .trim()
      .toLowerCase();

    const subject = String(
      body.subject || ''
    ).trim();

    const message = String(
      body.message || ''
    ).trim();

    if (!name) {
      return NextResponse.json(
        {
          error:
            'Name is required.',
        },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        {
          error:
            'Email address is required.',
        },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        {
          error:
            'Message is required.',
        },
        { status: 400 }
      );
    }

    /*
     * Save the contact message to Supabase.
     */
    const supabase =
      await createClient();

    const {
      data,
      error: databaseError,
    } = await supabase
      .from('contact_messages')
      .insert({
        name,
        email,
        subject: subject || null,
        message,
        status: 'new',
      })
      .select('id')
      .single();

    if (databaseError) {
      console.error(
        'Contact database error:',
        JSON.stringify(
          databaseError,
          null,
          2
        )
      );

      return NextResponse.json(
        {
          error:
            'We could not save your message. Please try again.',
        },
        { status: 500 }
      );
    }

    /*
     * Email sending is optional until
     * Resend/domain configuration is ready.
     */
    if (
      !resend ||
      !resendFromEmail
    ) {
      console.warn(
        'Resend is not configured. Contact message was saved successfully, but no email was sent.'
      );

      return NextResponse.json({
        success: true,
        messageId: data?.id ?? null,
        emailSent: false,
      });
    }

    const safeName =
      escapeHtml(name);

    const safeEmail =
      escapeHtml(email);

    const safeSubject =
      escapeHtml(
        subject ||
          'Website Contact Message'
      );

    const safeMessage =
      escapeHtml(message).replace(
        /\n/g,
        '<br />'
      );

    /*
     * Notify the company/admin.
     */
    if (resendToEmail) {
      const {
        error: adminEmailError,
      } = await resend.emails.send({
        from: resendFromEmail,
        to: [resendToEmail],
        replyTo: email,
        subject: `New Contact Message: ${safeSubject}`,
        html: `
          <!DOCTYPE html>
          <html>
            <body
              style="
                margin:0;
                padding:0;
                background:#f5f7fa;
                font-family:Arial,Helvetica,sans-serif;
                line-height:1.6;
              "
            >
              <div
                style="
                  max-width:650px;
                  margin:40px auto;
                  background:#ffffff;
                  padding:40px;
                  border-radius:12px;
                "
              >
                <h2
                  style="
                    color:#123b5d;
                    margin-top:0;
                  "
                >
                  New Contact Message
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
                  <strong>Subject:</strong>
                  ${safeSubject}
                </p>

                <hr />

                <p>
                  <strong>Message:</strong>
                </p>

                <p>
                  ${safeMessage}
                </p>

                <hr />

                <p
                  style="
                    color:#666666;
                    font-size:13px;
                  "
                >
                  This message was submitted
                  through the Salesway Consulting
                  website.
                </p>
              </div>
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

    /*
     * Send acknowledgement to the client.
     *
     * Reply-To is set to the client's
     * email so that future replies can
     * go back to them.
     */
    const {
      error: clientEmailError,
    } = await resend.emails.send({
      from: resendFromEmail,
      to: [email],
      replyTo:
        resendToEmail || undefined,
      subject:
        'We received your message - Salesway Consulting',
      html: `
        <!DOCTYPE html>
        <html>
          <body
            style="
              margin:0;
              padding:0;
              background:#f5f7fa;
              font-family:Arial,Helvetica,sans-serif;
              line-height:1.6;
            "
          >
            <div
              style="
                max-width:600px;
                margin:40px auto;
                background:#ffffff;
                padding:40px;
                border-radius:12px;
              "
            >
              <h2
                style="
                  color:#123b5d;
                  margin-top:0;
                "
              >
                Thank you for contacting
                Salesway Consulting
              </h2>

              <p>
                Hi ${safeName},
              </p>

              <p>
                Thank you for reaching out
                to Salesway Consulting.
              </p>

              <p>
                We have received your message
                and a member of our team will
                review it and get back to you.
              </p>

              <div
                style="
                  margin:25px 0;
                  padding:20px;
                  background:#f5f7fa;
                  border-radius:8px;
                "
              >
                <strong>
                  Your subject:
                </strong>

                <p>
                  ${safeSubject}
                </p>
              </div>

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

    if (clientEmailError) {
      console.error(
        'Client acknowledgement error:',
        JSON.stringify(
          clientEmailError,
          null,
          2
        )
      );
    }

    return NextResponse.json({
      success: true,
      messageId:
        data?.id ?? null,
      emailSent:
        !clientEmailError,
    });
  } catch (error) {
    console.error(
      'Contact API error:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Something went wrong while processing your message.',
      },
      { status: 500 }
    );
  }
}