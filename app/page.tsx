import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Briefcase,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AnimatedStats from '@/components/animated-stats';
import { services, fallbackResources } from '@/lib/data';

const features = [
  {
    icon: Briefcase,
    title: 'Practical growth strategies',
    description: 'Sales plans designed to work for your business and your team, not just look good on a slide deck.',
  },
  {
    icon: TrendingUp,
    title: 'Revenue-focused execution',
    description: 'We help you turn strategic insight into real sales results, with measurable revenue improvements.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted partnership',
    description: 'We stay alongside your team until the plan is implemented and the gains are sustained.',
  },
  {
    icon: Sparkles,
    title: 'High-impact transformation',
    description: 'We identify the simple, high-value changes that unlock your next stage of growth.',
  },
];

export default function HomePage() {
  return (
    <main className="pt-16">
        <section className="hero-bg">
          <div className="relative mx-auto max-w-4xl px-4 py-32 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-6 inline-flex bg-primary/10 text-primary">
              Salesway Consulting
            </Badge>
            <h1 className="mx-auto max-w-4xl font-display hero-title text-primary-foreground">
              Ready to turn strategy into sales?
            </h1>
            <p className="mx-auto mt-6 max-w-2xl hero-sub">
              Let's uncover the opportunities holding your business back and build a practical roadmap that drives measurable growth.
              Whether you're launching a startup or scaling an established company, Salesway Consulting is your trusted partner in sustainable success.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/book">
                <Button className="cta-primary">
                  Schedule Your Free Consultation
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/#services">
                <Button variant="outline" className="cta-outline">
                  Explore Our Services
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
                Quick links
              </Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Browse the page sections directly.
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                Use the quick navigation cards to jump to About, Services, Resources, or Contact.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: 'About',
                  description: 'See how Salesway Consulting works and who we are.',
                  href: '/#about',
                },
                {
                  title: 'Services',
                  description: 'Discover the growth services we offer for your business.',
                  href: '/#services',
                },
                {
                  title: 'Resources',
                  description: 'Download practical tools and guides to grow smarter.',
                  href: '/#resources',
                },
                {
                  title: 'Contact',
                  description: 'Reach out for a free consultation and next-step plan.',
                  href: '/#contact',
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group block rounded-3xl border border-border/60 bg-card p-8 transition-shadow hover:shadow-xl"
                >
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Explore
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="relative py-20">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[rgba(255,255,255,0.7)] to-transparent" />
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr,0.9fr] lg:px-8">
            <div className="grid items-center gap-8">
              <Badge variant="secondary" className="mb-3 inline-flex bg-primary/10 text-primary">
                About Salesway Consulting
              </Badge>
              <div>
                <h2 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                  Your trusted partner for <span className="text-accent">sustainable growth</span>
                </h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                  Many businesses already possess untapped growth opportunities hidden within their sales process, customer journey, brand positioning, marketing strategy, and operations.
                  We help uncover these opportunities and transform them into sustainable revenue.
                </p>
                <p className="mt-4 max-w-xl text-lg leading-8 text-muted-foreground">
                  Unlike traditional consultants who deliver reports and leave, Salesway Consulting stays alongside clients throughout implementation until measurable improvements are achieved.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-3xl border border-border/60 bg-white/80 p-5 shadow-sm">
                  <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">Sales process</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-3xl border border-border/60 bg-white/80 p-5 shadow-sm">
                  <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">Customer journey</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-3xl border border-border/60 bg-white/80 p-5 shadow-sm">
                  <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">Brand positioning</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-3xl border border-border/60 bg-white/80 p-5 shadow-sm">
                  <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <ArrowRight className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground">Marketing strategy</p>
                  </div>
                </div>
              </div>

              <Link href="/#about" className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                Meet the founder, Rachel Waithera
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-slate-50 shadow-2xl">
              <Image
                src="/images/IMG-20260804-WA0001.jpg"
                alt="Sales consultation meeting"
                width={1080}
                height={720}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-6 left-6 rounded-[1.5rem] border border-white/70 bg-white/90 p-5 shadow-xl backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">We work with you, not just for you.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
                Services preview
              </Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Services built for growth
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                A sample of the services we offer, with a quick summary for each.
              </p>
            </div>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {services.slice(0, 3).map((service) => (
                <Card key={service.slug} className="border-border/60 bg-card p-6">
                  <CardContent className="space-y-4">
                    <div className="text-sm font-semibold text-primary">{service.title}</div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{service.summary}</p>
                    <div className="space-y-2">
                      {service.features.slice(0, 3).map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-foreground">
                          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <Link href={`/services/${service.slug}`} className="text-sm font-semibold text-primary hover:text-primary/80">
                        View details
                      </Link>
                      <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Preview</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section>
          <AnimatedStats />
        </section>

        <section id="resources" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
                Resources preview
              </Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Practical guides and tools
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                A few of our most useful free resources, ready to help you plan and execute growth.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {fallbackResources.slice(0, 3).map((resource) => (
                <Card key={resource.slug} className="border-border/60 bg-card p-6">
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      {resource.category && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                          {resource.category}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-primary">{resource.title}</div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{resource.description}</p>
                    <div className="pt-2">
                      <Link href={`/resources/${resource.slug}`} className="text-sm font-semibold text-primary hover:text-primary/80">
                        View details
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div className="lg:col-span-3 text-center">
                <Link href="/resources" className="text-sm font-semibold text-primary hover:text-primary/80">
                  View all resources
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[2rem] border border-border/60 bg-background/90 p-10 shadow-lg">
              <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
                <div>
                  <Badge variant="secondary" className="mb-4 bg-accent/10 text-accent">
                    Contact us
                  </Badge>
                  <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Let&apos;s talk about your next growth move.
                  </h2>
                  <p className="mt-6 text-base leading-7 text-muted-foreground">
                    Reach out for a free consultation and start building the practical plan your business needs.
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <Link href="/book">
                    <Button className="gap-2 w-full justify-center">
                      Book a call
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline" className="gap-2 w-full justify-center">
                      Contact the team
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
  );
}
