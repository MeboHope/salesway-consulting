'use client';

import { ArrowRight, CheckCircle2, Target, Search, Lightbulb, Rocket, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Discovery & Assessment',
    description: 'We begin with a deep dive into your business, analyzing your current sales process, customer journey, market position, and growth opportunities.',
    details: [
      'Stakeholder interviews',
      'Process mapping',
      'Market analysis',
      'Gap identification'
    ]
  },
  {
    icon: Target,
    number: '02',
    title: 'Strategy Development',
    description: 'Based on our findings, we develop a tailored growth strategy with clear objectives, KPIs, and actionable recommendations.',
    details: [
      'Goal setting',
      'KPI definition',
      'Strategy roadmap',
      'Resource planning'
    ]
  },
  {
    icon: Lightbulb,
    number: '03',
    title: 'Implementation Planning',
    description: 'We work with your team to create detailed implementation plans, ensuring everyone understands their role and timeline.',
    details: [
      'Action plans',
      'Team training',
      'Tool selection',
      'Change management'
    ]
  },
  {
    icon: Rocket,
    number: '04',
    title: 'Execution & Support',
    description: 'We stay alongside your team throughout implementation, providing guidance, troubleshooting, and hands-on support.',
    details: [
      'Hands-on execution',
      'Regular check-ins',
      'Problem solving',
      'Progress tracking'
    ]
  },
  {
    icon: BarChart3,
    number: '05',
    title: 'Measurement & Optimization',
    description: 'We continuously measure results against KPIs, optimize strategies based on data, and ensure sustainable growth.',
    details: [
      'Performance tracking',
      'Data analysis',
      'Strategy refinement',
      'Long-term planning'
    ]
  }
];

export default function ProcessPage() {
  return (
    <main className="pt-16">
      {/* Header */}
      <section className="relative py-20 sm:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
            Our Process
          </Badge>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-balance">
            How we <span className="text-accent">deliver results</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-pretty">
            Our proven methodology ensures sustainable growth through strategic
            planning, hands-on implementation, and continuous optimization.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {index !== steps.length - 1 && (
                  <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-border/60 hidden lg:block" />
                )}
                <div className="lg:flex lg:items-start lg:gap-12">
                  <div className="flex-shrink-0 mb-6 lg:mb-0">
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-xl font-bold">
                        {step.number}
                      </div>
                      <div className="absolute -bottom-2 -right-2 rounded-full bg-accent p-2">
                        <step.icon className="h-5 w-5 text-accent-foreground" />
                      </div>
                    </div>
                  </div>
                  <Card className="flex-1 border-border/60">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-display text-2xl font-bold text-foreground">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                      <div className="space-y-2">
                        {step.details.map((detail) => (
                          <div key={detail} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-foreground">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why This Works */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-transparent">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Why our process works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Built on experience, refined by results
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Data-Driven',
                description: 'Every decision is backed by data and measurable outcomes, not guesswork.'
              },
              {
                title: 'Collaborative',
                description: 'We work with your team, not just for you, building internal capacity.'
              },
              {
                title: 'Results-Focused',
                description: 'We stay until results are achieved, ensuring sustainable long-term growth.'
              }
            ].map((item) => (
              <Card key={item.title} className="border-border/60">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-display text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to start your growth journey?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Let's discuss how our process can help your business achieve its goals.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button className="gap-2" asChild>
              <a href="/book">
                Book a Consultation
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="outline" className="gap-2" asChild>
              <a href="/contact">
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
