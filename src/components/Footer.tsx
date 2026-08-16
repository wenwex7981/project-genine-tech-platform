import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-zinc-950 text-zinc-300 py-16 mt-auto border-t border-zinc-800">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-white p-1">
                <Image src="/logo.png" alt="Logo" fill className="object-cover rounded-lg" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">GraduateNex</span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">
              Empowering students with production-ready projects, zero-plagiarism documentation, and AI-driven career tools to secure their dream jobs.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <p className="text-sm flex items-center gap-2"><Phone className="h-4 w-4" /> +91 79819 94870</p>
              <p className="text-sm flex items-center gap-2"><Mail className="h-4 w-4" /> support@graduatenex.online</p>
              <p className="text-sm flex items-center gap-2"><MapPin className="h-4 w-4" /> Hyderabad, Telangana, India</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6 lg:ml-12">
            <h3 className="text-lg font-bold text-white">Company</h3>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-sm hover:text-primary transition-colors">Who Are We</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/services" className="text-sm hover:text-primary transition-colors">Services & Pricing</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Legal</h3>
            <ul className="space-y-4">
              <li><Link href="/terms" className="text-sm hover:text-primary transition-colors">Terms and Conditions</Link></li>
              <li><Link href="/privacy" className="text-sm hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/refunds" className="text-sm hover:text-primary transition-colors">Refund & Cancellation Policy</Link></li>
              <li><Link href="/delivery" className="text-sm hover:text-primary transition-colors">Delivery Policy</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Stay Updated</h3>
            <p className="text-sm text-zinc-400">Subscribe to our newsletter for the latest tech stacks and hackathon alerts.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Enter your email" className="bg-zinc-900 border border-zinc-800 text-sm px-4 py-2 rounded-lg w-full outline-none focus:border-primary transition-colors" />
              <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* SEO Locations & Universities */}
        <div className="mt-16 pt-8 border-t border-zinc-800">
          <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-4">Proudly Serving Students Across States</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-zinc-600">
            <span>Andhra Pradesh</span>
            <span>Telangana</span>
            <span>Maharashtra</span>
            <span>Karnataka</span>
            <span>Tamil Nadu</span>
            <span>Delhi NCR</span>
            <span>Uttar Pradesh</span>
            <span>Gujarat</span>
            <span>West Bengal</span>
            <span>Rajasthan</span>
            <span>Madhya Pradesh</span>
            <span>Kerala</span>
            <span>Punjab</span>
            <span>Haryana</span>
            <span>Bihar</span>
            <span>Odisha</span>
            <span>Assam</span>
            <span>Jharkhand</span>
            <span>Chhattisgarh</span>
            <span>Uttarakhand</span>
          </div>
          
          <h3 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mt-6 mb-4">Top Universities & Institutions We Support</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-zinc-600">
            <span>Indian Institutes of Technology (IITs)</span>
            <span>National Institutes of Technology (NITs)</span>
            <span>IIITs</span>
            <span>BITS Pilani</span>
            <span>JNTU Hyderabad (JNTUH)</span>
            <span>JNTU Kakinada (JNTUK)</span>
            <span>JNTU Anantapur (JNTUA)</span>
            <span>Anna University</span>
            <span>Visvesvaraya Technological University (VTU)</span>
            <span>Delhi University (DU)</span>
            <span>Mumbai University</span>
            <span>Pune University (SPPU)</span>
            <span>Osmania University (OU)</span>
            <span>SRM Institute of Science and Technology</span>
            <span>VIT Vellore</span>
            <span>Manipal Academy of Higher Education</span>
            <span>Amity University</span>
            <span>Lovely Professional University (LPU)</span>
            <span>Chandigarh University</span>
            <span>AKTU (UPTU)</span>
            <span>Gujarat Technological University (GTU)</span>
            <span>RGPV Bhopal</span>
            <span>APJ Abdul Kalam Technological University (KTU Kerala)</span>
            <span>MAKAUT West Bengal</span>
            <span>Biju Patnaik University of Technology (BPUT)</span>
            <span>Andhra University (AU)</span>
            <span>Sri Venkateswara University (SVU)</span>
            <span>KLU</span>
            <span>Gitam University</span>
            <span>Thapar Institute</span>
            <span>KIIT Bhubaneswar</span>
            <span>PES University</span>
            <span>Christ University</span>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} GraduateNex. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* Social Icons Mock */}
            <div className="h-8 w-8 rounded-full bg-zinc-800 hover:bg-primary transition-colors cursor-pointer"></div>
            <div className="h-8 w-8 rounded-full bg-zinc-800 hover:bg-primary transition-colors cursor-pointer"></div>
            <div className="h-8 w-8 rounded-full bg-zinc-800 hover:bg-primary transition-colors cursor-pointer"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
