import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Briefcase,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Store,
  HeartPulse,
  Factory,
  Sprout,
  HandHeart,
  Building2,
  Building,
  Utensils,
  GraduationCap,
  Cpu,
  Truck,
  Briefcase as BriefcaseIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AnimatedStats from '@/components/animated-stats';
import { services, fallbackResources, fallbackBlogPosts } from '@/lib/data';

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

const industries = [
  { icon: Store, name: 'Retail' },
  { icon: HeartPulse, name: 'Healthcare' },
  { icon: Factory, name: 'Manufacturing' },
  { icon: Sprout, name: 'Agriculture' },
  { icon: HandHeart, name: 'NGOs' },
  { icon: Building2, name: 'Financial Services' },
  { icon: Building, name: 'Real Estate' },
  { icon: Utensils, name: 'Hospitality' },
  { icon: GraduationCap, name: 'Education' },
  { icon: Cpu, name: 'Technology' },
  { icon: Truck, name: 'Logistics' },
  { icon: BriefcaseIcon, name: 'Professional Services' },
];

export default function HomePage() {
  return (
    <main className="pt-16">
        <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-transparent">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <Badge variant="secondary" className="mb-4 inline-flex bg-accent/10 text-accent">
                  Salesway Consulting
                </Badge>
                <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Grow Smarter. Sell More. <span className="text-accent">Scale With Confidence.</span>
                </h1>
                <p className="mt-6 text-lg leading-8 text-muted-foreground">
                  Turn strategy into sales with hands-on implementation. We stay alongside your team until measurable results are achieved.
                </p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Link href="/book">
                    <Button className="gap-2 w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                      Book a Free Strategy Call
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/#services">
                    <Button variant="outline" className="gap-2 w-full sm:w-auto">
                      Explore Our Services
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="relative overflow-hidden rounded-2xl border border-border/60 shadow-2xl">
                  <Image
                    src="/images/a_generate_for_me_thre (1).jpeg"
                    alt="Team meeting"
                    width={800}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-4 right-4 rounded-xl border border-white/70 bg-white/90 p-4 shadow-lg backdrop-blur-xl">
                    <p className="text-sm font-semibold text-primary">Hands-on implementation</p>
                  </div>
                  <div className="absolute bottom-4 left-4 rounded-xl border border-accent/70 bg-accent/90 p-4 shadow-lg backdrop-blur-xl">
                    <p className="text-2xl font-bold text-accent-foreground">+40%</p>
                    <p className="text-xs text-accent-foreground/90">Avg. sales growth</p>
                  </div>
                </div>
              </div>
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

              <Link href="/about" className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                Meet the founder, Rachel Waithera
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-border/50 bg-slate-50 shadow-2xl">
              <Image
                src="/images/b_generate_for_me_thre.png"
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

        <section>
          <AnimatedStats />
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
                Industries We Serve
              </Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Sector expertise that speaks your language
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                We have delivered results across twelve industries and counting.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {industries.map((industry) => (
                <Card key={industry.name} className="border-border/60 bg-card p-6 text-center transition-all hover:border-primary/30 hover:shadow-md">
                  <CardContent className="space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent mx-auto">
                      <industry.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold text-foreground">{industry.name}</h3>
                  </CardContent>
                </Card>
              ))}
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

        <section id="blog" className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
                Latest from the Blog
              </Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Insights to grow your business
              </h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground">
                Practical tips, frameworks, and strategies from our team.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {fallbackBlogPosts.slice(0, 3).map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <Card className="border-border/60 bg-card p-6 h-full transition-all hover:border-primary/30 hover:shadow-md">
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-accent/10 text-accent text-xs">
                          {post.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{post.reading_minutes} min read</span>
                      </div>
                      <h3 className="font-semibold text-foreground line-clamp-2">{post.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">{post.excerpt}</p>
                      <div className="pt-2">
                        <span className="text-sm font-semibold text-primary hover:text-primary/80">
                          Read more
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/blog" className="text-sm font-semibold text-primary hover:text-primary/80">
                View all posts
              </Link>
            </div>
          </div>
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
