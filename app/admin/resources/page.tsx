'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Download,
  Eye,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { supabase } from '@/lib/supabase';


type Resource = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  category?: string | null;
  file_url?: string | null;
  requires_email: boolean;
  is_published: boolean;
  created_at: string;
};


export default function AdminResourcesPage() {

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');


  useEffect(() => {
    loadResources();
  }, []);


  async function loadResources() {

    setLoading(true);
    setError('');

    const { data, error } = await supabase
      .from('resources')
      .select(`
        id,
        title,
        slug,
        description,
        category,
        file_url,
        requires_email,
        is_published,
        created_at
      `)
      .order('created_at', {
        ascending: false,
      });


    if (error) {
      console.error(error);
      setError(error.message);
      setResources([]);
    } else {
      setResources(data || []);
    }

    setLoading(false);
  }



  async function handleDelete(id: string) {

    const confirmed = confirm(
      'Are you sure you want to delete this resource?'
    );

    if (!confirmed) return;


    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);


    if (error) {
      alert(error.message);
      return;
    }


    loadResources();
  }



  const filteredResources = resources.filter((resource)=> {

    const term = search.toLowerCase();

    return (
      resource.title
        .toLowerCase()
        .includes(term)
      ||
      resource.slug
        .toLowerCase()
        .includes(term)
    );

  });



  return (

    <div className="space-y-6">


      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <h1 className="font-display text-2xl font-bold">
            Resources
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage downloadable guides, templates and resources.
          </p>

        </div>


        <Link href="/admin/resources/new">

          <Button className="gap-2">

            <Plus className="h-4 w-4"/>

            Add Resource

          </Button>

        </Link>


      </div>



      <div className="relative max-w-md">

        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>


        <Input

          placeholder="Search resources..."

          value={search}

          onChange={(e)=>setSearch(e.target.value)}

          className="pl-10"

        />

      </div>




      {error && (

        <Card>

          <CardContent className="p-5 text-destructive">

            {error}

          </CardContent>

        </Card>

      )}




      {loading ? (

        <p className="animate-pulse text-muted-foreground">
          Loading resources...
        </p>


      ) : filteredResources.length === 0 ? (

        <Card>

          <CardContent className="p-8 text-center">

            <Download className="mx-auto h-12 w-12 text-muted-foreground"/>

            <p className="mt-4 text-muted-foreground">
              No resources found.
            </p>

          </CardContent>

        </Card>


      ) : (


        <div className="space-y-3">


          {filteredResources.map((resource)=>(


            <Card
              key={resource.id}
              className="border-border/60"
            >

              <CardContent className="p-5">


                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">


                  <div className="flex-1">


                    <div className="flex flex-wrap gap-2">


                      <Badge>

                        {resource.is_published
                          ? 'Published'
                          : 'Draft'}

                      </Badge>


                      <Badge variant="outline">

                        {resource.category || 'General'}

                      </Badge>


                      {resource.requires_email && (

                        <Badge variant="secondary">

                          Email required

                        </Badge>

                      )}


                    </div>



                    <h3 className="mt-3 font-semibold">

                      {resource.title}

                    </h3>


                    <p className="text-sm text-muted-foreground">

                      /resources/{resource.slug}

                    </p>


                  </div>



                  <div className="flex gap-2">


                    <Link
                      href={`/resources/${resource.slug}`}
                      target="_blank"
                    >

                      <Button
                        variant="ghost"
                        size="icon"
                        title="View resource"
                      >

                        <Eye className="h-4 w-4"/>

                      </Button>

                    </Link>



                    <Link
                      href={`/admin/resources/${resource.id}`}
                    >

                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit resource"
                      >

                        <Edit className="h-4 w-4"/>

                      </Button>

                    </Link>



                    <Button

                      variant="ghost"

                      size="icon"

                      title="Delete resource"

                      className="text-destructive"

                      onClick={()=>handleDelete(resource.id)}

                    >

                      <Trash2 className="h-4 w-4"/>

                    </Button>



                  </div>


                </div>


              </CardContent>

            </Card>


          ))}


        </div>


      )}


    </div>

  );

}