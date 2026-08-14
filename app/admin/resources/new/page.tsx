'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';


function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}


export default function NewResourcePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');

  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const [requiresEmail, setRequiresEmail] = useState(true);

  const [file, setFile] = useState<File | null>(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');


  const handleTitleChange = (
    value: string
  ) => {

    setTitle(value);

    // automatic slug generation
    setSlug(createSlug(value));

  };


  const uploadFile = async () => {

    if (!file) return null;


    const fileName =
      `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;


    const {
      error: uploadError
    } = await supabase.storage
      .from('resources')
      .upload(fileName, file);


    if (uploadError) {
      throw new Error(
        uploadError.message
      );
    }


    const {
      data
    } = supabase.storage
      .from('resources')
      .getPublicUrl(fileName);


    return data.publicUrl;

  };


  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setSaving(true);
    setError('');


    try {


      let fileUrl = null;


      if (file) {

        fileUrl = await uploadFile();

      }



      const {
        error: insertError
      } = await supabase
        .from('resources')
        .insert({

          title,

          slug,

          description,

          category,

          requires_email: requiresEmail,

          file_url: fileUrl,

          is_published: true,

        });



      if (insertError) {

        throw new Error(
          insertError.message
        );

      }



      router.push(
        '/admin/resources'
      );


    } catch (err:any) {

      console.error(err);

      setError(
        err.message ||
        'Failed creating resource'
      );

    } finally {

      setSaving(false);

    }

  };


  return (

    <div className="space-y-6">

      <Link
        href="/admin/resources"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
      >

        <ArrowLeft className="h-4 w-4" />

        Back to resources

      </Link>


      <div>

        <h1 className="font-display text-2xl font-bold">
          Add Resource
        </h1>

        <p className="text-muted-foreground mt-1">
          Upload downloadable resources for website visitors.
        </p>

      </div>



      <Card className="border-border/60">

        <CardContent className="pt-6">


          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >


            <div className="space-y-2">

              <Label>
                Resource Title
              </Label>

              <Input
                value={title}
                onChange={(e)=>
                  handleTitleChange(
                    e.target.value
                  )
                }
                placeholder="Business Growth Checklist"
                required
              />

            </div>



            <div className="space-y-2">

              <Label>
                Slug
              </Label>

              <Input
                value={slug}
                readOnly
                className="bg-muted"
              />

              <p className="text-xs text-muted-foreground">
                Automatically generated from title.
              </p>

            </div>




            <div className="space-y-2">

              <Label>
                Description
              </Label>

              <Textarea
                value={description}
                onChange={(e)=>
                  setDescription(
                    e.target.value
                  )
                }
                placeholder="Describe this resource..."
                required
              />

            </div>




            <div className="space-y-2">

              <Label>
                Category
              </Label>

              <Input
                value={category}
                onChange={(e)=>
                  setCategory(
                    e.target.value
                  )
                }
                placeholder="Strategy"
              />

            </div>




            <div className="space-y-2">

              <Label>
                Upload File
              </Label>


              <Input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={(e)=>
                  setFile(
                    e.target.files?.[0] || null
                  )
                }
              />


              <p className="text-xs text-muted-foreground">
                Uploaded files are stored in Supabase Storage bucket: resources
              </p>


            </div>




            <div className="flex items-center gap-3">

              <input
                type="checkbox"
                checked={requiresEmail}
                onChange={(e)=>
                  setRequiresEmail(
                    e.target.checked
                  )
                }
              />

              <Label>
                Require email before download
              </Label>


            </div>




            {error && (

              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">

                <p className="text-sm text-destructive">
                  {error}
                </p>

              </div>

            )}



            <Button
              type="submit"
              disabled={saving}
              className="gap-2"
            >

              {
                saving &&
                <Loader2 className="h-4 w-4 animate-spin"/>
              }


              {
                saving
                ? 'Saving...'
                : (
                  <>
                    <Upload className="h-4 w-4"/>
                    Create Resource
                  </>
                )
              }


            </Button>


          </form>


        </CardContent>

      </Card>


    </div>

  );

}