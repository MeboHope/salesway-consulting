import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

const BUCKET =
  process.env.JOB_APPLICATIONS_STORAGE_BUCKET ||
  'job-applications';

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await context.params;

    const url = new URL(
      request.url
    );

    const type =
      url.searchParams.get(
        'type'
      );

    if (
      type !== 'cv' &&
      type !== 'qualification'
    ) {
      return NextResponse.json(
        {
          error:
            'Invalid document type.',
        },
        {
          status: 400,
        }
      );
    }

    const supabase =
      await createClient();

    /*
     * Verify that an authenticated user
     * exists before allowing document access.
     */
    const {
      data: {
        user,
      },
      error: userError,
    } = await supabase.auth.getUser();

    if (
      userError ||
      !user
    ) {
      return NextResponse.json(
        {
          error:
            'Authentication required.',
        },
        {
          status: 401,
        }
      );
    }

    /*
     * Fetch only the requested application.
     */
    const {
      data: application,
      error: applicationError,
    } = await supabase
      .from('job_applications')
      .select(
        'id, cv_file_path, qualification_file_path'
      )
      .eq('id', id)
      .maybeSingle();

    if (
      applicationError ||
      !application
    ) {
      return NextResponse.json(
        {
          error:
            applicationError?.message ||
            'Application not found.',
        },
        {
          status: 404,
        }
      );
    }

    const filePath =
      type === 'cv'
        ? application.cv_file_path
        : application.qualification_file_path;

    if (!filePath) {
      return NextResponse.json(
        {
          error:
            'The requested document was not uploaded.',
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Generate a temporary signed URL.
     *
     * The URL expires after 5 minutes.
     */
    const {
      data: signedUrl,
      error: signedUrlError,
    } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(
        filePath,
        60 * 5
      );

    if (
      signedUrlError ||
      !signedUrl?.signedUrl
    ) {
      console.error(
        'Storage signed URL error:',
        signedUrlError
      );

      return NextResponse.json(
        {
          error:
            signedUrlError?.message ||
            'Unable to generate document access URL.',
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      url: signedUrl.signedUrl,
      expiresIn: 300,
    });
  } catch (error) {
    console.error(
      'Job application document error:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Unable to access the requested document.',
      },
      {
        status: 500,
      }
    );
  }
}