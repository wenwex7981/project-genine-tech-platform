// ── Localization Strings ──
// All user-facing strings externalized for future multi-language support.
// Phase 1: English only — architecture ready for adding languages.

export type Locale = 'en';

// ── String keys organized by section ──
const strings: Record<Locale, Record<string, Record<string, string>>> = {
  en: {
    // ── Hero Section (Homepage) ──
    hero: {
      badge_india: "India's Premier Academic Success Platform",
      badge_global: "AI Career & Resume Platform for Students",
      title_india: "Engineer Your Academic Success",
      title_global: "Build Your Career With AI",
      subtitle_india: "From ready-to-deploy final year projects to AI-powered ATS resumes — GraduateNex is the complete ecosystem helping 2,500+ students graduate with distinction.",
      subtitle_global: "AI-powered resume builder, mock interviews, career roadmaps, and learning tools — everything you need to land your dream job.",
      cta_primary: "Get Started Free",
      cta_secondary: "Explore Projects",
    },

    // ── Stats ──
    stats: {
      projects_india: "2,500+ Projects Delivered",
      projects_global: "2,500+ Students Served",
      satisfaction: "98% Student Satisfaction",
      cities_india: "50+ Cities Across India",
      cities_global: "Students in 50+ Countries",
      plagiarism: "0% Plagiarism Score",
    },

    // ── Navigation ──
    nav: {
      projects: "Projects",
      resume: "Resume Hub",
      hackathons: "Hackathons",
      study: "Study Hub",
      jobs: "Jobs",
      ai_tools: "AI Tools",
      pricing: "Pricing",
      blog: "Blog",
      dashboard: "My Dashboard",
    },

    // ── Services / Features ──
    services: {
      resume_title: "AI Resume Builder",
      resume_desc_india: "Build ATS-optimized resumes tailored for Indian tech companies and MNCs.",
      resume_desc_global: "Build ATS-optimized resumes that pass applicant tracking systems at top companies worldwide.",
      projects_title_india: "Final Year Projects",
      projects_title_global: "Student Project Resources",
      projects_desc_india: "Ready-to-deploy source code, documentation & research papers for B.Tech/M.Tech students.",
      projects_desc_global: "Source code, documentation & research papers for computer science students.",
      interview_title: "AI Mock Interviews",
      interview_desc: "Practice with AI-powered voice interviews. Get real-time feedback and improve your confidence.",
      roadmap_title: "Career Roadmaps",
      roadmap_desc: "AI-generated personalized learning paths to reach your career goals.",
    },

    // ── Pricing Page ──
    pricing: {
      title: "Simple, Transparent Pricing",
      subtitle_india: "Everything you need to ace your academics and land your dream job. Pay securely with UPI, cards, or net banking.",
      subtitle_global: "Everything you need to land your dream job. Pay securely with international cards.",
      all_access: "All Access Pass",
      all_access_desc: "Unlock every premium feature — AI tools, resume hub, plagiarism remover, and more.",
      monthly: "Monthly",
      semester: "Semester",
      per_month: "/month",
      per_semester: "/6 months",
      lifetime: "Lifetime",
      free: "Free",
      current_plan: "Current Plan",
      get_started: "Get Started",
      most_popular: "Most Popular",
    },

    // ── Footer ──
    footer: {
      tagline: "AI-powered career tools for students",
      location_india: "Hyderabad, Telangana, India",
      location_global: "Global",
      copyright: "© {year} GraduateNex. All rights reserved.",
    },

    // ── Common ──
    common: {
      loading: "Loading...",
      error: "Something went wrong. Please try again.",
      search: "Search",
      filter: "Filter",
      view_all: "View All",
      learn_more: "Learn More",
      sign_in: "Sign In",
      sign_out: "Sign Out",
      add_to_cart: "Add to Cart",
      in_cart: "In Cart",
      purchased: "Purchased",
      download: "Download",
      free_trial: "Free Trial",
      buy_now: "Buy Now",
    },

    // ── Country Selector ──
    country_selector: {
      title: "Select Your Country",
      search_placeholder: "Search countries...",
      detected: "Detected",
      change: "Change",
      selected: "Selected",
    },

    // ── Social Proof ──
    social_proof: {
      action_purchased: "just purchased",
      action_enrolled: "just enrolled in",
      action_downloaded: "just downloaded",
      action_generated: "just generated",
    },
  },
};

/**
 * Get a localized string by section and key.
 * Falls back to English if the locale doesn't exist.
 * Falls back to the key itself if the string doesn't exist.
 */
export function t(section: string, key: string, locale: Locale = 'en'): string {
  const localeStrings = strings[locale] || strings.en;
  const sectionStrings = localeStrings[section];
  if (!sectionStrings) return key;
  return sectionStrings[key] || key;
}

/**
 * Get a localized string with variable interpolation.
 * Usage: tVar('footer', 'copyright', { year: '2026' })
 */
export function tVar(section: string, key: string, vars: Record<string, string>, locale: Locale = 'en'): string {
  let str = t(section, key, locale);
  for (const [varName, value] of Object.entries(vars)) {
    str = str.replace(`{${varName}}`, value);
  }
  return str;
}

/**
 * Get either the India or global variant of a string based on country
 */
export function tCountry(section: string, key: string, isIndia: boolean, locale: Locale = 'en'): string {
  const suffix = isIndia ? '_india' : '_global';
  return t(section, `${key}${suffix}`, locale) || t(section, key, locale);
}
