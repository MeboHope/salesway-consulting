'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Download,
  FileText,
  ArrowRight,
  Lock,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';

import { supabase } from '@/lib/supabase';
import {
  fallbackResources,
  type ResourceSummary,
} from '@/lib/data';


type Resource = ResourceSummary & {
  file_url?: string | null;
};


export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeResource, setActiveResource] =
    useState<Resource | null>(null);

  const [emailStatus, setEmailStatus] =
    useState<'idle' | 'loading' | 'success'>('idle');

  const [downloadLink, setDownloadLink] =
    useState<string | null>(null);


  useEffect(() => {
    loadResources();
  }, []);


  async function loadResources() {
    const { data, error } = await supabase
      .from('resources')
      .select(
        `
        id,
        title,
        slug,
        description,
        category,
        requires_email,
        file_url
        `
      )
      .eq('is_published', true)
      .order('created_at', {
        ascending: false,
      });


    if (error || !data || data.length === 0) {
      setResources(
        fallbackResources as Resource[]
      );
    } else {
      setResources(data as Resource[]);
    }

    setLoading(false);
  }


  async function handleUnlock(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!activeResource) return;


    setEmailStatus('loading');


    const form =
      new FormData(e.currentTarget);


    const name =
      form.get('name') as string;

    const email =
      form.get('email') as string;


    try {
      const response =
        await fetch('/api/resources/unlock', {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            resourceId:
              activeResource.id,
          }),
        });


      const result =
        await response.json();


      if (!response.ok) {
        throw new Error(
          result.error ||
          'Unable to unlock resource'
        );
      }


      setDownloadLink(
        result.downloadLink
      );

      setEmailStatus('success');

    } catch (error) {
      console.error(error);
      setEmailStatus('idle');
      alert(
        'Failed to unlock resource'
      );
    }
  }



  return (
    <main className="pt-16">

      <section className="relative py-20">

        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />


        <div className="relative mx-auto max-w-4xl px-4 text-center">

          <Badge
            variant="secondary"
            className="mb-4 bg-accent/10 text-accent"
          >
            Free Resources
          </Badge>


          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Tools to help you{' '}
            <span className="text-accent">
              grow smarter
            </span>
          </h1>


          <p className="mt-6 text-lg text-muted-foreground">
            Download practical templates,
            guides, and checklists designed
            to help your business grow.
          </p>


        </div>


        <div className="mt-12 mx-auto max-w-4xl px-4">

          <div className="overflow-hidden rounded-[2rem] shadow-xl border">

            <Image
              src="/images/b_generate_for_me_thre.png"
              alt="Resources"
              width={1400}
              height={900}
              className="w-full object-cover"
            />

          </div>

        </div>

      </section>



      <section className="py-12">

        <div className="mx-auto max-w-7xl px-4">

          {loading ? (

            <div className="text-center text-muted-foreground">
              Loading resources...
            </div>

          ) : (

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">


              {resources.map((resource) => (

                <Card
                  key={resource.id}
                  className="border-border/60 hover:shadow-xl transition"
                >

                  <div className="h-36 flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">

                    <FileText className="h-12 w-12 text-primary/40" />

                  </div>


                  <CardContent className="pt-5">

                    {resource.category && (

                      <Badge
                        variant="secondary"
                        className="text-primary"
                      >
                        {resource.category}
                      </Badge>

                    )}


                    <h3 className="mt-3 font-display text-xl font-semibold">
                      {resource.title}
                    </h3>


                    <p className="mt-2 text-sm text-muted-foreground">
                      {resource.description}
                    </p>



                    <div className="mt-5">

                      {resource.requires_email ? (

                        <Dialog>

                          <DialogTrigger asChild>

                            <Button
                              className="w-full gap-2"
                              variant="outline"
                              onClick={() => {
                                setActiveResource(resource);
                                setEmailStatus('idle');
                                setDownloadLink(null);
                              }}
                            >

                              <Lock className="h-4 w-4" />

                              Unlock Resource

                            </Button>

                          </DialogTrigger>


                          <DialogContent>

                            <DialogHeader>

                              <DialogTitle>
                                Unlock {resource.title}
                              </DialogTitle>


                              <DialogDescription>
                                Enter your details to receive access.
                              </DialogDescription>

                            </DialogHeader>



                            {emailStatus === 'success' ? (

                              <div className="text-center space-y-4">

                                <CheckCircle2 className="mx-auto h-12 w-12 text-accent"/>


                                <p>
                                  Resource unlocked successfully.
                                </p>


                                <Button
                                  asChild
                                  className="w-full gap-2"
                                >

                                  <a
                                    href={downloadLink || '#'}
                                    target="_blank"
                                  >

                                    <Download className="h-4 w-4"/>

                                    Download

                                  </a>

                                </Button>

                              </div>


                            ) : (

                              <form
                                onSubmit={handleUnlock}
                                className="space-y-4"
                              >

                                <div>
                                  <Label>Name</Label>
                                  <Input
                                    name="name"
                                    required
                                  />
                                </div>


                                <div>
                                  <Label>Email</Label>
                                  <Input
                                    name="email"
                                    type="email"
                                    required
                                  />
                                </div>


                                <Button
                                  disabled={
                                    emailStatus === 'loading'
                                  }
                                  className="w-full gap-2"
                                >

                                  {emailStatus === 'loading' &&
                                    <Loader2 className="h-4 w-4 animate-spin"/>
                                  }

                                  Unlock & Download

                                </Button>


                              </form>

                            )}

                          </DialogContent>


                        </Dialog>


                      ) : (

                        <Button
                          className="w-full gap-2"
                          variant="outline"
                          asChild
                        >

                          <a
                            href={resource.file_url || '#'}
                            target="_blank"
                          >

                            <Download className="h-4 w-4"/>

                            Download

                          </a>

                        </Button>

                      )}


                      <Link
                        href={`/resources/${resource.slug}`}
                        className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-primary"
                      >

                        View Details

                        <ArrowRight className="h-4 w-4"/>

                      </Link>


                    </div>


                  </CardContent>


                </Card>

              ))}


            </div>

          )}

        </div>

      </section>


    </main>
  );
}