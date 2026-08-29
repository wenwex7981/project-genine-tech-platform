"use client";

import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";

const COLLEGES = [
  "JNTUH, Hyderabad", "VIT, Vellore", "Anna University", "SRM, Chennai",
  "BITS Pilani", "Amity, Noida", "LPU, Punjab", "Manipal University",
  "NIT Warangal", "IIIT Hyderabad", "DTU, Delhi", "BPUT, Odisha",
  "KTU, Kerala", "GTU, Gujarat", "RGPV, Bhopal", "MAKAUT, Kolkata",
  "Osmania University", "Chandigarh University", "PES University",
  "Savitribai Phule Pune University",
];

const FIRST_NAMES = [
  "Aarav", "Priya", "Rahul", "Sneha", "Arjun", "Divya", "Karthik", "Ananya",
  "Sai", "Meera", "Vikram", "Roshni", "Aditya", "Pooja", "Harsh", "Kavya",
  "Rohit", "Tanvi", "Nikhil", "Shreya", "Varun", "Ishita", "Manish", "Neha",
];

const PRODUCTS = [
  { name: "Premium AI Helper", emoji: "🤖" },
  { name: "Resume Hub Pro", emoji: "📄" },
  { name: "AI Tools Pro", emoji: "🛡️" },
  { name: "All Access Pass", emoji: "👑" },
  { name: "Hackathon Pro Badge", emoji: "🏆" },
  { name: "Abstract Generator", emoji: "✨" },
  { name: "ATS Detailed Report", emoji: "📊" },
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomMinutes(): number {
  return Math.floor(Math.random() * 25) + 1;
}

export default function SocialProofToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [notification, setNotification] = useState({
    name: "",
    college: "",
    product: "",
    emoji: "",
    minutes: 0,
  });

  useEffect(() => {
    const isMobile = window.innerWidth < 768;

    const showNotification = () => {
      const person = getRandomItem(FIRST_NAMES);
      const college = getRandomItem(COLLEGES);
      const product = getRandomItem(PRODUCTS);
      const minutes = getRandomMinutes();

      setNotification({
        name: person,
        college: college,
        product: product.name,
        emoji: product.emoji,
        minutes: minutes,
      });

      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    const initialDelay = setTimeout(showNotification, isMobile ? 25000 : 15000);

    const interval = setInterval(
      showNotification,
      (Math.random() * 20 + 30) * 1000
    );

    return () => {
      clearTimeout(initialDelay);
      clearInterval(interval);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 md:bottom-6 left-4 z-[80] max-w-[320px]">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30 flex items-center justify-center text-lg flex-shrink-0">
          {notification.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Verified Purchase
            </span>
          </div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
            {notification.name} from {notification.college.split(",")[0]}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            purchased <strong className="text-zinc-700 dark:text-zinc-300">{notification.product}</strong>
          </p>
          <p className="text-[11px] text-muted-foreground/70 mt-1">
            {notification.minutes} min ago
          </p>
        </div>

        <button
          onClick={() => setIsVisible(false)}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors p-0.5 flex-shrink-0"
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
