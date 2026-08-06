'use client';

import Link from 'next/link';
import {
  Target, Eye, Heart, Award, Lightbulb, Users, TrendingUp,
  ArrowRight, CheckCircle2, Quote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useReveal } from '@/hooks/use-reveal';

const values = [
  { icon: Target, title: 'Practicality', description: 'Strategies that work in the real world, not just on paper.' },
  { icon: Heart, title: 'Partnership', description: 'We work with you, not just for you — every step of the way.' },
  { icon: Award, title: 'Excellence', description: 'We hold ourselves to the highest standard in everything we do.' },
  { icon: TrendingUp, title: 'Growth', description: 'Every recommendation must move the needle or we don\'t make it.' },
  { icon: Lightbulb, title: 'Innovation', description: 'Fresh thinking applied to your most stubborn challenges.' },
  { icon: Users, title: 'Empowerment', description: 'We build your team\'s capacity, not dependency on us.' },
];

export default function AboutPage() {
  useReveal();

  return (
    <main className="pt-16">
      {/* Header */}
      <section className="relative py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-transparent" />
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
            About Us
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
            We help businesses{' '}
            <span className="text-accent">grow smarter</span>, not just bigger
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-pretty">
            Salesway Consulting was founded on a simple belief: businesses
            deserve a consulting partner who stays until the results show —
            not one who hands over a report and disappears.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="reveal">
              <h2 className="font-display text-3xl font-bold tracking-tight text-balance">
                Our story
              </h2>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
                <p>
                  Salesway Consulting was born from a frustration shared by
                  many business owners: consultants who deliver impressive
                  presentations, charge premium fees, and leave before any
                  real change takes hold.
                </p>
                <p>
                  We do things differently. We believe that strategy without
                  implementation is just theory. That is why we stay alongside
                  our clients — through the messy, unglamorous work of actually
                  making change happen — until measurable improvements are
                  achieved and sustained.
                </p>
                <p>
                  Today, we serve over 120 businesses across East Africa,
                  from ambitious startups to established companies looking
                  for their next chapter of growth.
                </p>
              </div>
            </div>
            <div className="reveal grid grid-cols-2 gap-4" style={{ transitionDelay: '150ms' }}>
              {[
                { value: '120+', label: 'Businesses served' },
                { value: '40%', label: 'Avg. sales growth' },
                { value: '98%', label: 'Client satisfaction' },
                { value: '12+', label: 'Years of experience' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-border/60 bg-transparent p-6 text-center">
                  <div className="font-display text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center reveal">
            <Badge variant="secondary" className="mb-4 bg-accent/10 text-accent">
              Meet the Founder
            </Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              Rachel Waithera
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Founder &amp; Lead Consultant
            </p>
          </div>

          <div className="mt-12 grid gap-12 lg:grid-cols-5 lg:items-start">
            <div className="lg:col-span-2 reveal">
              <div className="relative rounded-2xl border border-border/60 shadow-xl overflow-hidden">
                <img
                  src="/images/IMG-20260804-WA0001.jpg"
                  alt="Rachel Waithera, Founder"
                  className="h-[480px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
              </div>
              <Card className="mt-6 border-border/60">
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-accent/40" />
                  <p className="mt-2 text-base leading-relaxed font-medium">
                    The best strategy is the one your team actually executes.
                    My job is to make execution inevitable.
                  </p>
                  <p className="mt-3 text-sm font-semibold text-primary">
                    — Rachel Waithera
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3 space-y-8 reveal" style={{ transitionDelay: '150ms' }}>
              <div>
                <h3 className="font-display text-xl font-semibold">Biography</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Rachel Waithera is a business growth strategist with over 12
                  years of experience helping companies across East Africa
                  unlock untapped revenue. She has worked with startups, SMEs,
                  and established enterprises across retail, manufacturing,
                  financial services, and technology.
                </p>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  Before founding Salesway Consulting, Rachel held senior
                  sales and strategy roles at leading companies where she
                  consistently delivered double-digit revenue growth. She
                  brings that same standard to every client engagement.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="font-display font-semibold flex items-center gap-2">
                    <Eye className="h-5 w-5 text-accent" />
                    Vision
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    To be East Africa&apos;s most trusted growth partner — the
                    firm businesses call when they are ready to turn ambition
                    into measurable results.
                  </p>
                </div>
                <div>
                  <h3 className="font-display font-semibold flex items-center gap-2">
                    <Target className="h-5 w-5 text-accent" />
                    Mission
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    To help businesses uncover hidden growth opportunities and
                    transform them into sustainable revenue through practical,
                    hands-on consulting.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-display font-semibold flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-accent" />
                  Leadership Philosophy
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Great strategy is not about complexity — it is about
                  clarity. Rachel believes the best consultants do not impress
                  clients with jargon; they make the path forward so clear that
                  execution feels inevitable.
                </p>
              </div>

              <div>
                <h3 className="font-display font-semibold flex items-center gap-2">
                  <Award className="h-5 w-5 text-accent" />
                  Business Philosophy
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Measure everything. If a recommendation cannot be tied to a
                  measurable outcome, it is not worth making. Rachel insists on
                  tracking progress against clear KPIs from day one of every
                  engagement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center reveal">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
              Our Values
            </Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              What we stand for
            </h2>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value, i) => (
              <div
                key={value.title}
                className="reveal flex gap-4 rounded-xl border border-border/60 p-6 transition-all hover:border-primary/30 hover:shadow-md"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <value.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display font-semibold">{value.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance reveal">
            Let&apos;s grow your business together
          </h2>
          <p className="mt-4 text-lg text-white/80 reveal">
            Book a free strategy call and discover the opportunities hidden in
            your business.
          </p>
          <div className="mt-8 reveal">
            <Link href="/book">
              <Button size="lg" variant="secondary" className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
                Schedule Your Free Consultation
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
