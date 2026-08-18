// lib/data.ts

/* =========================================================
   SERVICES
========================================================= */

export type Service = {
  slug: string;
  title: string;
  summary: string;
  details?: string;
  icon: string;
  features: string[];
};

export const services: Service[] = [
  {
    slug: 'sales-strategy-growth',
    title: 'Sales Strategy & Growth',
    summary:
      'Turn your sales process into a predictable revenue engine with audits, pipeline optimization, and CRM implementation.',
    details:
      'We help you map out your sales stages, diagnose conversion leaks, and align your people, process, and technology so every pipeline action drives predictable revenue growth.',
    icon: 'TrendingUp',
    features: [
      'Sales audits',
      'Pipeline optimization',
      'CRM implementation',
      'Lead conversion',
      'Sales process improvement',
      'Revenue forecasting',
    ],
  },
  {
    slug: 'business-strategy-positioning',
    title: 'Business Strategy & Positioning',
    summary:
      'Sharpen your market position and build a strategy that makes every decision easier and every initiative land harder.',
    details:
      'We clarify what makes your business different, define the customers who matter most, and create a strategy that turns your unique strengths into repeatable growth.',
    icon: 'Target',
    features: [
      'Market positioning',
      'Competitive analysis',
      'Business model optimization',
      'Strategic planning',
      'Brand messaging',
      'Customer segmentation',
    ],
  },
  {
    slug: 'marketing-that-feeds-sales',
    title: 'Marketing That Feeds Sales',
    summary:
      'Build marketing funnels that do not just generate clicks but deliver qualified leads ready to buy.',
    details:
      'We balance visibility with quality, creating campaigns and content that attract the right prospects and move them through the sales journey efficiently.',
    icon: 'Megaphone',
    features: [
      'Digital marketing',
      'Lead generation',
      'Content marketing',
      'SEO',
      'Social media strategy',
      'Email marketing',
      'Marketing funnels',
      'Conversion optimization',
    ],
  },
  {
    slug: 'growth-coaching',
    title: 'Growth Coaching',
    summary:
      'One-on-one and team coaching for entrepreneurs and executives who want accountability and momentum.',
    details:
      'Our coaching program combines proven frameworks, regular accountability, and practical action planning so leaders stay focused on the priorities that deliver real business results.',
    icon: 'Users',
    features: [
      'Business mentoring',
      'Sales coaching',
      'Accountability sessions',
      'Leadership development',
    ],
  },
  {
    slug: 'business-process-improvement',
    title: 'Business Process Improvement',
    summary:
      'Streamline operations, elevate customer experience, and build the workflows that scale without breaking.',
    details:
      'We identify bottlenecks, simplify handoffs, and design processes that keep customers happy while reducing waste, rework, and operational risk.',
    icon: 'Settings',
    features: [
      'Operational efficiency',
      'Customer experience',
      'Workflow optimization',
      'KPI development',
    ],
  },
  {
    slug: 'corporate-training',
    title: 'Corporate Training',
    summary:
      'Practical, hands-on training programs that upskill your team and deliver measurable performance lifts.',
    details:
      'Our training is designed to be immediately applicable, with real sales and leadership practices that your team can use from day one.',
    icon: 'GraduationCap',
    features: [
      'Sales excellence',
      'Leadership',
      'Customer service',
      'Team productivity',
      'Communication skills',
    ],
  },
];

/* =========================================================
   INDUSTRIES
========================================================= */

export type Industry = {
  name: string;
  icon: string;
};

export const industries: Industry[] = [
  { name: 'Retail', icon: 'ShoppingBag' },
  { name: 'Healthcare', icon: 'HeartPulse' },
  { name: 'Manufacturing', icon: 'Factory' },
  { name: 'Agriculture', icon: 'Sprout' },
  { name: 'NGOs', icon: 'HandHeart' },
  { name: 'Financial Services', icon: 'Landmark' },
  { name: 'Real Estate', icon: 'Building2' },
  { name: 'Hospitality', icon: 'UtensilsCrossed' },
  { name: 'Education', icon: 'BookOpen' },
  { name: 'Technology', icon: 'Cpu' },
  { name: 'Logistics', icon: 'Truck' },
  { name: 'Professional Services', icon: 'Briefcase' },
];

/* =========================================================
   CONSULTING PROCESS
========================================================= */

export type ProcessStep = {
  step: number;
  title: string;
  description: string;
  icon: string;
};

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: 'Discovery Call',
    description:
      'A free, no-pressure conversation to understand your business, goals, and the challenges holding you back.',
    icon: 'Phone',
  },
  {
    step: 2,
    title: 'Business Assessment',
    description:
      'We dive deep into your sales, marketing, operations, and strategy to uncover untapped growth opportunities.',
    icon: 'Search',
  },
  {
    step: 3,
    title: 'Strategy Development',
    description:
      'We craft a tailored, practical roadmap with clear priorities, timelines, and measurable targets.',
    icon: 'Lightbulb',
  },
  {
    step: 4,
    title: 'Implementation',
    description:
      'We work alongside your team to execute the strategy — not just hand over a report and leave.',
    icon: 'Rocket',
  },
  {
    step: 5,
    title: 'Growth & Continuous Improvement',
    description:
      'We measure results, refine the approach, and keep optimizing for sustainable, long-term growth.',
    icon: 'LineChart',
  },
];

/* =========================================================
   WHY SALESWAY
========================================================= */

export type Reason = {
  title: string;
  description: string;
  icon: string;
};

export const reasons: Reason[] = [
  {
    title: 'Practical Solutions',
    description:
      'No fluff, no jargon. Just actionable strategies your team can implement immediately.',
    icon: 'Wrench',
  },
  {
    title: 'Data-Driven Strategies',
    description:
      'Every recommendation is backed by data, not guesswork or generic templates.',
    icon: 'BarChart3',
  },
  {
    title: 'Hands-On Implementation',
    description:
      'We stay alongside you through execution until measurable results are achieved.',
    icon: 'Handshake',
  },
  {
    title: 'Tailored Consulting',
    description:
      'Every engagement is customized to your business, industry, and stage of growth.',
    icon: 'Scissors',
  },
  {
    title: 'Transparent Communication',
    description:
      'Clear expectations, honest feedback, and no surprises — ever.',
    icon: 'MessageSquare',
  },
  {
    title: 'Sustainable Growth',
    description:
      'We build systems that keep delivering long after our engagement ends.',
    icon: 'TrendingUp',
  },
  {
    title: 'Measurable ROI',
    description:
      'If it does not move the needle, we do not recommend it. Results you can see.',
    icon: 'BadgePercent',
  },
];

/* =========================================================
   BUSINESS STATISTICS
========================================================= */

export type Stat = {
  value: number;
  suffix: string;
  label: string;
};

export const stats: Stat[] = [
  {
    value: 120,
    suffix: '+',
    label: 'Businesses Served',
  },
  {
    value: 40,
    suffix: '%',
    label: 'Avg. Sales Growth Achieved',
  },
  {
    value: 98,
    suffix: '%',
    label: 'Client Satisfaction',
  },
  {
    value: 12,
    suffix: '+',
    label: 'Years of Experience',
  },
];

/* =========================================================
   BLOG
========================================================= */

export const blogCategories = [
  'Sales',
  'Marketing',
  'Business Strategy',
  'Leadership',
  'Entrepreneurship',
  'Customer Experience',
  'Productivity',
  'Technology',
  'SMEs',
  'Market Trends',
];

export type BlogPostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  reading_minutes: number;
  published_at: string | null;
  is_featured: boolean;
};

export const fallbackBlogPosts: BlogPostSummary[] = [
  {
    id: 'fb-1',
    slug: '5-sales-mistakes-costing-you-revenue',
    title:
      '5 Sales Mistakes Costing You Revenue (And How to Fix Them)',
    excerpt:
      'Most businesses lose revenue not because their product is bad, but because of avoidable mistakes in their sales process. Here are the five most common ones and exactly how to fix each.',
    category: 'Sales',
    tags: ['sales', 'revenue', 'conversion'],
    reading_minutes: 6,
    published_at: '2026-08-04T11:56:39Z',
    is_featured: true,
  },
  {
    id: 'fb-2',
    slug: 'how-to-build-a-marketing-funnel-that-converts',
    title:
      'How to Build a Marketing Funnel That Actually Converts',
    excerpt:
      "Clicks don't pay the bills — conversions do. Learn how to build a marketing funnel that turns curious visitors into paying customers, step by step.",
    category: 'Marketing',
    tags: ['marketing', 'funnels', 'lead-generation'],
    reading_minutes: 5,
    published_at: '2026-08-01T11:56:39Z',
    is_featured: false,
  },
  {
    id: 'fb-3',
    slug: 'the-founders-guide-to-strategic-planning',
    title: "The Founder's Guide to Strategic Planning",
    excerpt:
      "A clear strategy makes every decision easier. This guide walks you through a practical framework for building a strategic plan you'll actually use.",
    category: 'Business Strategy',
    tags: ['strategy', 'planning', 'leadership'],
    reading_minutes: 5,
    published_at: '2026-07-28T11:56:39Z',
    is_featured: false,
  },
];

export type BlogPostDetail = BlogPostSummary & {
  content: string;
  author_name: string;
};

export const fallbackBlogPostDetails: Record<
  string,
  BlogPostDetail
> = {
  '5-sales-mistakes-costing-you-revenue': {
    ...fallbackBlogPosts[0],
    content: `## Mistake #1: No Defined Sales Process

Most businesses sell ad hoc. Every deal is handled differently, which means results are unpredictable and impossible to improve.

**Fix:** Document every step from first contact to closed deal. Define what happens at each stage and what moves a prospect from one stage to the next.

## Mistake #2: Talking Instead of Listening

Salespeople love to pitch. But buyers don't care about your features — they care about their problems.

**Fix:** Spend the first 10 minutes of every sales conversation asking questions. Understand the problem before you offer a solution.

## Mistake #3: No Follow-Up System

Research shows 80% of sales require 5+ follow-ups, yet most salespeople give up after 2.

**Fix:** Build a follow-up cadence into your CRM. Automate reminders. Never let a warm lead go cold.

## Mistake #4: Selling on Price

When you compete on price, you train customers to expect discounts. It's a race to the bottom.

**Fix:** Sell on value. Quantify the ROI of your solution. Show the cost of inaction.

## Mistake #5: No Sales Metrics

If you can't measure it, you can't improve it. Most businesses track revenue but not the activities that drive it.

**Fix:** Track leading indicators: calls made, meetings booked, proposals sent, conversion rates at each stage.`,
    author_name: 'Rachel Waithera',
  },

  'how-to-build-a-marketing-funnel-that-converts': {
    ...fallbackBlogPosts[1],
    content: `## What Is a Marketing Funnel?

A marketing funnel is the journey a person takes from first hearing about your business to becoming a paying customer. Most funnels leak — prospects drop off at every stage.

## Step 1: Awareness (Top of Funnel)

This is where people first discover you. The goal is reach, not conversion.

- Blog posts and SEO
- Social media content
- Paid advertising
- Podcast appearances

## Step 2: Interest

Now they know you exist. Give them a reason to engage further.

- Lead magnets
- Email newsletter signup
- Webinars and free workshops

## Step 3: Decision

They're considering buying. This is where you build trust and remove friction.

- Case studies and testimonials
- Free consultations
- Clear pricing and packages

## Step 4: Action

Make it easy to buy.

- Simple checkout process
- Multiple payment options
- Clear call-to-action

## The Key: Measure Every Stage

Track conversion rates at each step. Fix the biggest leak first, then the next. That's how you build a funnel that actually converts.`,
    author_name: 'Rachel Waithera',
  },

  'the-founders-guide-to-strategic-planning': {
    ...fallbackBlogPosts[2],
    content: `## Why Most Strategic Plans Fail

Most strategic plans are 50-page documents that sit on a shelf. They fail because they're too complex, too vague, and never translated into daily action.

## A Simpler Approach

A good strategic plan answers three questions:

1. Where are we now?
2. Where do we want to be?
3. How do we get there?

## Step 1: Assess Where You Are

Be honest. Look at your revenue, margins, customer satisfaction, team capacity, and competitive position. Use data, not feelings.

## Step 2: Define Your Destination

Pick 3-5 priorities for the year. Not 20 — three to five. Each should be specific, measurable, and tied to a deadline.

## Step 3: Build the Roadmap

Break each priority into quarterly milestones. Then break those into monthly actions. Assign owners and deadlines.

## Step 4: Review Monthly

Strategy is not a one-time exercise. Review progress monthly. Adjust. Celebrate wins. Learn from misses.

## The Bottom Line

A simple plan executed consistently beats a brilliant plan that never gets implemented.`,
    author_name: 'Rachel Waithera',
  },
};

/* =========================================================
   RESOURCES
========================================================= */

export type ResourceSummary = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  details?: string;
  category: string | null;
  requires_email: boolean;
  file_url?: string | null;
};

export const fallbackResources: ResourceSummary[] = [
  {
    id: 'fr-1',
    title: 'Business Growth Checklist',
    slug: 'business-growth-checklist',
    description:
      'A comprehensive checklist to assess your business across sales, marketing, operations, and strategy. Identify gaps and prioritize growth initiatives.',
    details:
      'Use this checklist to score the strength of your growth plan, identify priorities, and create a simple next-step roadmap that moves your business faster.',
    category: 'Strategy',
    requires_email: true,
  },
  {
    id: 'fr-2',
    title: 'Sales Audit Template',
    slug: 'sales-audit-template',
    description:
      'A step-by-step template to audit your current sales process, identify bottlenecks, and create an action plan to improve conversion rates.',
    details:
      'Evaluate your sales stages, qualification rules, pipeline handoffs, and follow-up cadence so you can fix the biggest conversion leaks first.',
    category: 'Sales',
    requires_email: true,
  },
  {
    id: 'fr-3',
    title: 'Marketing Planning Guide',
    slug: 'marketing-planning-guide',
    description:
      'Plan your marketing with confidence. This guide covers channels, budgeting, messaging, and measurement frameworks.',
    details:
      'Use this guide to define the channels that matter most, set a simple budget, and measure what actually moves your sales pipeline.',
    category: 'Marketing',
    requires_email: true,
  },
  {
    id: 'fr-4',
    title: 'Business Strategy Workbook',
    slug: 'business-strategy-workbook',
    description:
      'A practical workbook to help you define your vision, set priorities, and build a 12-month action plan you can actually execute.',
    details:
      'This workbook walks you through choosing the right focus areas, setting measurable goals, and creating accountability for the quarter ahead.',
    category: 'Strategy',
    requires_email: true,
  },
  {
    id: 'fr-5',
    title: 'Free eBook: The Growth Playbook',
    slug: 'growth-playbook-ebook',
    description:
      'Our flagship eBook covering the 7 proven frameworks for growing any business smarter, faster, and more profitably.',
    details:
      'Inside the playbook, you’ll find practical growth frameworks, examples, and priority-setting guidance for every stage of your business.',
    category: 'eBook',
    requires_email: true,
  },
];

/* =========================================================
   CAREERS / JOBS
========================================================= */

export type Job = {
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

export const fallbackJobs: Job[] = [
  {
    id: 'fallback-sales-consultant',
    title: 'Sales Consultant',
    department: 'Sales & Consulting',
    location: 'Nairobi, Kenya',
    type: 'Full-time',
    salary_range: 'Competitive',
    description:
      'Work with businesses to improve their sales processes, strengthen pipelines, increase conversions, and build predictable revenue systems.',
    requirements:
      'Strong communication and presentation skills.\nExperience in sales, business development, consulting, or a related field.\nAbility to work independently and collaboratively.\nStrong commercial awareness and problem-solving skills.',
    is_published: true,
    created_at: '2026-08-01T00:00:00Z',
  },
  {
    id: 'fallback-business-development',
    title: 'Business Development Executive',
    department: 'Business Development',
    location: 'Nairobi, Kenya',
    type: 'Full-time',
    salary_range: 'Competitive',
    description:
      'Identify new business opportunities, develop relationships with prospective clients, and support the growth of Salesway Consulting.',
    requirements:
      'Excellent interpersonal and communication skills.\nExperience in business development, sales, marketing, or client relationship management.\nAbility to identify opportunities and convert prospects into clients.\nStrong organizational skills.',
    is_published: true,
    created_at: '2026-08-02T00:00:00Z',
  },
  {
    id: 'fallback-marketing',
    title: 'Digital Marketing Specialist',
    department: 'Marketing',
    location: 'Nairobi, Kenya',
    type: 'Full-time',
    salary_range: 'Competitive',
    description:
      'Develop and execute digital marketing campaigns that generate awareness, qualified leads, and measurable business growth.',
    requirements:
      'Experience with digital marketing channels.\nStrong content creation and communication skills.\nUnderstanding of SEO, social media, email marketing, and analytics.\nCreative and analytical mindset.',
    is_published: true,
    created_at: '2026-08-03T00:00:00Z',
  },
];

/* =========================================================
   BUSINESS SIZES
========================================================= */

export const businessSizes = [
  'Solo / Freelancer',
  '2-10 employees',
  '11-50 employees',
  '51-200 employees',
  '200+ employees',
];

/* =========================================================
   SERVICE OPTIONS
========================================================= */

export const serviceOptions = [
  'Sales Strategy & Growth',
  'Business Strategy & Positioning',
  'Marketing That Feeds Sales',
  'Growth Coaching',
  'Business Process Improvement',
  'Corporate Training',
];