'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Briefcase,
  MapPin,
  Clock,
  Building2,
  Search,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { fallbackJobs } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type Job = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  salary_range: string;
  description: string;
  requirements: string;
  is_published: boolean;
  created_at: string;
};

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('jobs')
        .select(
          `
            id,
            title,
            department,
            location,
            type,
            salary_range,
            description,
            requirements,
            is_published,
            created_at
          `
        )
        .eq('is_published', true)
        .order('created_at', {
          ascending: false,
        });

      if (error) {
        console.error('Error loading careers:', error);

        setJobs(
          (fallbackJobs || []) as Job[]
        );
      } else if (data && data.length > 0) {
        setJobs(data as Job[]);
      } else {
        setJobs(
          (fallbackJobs || []) as Job[]
        );
      }

      setLoading(false);
    };

    loadJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      job.title.toLowerCase().includes(query) ||
      job.department.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      job.type.toLowerCase().includes(query)
    );
  });

  return (
    <main className="pt-16">

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20 sm:py-24">

        <div className="absolute inset-0 bg-grid opacity-20" />

        <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">

          <Badge
            variant="secondary"
            className="mb-5 bg-primary/10 text-primary"
          >
            Careers
          </Badge>

          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Build your career with{' '}
            <span className="text-accent">
              Salesway Consulting
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Join a team helping businesses improve sales,
            strategy, marketing, leadership, and sustainable
            growth across East Africa.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="#openings">
              <Button
                size="lg"
                className="w-full gap-2 sm:w-auto"
              >
                View Open Positions
                <ArrowRight className="h-5 w-5" />
              </Button>
            </a>

            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                Contact Us
              </Button>
            </Link>
          </div>

        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-16 sm:py-20">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">

            <Badge
              variant="secondary"
              className="mb-4 bg-accent/10 text-accent"
            >
              Why Salesway
            </Badge>

            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Grow with a team that values impact
            </h2>

            <p className="mt-4 text-muted-foreground">
              We believe great work happens when talented people
              have the freedom, support, and responsibility to
              make a difference.
            </p>

          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <Card className="border-border/60">
              <CardContent className="p-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Briefcase className="h-6 w-6" />
                </div>

                <h3 className="mt-5 font-display text-lg font-semibold">
                  Meaningful Work
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Work directly with businesses and leaders
                  to solve real challenges and create measurable
                  results.
                </p>

              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardContent className="p-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Building2 className="h-6 w-6" />
                </div>

                <h3 className="mt-5 font-display text-lg font-semibold">
                  Professional Growth
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Develop your consulting, sales, strategy,
                  leadership, and communication skills.
                </p>

              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardContent className="p-6">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ArrowRight className="h-6 w-6" />
                </div>

                <h3 className="mt-5 font-display text-lg font-semibold">
                  Real Responsibility
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Take ownership of projects and contribute
                  directly to the growth of the business and
                  our clients.
                </p>

              </CardContent>
            </Card>

          </div>

        </div>
      </section>

      {/* Open Positions */}
      <section
        id="openings"
        className="bg-muted/30 py-16 sm:py-20"
      >

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

            <div>

              <Badge
                variant="secondary"
                className="mb-4 bg-primary/10 text-primary"
              >
                Opportunities
              </Badge>

              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Open positions
              </h2>

              <p className="mt-3 max-w-2xl text-muted-foreground">
                Explore our current opportunities and find a
                role where you can make an impact.
              </p>

            </div>

            <div className="relative w-full md:max-w-sm">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search positions..."
                className="h-10 w-full rounded-md border border-border bg-background pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />

            </div>

          </div>

          <div className="mt-10">

            {loading ? (

              <div className="space-y-4">

                {[1, 2, 3].map((item) => (
                  <Card
                    key={item}
                    className="border-border/60"
                  >
                    <CardContent className="p-6">

                      <div className="animate-pulse space-y-4">

                        <div className="h-5 w-1/3 rounded bg-muted" />

                        <div className="h-4 w-2/3 rounded bg-muted" />

                        <div className="h-4 w-full rounded bg-muted" />

                      </div>

                    </CardContent>
                  </Card>
                ))}

              </div>

            ) : filteredJobs.length === 0 ? (

              <Card className="border-border/60">
                <CardContent className="flex flex-col items-center py-16 text-center">

                  <Briefcase className="h-14 w-14 text-muted-foreground/30" />

                  <h3 className="mt-5 font-display text-xl font-semibold">
                    No open positions found
                  </h3>

                  <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    We don't currently have a position matching
                    your search. Check back later or contact us
                    to introduce yourself.
                  </p>

                  <Link href="/contact">
                    <Button
                      variant="outline"
                      className="mt-6"
                    >
                      Contact Us
                    </Button>
                  </Link>

                </CardContent>
              </Card>

            ) : (

              <div className="space-y-5">

                {filteredJobs.map((job) => (

                  <Card
                    key={job.id}
                    className="border-border/60 transition-shadow hover:shadow-md"
                  >

                    <CardHeader>

                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                        <div>

                          <div className="flex flex-wrap items-center gap-2">

                            <Badge>
                              {job.type}
                            </Badge>

                            {job.department && (
                              <Badge variant="outline">
                                {job.department}
                              </Badge>
                            )}

                          </div>

                          <CardTitle className="mt-3 font-display text-xl sm:text-2xl">
                            {job.title}
                          </CardTitle>

                          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">

                            {job.location && (
                              <span className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                {job.location}
                              </span>
                            )}

                            {job.type && (
                              <span className="flex items-center gap-1.5">
                                <Clock className="h-4 w-4" />
                                {job.type}
                              </span>
                            )}

                            {job.department && (
                              <span className="flex items-center gap-1.5">
                                <Building2 className="h-4 w-4" />
                                {job.department}
                              </span>
                            )}

                          </div>

                        </div>

                        <div className="shrink-0">

                          <Link
                            href={`/careers/${job.id}/apply`}
                          >
                            <Button className="w-full gap-2 sm:w-auto">
                              Apply Now
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>

                        </div>

                      </div>

                    </CardHeader>

                    <CardContent>

                      {job.salary_range && (
                        <div className="mb-5 rounded-lg bg-primary/5 px-4 py-3">
                          <p className="text-sm">
                            <span className="font-semibold">
                              Salary:
                            </span>{' '}
                            {job.salary_range}
                          </p>
                        </div>
                      )}

                      <div className="grid gap-6 lg:grid-cols-2">

                        <div>

                          <h3 className="font-display font-semibold">
                            About the role
                          </h3>

                          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                            {job.description}
                          </p>

                        </div>

                        {job.requirements && (
                          <div>

                            <h3 className="font-display font-semibold">
                              Requirements
                            </h3>

                            <div className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                              {job.requirements}
                            </div>

                          </div>
                        )}

                      </div>

                      <div className="mt-6 border-t border-border/60 pt-5">

                        <Link
                          href={`/careers/${job.id}/apply`}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                        >
                          Apply for this position
                          <ArrowRight className="h-4 w-4" />
                        </Link>

                      </div>

                    </CardContent>

                  </Card>

                ))}

              </div>

            )}

          </div>

        </div>
      </section>

      {/* General CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/85 py-20">

        <div className="absolute inset-0 bg-grid opacity-10" />

        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">

          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Don't see the right position?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            We're always interested in meeting talented,
            motivated people. Send us a general enquiry and
            tell us how you could contribute to Salesway.
          </p>

          <Link href="/contact">
            <Button
              size="lg"
              variant="secondary"
              className="mt-8 gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Contact Us
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>

        </div>
      </section>

    </main>
  );
}