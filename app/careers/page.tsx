'use client';

import { useEffect, useState } from 'react';
import { Briefcase, MapPin, DollarSign, Clock, ArrowRight, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

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

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    const { data } = await supabase
      .from('jobs')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    setJobs(data || []);
    setLoading(false);
  };

  return (
    <main className="pt-16">
      {/* Header */}
      <section className="relative py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
            Careers
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
            Join our <span className="text-accent">growing team</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-pretty">
            We're looking for talented people who share our passion for helping
            businesses grow. Build your career with Salesway Consulting.
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Why work with us
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Build a meaningful career helping businesses succeed
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Building2,
                title: 'Impact',
                description: 'Work directly with clients to drive real business results and see your impact.'
              },
              {
                icon: Briefcase,
                title: 'Growth',
                description: 'Continuous learning opportunities and clear career progression paths.'
              },
              {
                icon: DollarSign,
                title: 'Competitive',
                description: 'Competitive compensation, benefits, and performance-based bonuses.'
              }
            ].map((item) => (
              <Card key={item.title} className="border-border/60">
                <CardContent className="p-6 space-y-4">
                  <item.icon className="h-8 w-8 text-primary" />
                  <h3 className="font-display text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Open Positions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Find your next opportunity
            </p>
          </div>
          {loading ? (
            <div className="animate-pulse text-center text-muted-foreground">Loading positions...</div>
          ) : jobs.length === 0 ? (
            <Card className="border-border/60">
              <CardContent className="pt-12 pb-12 text-center">
                <Briefcase className="mx-auto h-16 w-16 text-muted-foreground/30" />
                <p className="mt-4 text-muted-foreground">No open positions at the moment.</p>
                <p className="mt-2 text-sm text-muted-foreground">Check back soon or send us your resume.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} className="border-border/60 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-display text-xl font-bold text-foreground">{job.title}</h3>
                          <Badge variant="outline" className="mt-1">{job.department}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.type}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {job.salary_range}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                      </div>
                      <Button className="gap-2 sm:w-auto" asChild>
                        <a href={`/careers/${job.id}`}>
                          Apply Now
                          <ArrowRight className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-transparent">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Our Culture
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We believe in practical solutions, continuous learning, and genuine
            partnerships. Our team is collaborative, supportive, and driven by
            results.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {[
              'Hands-on approach to problem solving',
              'Continuous learning and development',
              'Collaborative team environment',
              'Work-life balance'
            ].map((value) => (
              <div key={value} className="text-left p-4 rounded-lg border border-border/60 bg-card">
                <p className="text-sm text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Don't see a fit?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We're always looking for talented people. Send us your resume and
            we'll keep you in mind for future opportunities.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button className="gap-2" asChild>
              <a href="/contact">
                Send Your Resume
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
