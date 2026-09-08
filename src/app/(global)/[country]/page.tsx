import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductPrice, PRODUCT_CATALOG } from '@/lib/i18n/pricing';
import { formatPrice } from '@/lib/i18n/countries';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, FileText, Video, Map as MapIcon, Target } from 'lucide-react';

const COUNTRY_MAP: Record<string, { code: string; name: string }> = {
  'us': { code: 'US', name: 'United States' },
  'uk': { code: 'GB', name: 'United Kingdom' },
  'canada': { code: 'CA', name: 'Canada' },
  'australia': { code: 'AU', name: 'Australia' },
  'uae': { code: 'AE', name: 'United Arab Emirates' },
  'singapore': { code: 'SG', name: 'Singapore' },
  'germany': { code: 'DE', name: 'Germany' },
  'france': { code: 'FR', name: 'France' },
  'italy': { code: 'IT', name: 'Italy' },
  'saudi-arabia': { code: 'SA', name: 'Saudi Arabia' },
};

export async function generateStaticParams() {
  return Object.keys(COUNTRY_MAP).map((country) => ({
    country,
  }));
}

export async function generateMetadata({ params }: { params: { country: string } }): Promise<Metadata> {
  const countryData = COUNTRY_MAP[params.country];
  if (!countryData) {
    return {};
  }

  return {
    title: `GraduateNex ${countryData.name} — AI Career & Resume Platform for Students`,
    description: `Join thousands of students in ${countryData.name} using GraduateNex to build ATS-friendly resumes, prepare for interviews, and launch their careers.`,
    alternates: {
      canonical: `https://graduatenex.com/${params.country}`,
    }
  };
}

export default async function CountryLandingPage({ params }: { params: { country: string } }) {
  const countryData = COUNTRY_MAP[params.country];
  
  if (!countryData) {
    notFound();
  }

  // Fetch sample pricing for the country
  const sampleProduct = 'all_access_pass';
  const priceInfo = await getProductPrice(sampleProduct, countryData.code);
  const formattedPrice = formatPrice(priceInfo.price, priceInfo.currencyCode);

  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "GraduateNex",
    "url": `https://graduatenex.com/${params.country}`,
    "description": "AI Career & Resume Platform for Students",
    "areaServed": {
      "@type": "Country",
      "name": countryData.name
    }
  };

  const features = [
    {
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      title: "AI Resume Builder",
      description: "Create ATS-friendly resumes tailored to local job markets in seconds."
    },
    {
      icon: <Video className="w-6 h-6 text-purple-600" />,
      title: "Mock Interviews",
      description: "Practice with AI interviewers and get real-time feedback to ace your real interviews."
    },
    {
      icon: <MapIcon className="w-6 h-6 text-green-600" />,
      title: "Career Roadmaps",
      description: "Personalized learning paths to acquire skills demanded by top employers."
    },
    {
      icon: <Target className="w-6 h-6 text-orange-600" />,
      title: "ATS Optimization",
      description: "Scan your resume against job descriptions to maximize your interview chances."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-blue-50/50 -z-10" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Now available in {countryData.name}
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
            AI Career Tools for Students in <span className="text-blue-600">{countryData.name}</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Land your dream job with AI-powered resume building, interview prep, and personalized career roadmaps tailored for the {countryData.name} market.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/resume">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 h-14 rounded-full">
                Build Your Resume <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full border-2">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need to get hired</h2>
            <p className="mt-4 text-lg text-gray-600">Powerful AI tools designed specifically for students and new graduates.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Simple, localized pricing</h2>
          <p className="text-lg text-gray-600 mb-10">
            Get access to all premium features with our {PRODUCT_CATALOG[sampleProduct].name}.
          </p>
          
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-xl font-medium text-sm">
              Most Popular
            </div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{PRODUCT_CATALOG[sampleProduct].name}</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-extrabold text-gray-900">{formattedPrice}</span>
                <span className="text-gray-500 font-medium">/month</span>
              </div>
            </div>
            
            <ul className="space-y-4 mb-8 text-left max-w-sm mx-auto">
              {['Unlimited AI Resume Generations', 'Unlimited ATS Scans', 'Full Access to Mock Interviews', 'Priority Support'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            
            <Link href="/pricing">
              <Button size="lg" className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white px-8 h-12 rounded-full">
                See all plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to launch your career in {countryData.name}?</h2>
          <p className="text-xl text-blue-100 mb-10">Join thousands of students who have already found their dream jobs.</p>
          <Link href="/signup">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 h-14 rounded-full font-bold">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
