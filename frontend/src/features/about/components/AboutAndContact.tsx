import { useState } from "react";
import {
  Search,
  Wrench,
  Calendar,
  CheckCircle,
  Zap,
  ShieldCheck,
  Clock,
  CreditCard,
  HardHat,
  MapPin,
  Phone,
  Mail,
  User,
  Building2,
  Facebook,
  Instagram,
  Linkedin,
  Send,
  ChevronRight,
  Star,
  ArrowRight,
} from "lucide-react";
import { errorToast, successToast } from "@/utils/notificationAudio";
import { sendContactEmail } from "../services/contactService";

export default function AboutContact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      message: "",
    };

    let isValid = true;

    // Name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
      isValid = false;
    }

    // Phone (optional)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone must be 10–15 digits";
      isValid = false;
    }

    // Message
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      isValid = false;
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitted(true);

      await sendContactEmail(formData);

      successToast("Message sent successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });

      setErrors({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      if (error instanceof Error) errorToast(error.message);
    } finally {
      setSubmitted(false);
    }
  };

  const steps = [
    {
      icon: Search,
      step: "01",
      label: "Search Nearby Garages",
      desc: "Find verified garages in your area instantly",
    },
    {
      icon: Wrench,
      step: "02",
      label: "Select Services",
      desc: "Choose from a full range of vehicle services",
    },
    {
      icon: Calendar,
      step: "03",
      label: "Choose Date & Time",
      desc: "Pick a slot that fits your schedule",
    },
    {
      icon: CheckCircle,
      step: "04",
      label: "Confirm Booking",
      desc: "Instant confirmation with reminders sent",
    },
  ];

  const features = [
    {
      icon: Zap,
      label: "Easy Online Booking",
      desc: "Book any service in under 2 minutes, anytime",
    },
    {
      icon: ShieldCheck,
      label: "Verified Garages",
      desc: "Every garage is audited and quality-certified",
    },
    {
      icon: Clock,
      label: "Real-time Availability",
      desc: "Live slot updates — zero double bookings",
    },
    {
      icon: CreditCard,
      label: "Secure Payments",
      desc: "Bank-grade encryption on every transaction",
    },
    {
      icon: HardHat,
      label: "Professional Mechanics",
      desc: "Certified technicians at every listed garage",
    },
  ];

  const details = [
    {
      icon: Building2,
      label: "Company Name",
      value: "GARAGE24 Technologies Ltd.",
    },
    { icon: User, label: "Founder / CEO", value: "James Hartwell" },
    { icon: Mail, label: "Email Address", value: "support@garage24.io" },
    { icon: Phone, label: "Phone Number", value: "+1 (800) 555-0192" },
    {
      icon: MapPin,
      label: "Business Address",
      value: "42 Engine Way, Detroit, MI 48201",
    },
    {
      icon: Clock,
      label: "Support Hours",
      value: "Mon–Sat, 8:00 AM – 8:00 PM EST",
    },
  ];

  return (
    <div className="bg-neutral-950 text-white min-h-screen">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-neutral-950 pt-16 pb-20 px-4 sm:px-8 lg:px-16">
        {/* bg glow blobs */}
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[350px] h-[250px] bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,#fff,#fff 1px,transparent 1px,transparent 60px),repeating-linear-gradient(90deg,#fff,#fff 1px,transparent 1px,transparent 60px)",
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/30 text-red-400 text-xs font-bold tracking-[0.2em] uppercase px-4 py-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Automotive Service Platform
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight mb-6">
            ABOUT OUR
            <br />
            <span className="text-red-600">GARAGE24</span>
            <br />
            PLATFORM
          </h1>

          <p className="text-neutral-400 text-base sm:text-lg max-w-xl leading-relaxed mb-10">
            Find trusted garages nearby, book vehicle services online, and track
            every appointment — all in one place. No phone calls. No guesswork.
            Just seamless automotive care.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 text-sm tracking-wide transition-colors"
            >
              How It Works <ArrowRight size={16} />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 border border-neutral-700 hover:border-red-600 text-neutral-300 hover:text-white font-bold px-6 py-3 text-sm tracking-wide transition-colors"
            >
              Get In Touch
            </a>
          </div>

          <div className="flex flex-wrap gap-10 mt-14 pt-8 border-t border-neutral-800">
            {[
              ["500+", "Garages"],
              ["12,000+", "Bookings Done"],
              ["4.9 / 5", "Customer Rating"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="text-3xl font-black text-red-500">{n}</p>
                <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">
                  {l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────── */}
      <section
        id="about"
        className="py-20 px-4 sm:px-8 lg:px-16 border-t border-neutral-800"
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-red-500 text-xs font-bold tracking-[0.2em] uppercase mb-3">
              Our Mission
            </p>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-6">
              BUILT FOR DRIVERS.
              <br />
              <span className="text-red-600">TRUSTED BY GARAGES.</span>
            </h2>
            <p className="text-neutral-400 leading-relaxed mb-8 text-sm sm:text-base">
              GARAGE24 was built to eliminate the frustration of vehicle
              servicing. We connect car owners with verified, professional
              garages — making transparent pricing, flexible scheduling, and
              hassle-free bookings the new standard in automotive care.
            </p>
            <ul className="space-y-3">
              {[
                "Connect users with trusted, certified garages",
                "Simplify vehicle service booking end-to-end",
                "Provide transparent pricing — zero hidden fees",
                "Easy scheduling that fits around your life",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-neutral-300"
                >
                  <span className="mt-1 w-4 h-4 flex-shrink-0 bg-red-600/20 border border-red-600/40 flex items-center justify-center">
                    <ChevronRight size={10} className="text-red-500" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              {
                icon: Star,
                title: "Trusted Platform",
                desc: "Over 12,000 successful bookings and growing",
              },
              {
                icon: ShieldCheck,
                title: "Verified Network",
                desc: "Every garage thoroughly audited & certified",
              },
              {
                icon: Clock,
                title: "24/7 Support",
                desc: "Real support, whenever you need it",
              },
              {
                icon: MapPin,
                title: "Nationwide",
                desc: "Active across all major cities and towns",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group bg-neutral-900 border border-neutral-800 hover:border-red-600/50 p-5 transition-all duration-300 hover:-translate-y-1 cursor-default"
              >
                <div className="w-10 h-10 bg-red-600/10 border border-red-600/20 flex items-center justify-center mb-4 group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-300">
                  <Icon
                    size={17}
                    className="text-red-400 group-hover:text-white transition-colors"
                  />
                </div>
                <p className="font-bold text-white text-sm mb-1">{title}</p>
                <p className="text-neutral-500 text-xs leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-8 lg:px-16 bg-neutral-900 border-t border-neutral-800"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-red-500 text-xs font-bold tracking-[0.2em] uppercase mb-3">
              Process
            </p>
            <h2 className="text-4xl sm:text-5xl font-black">HOW IT WORKS</h2>
          </div>

          {/* gap-px on bg-neutral-800 creates a 1px divider grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-800">
            {steps.map(({ icon: Icon, step, label, desc }) => (
              <div
                key={label}
                className="group relative bg-neutral-900 p-8 hover:bg-neutral-800 transition-colors overflow-hidden"
              >
                <span className="absolute bottom-3 right-4 text-[72px] font-black text-neutral-800 group-hover:text-neutral-700 transition-colors select-none leading-none">
                  {step}
                </span>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-red-600/10 border border-red-600/30 flex items-center justify-center mb-5 group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-300">
                    <Icon
                      size={22}
                      className="text-red-400 group-hover:text-white transition-colors"
                    />
                  </div>
                  <p className="font-black text-white text-sm mb-2 leading-snug">
                    {label}
                  </p>
                  <p className="text-neutral-500 text-xs leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-8 lg:px-16 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <p className="text-red-500 text-xs font-bold tracking-[0.2em] uppercase mb-3">
                Advantages
              </p>
              <h2 className="text-4xl sm:text-5xl font-black">WHY CHOOSE US</h2>
            </div>
            <p className="text-neutral-500 text-sm max-w-xs leading-relaxed">
              We've re-thought every part of the vehicle service experience from
              the ground up.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="group flex gap-5 bg-neutral-900 border border-neutral-800 hover:border-red-600/40 p-6 transition-all duration-300 hover:-translate-y-1 cursor-default"
              >
                <div className="w-12 h-12 flex-shrink-0 bg-red-600/10 border border-red-600/20 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-300">
                  <Icon
                    size={20}
                    className="text-red-400 group-hover:text-white transition-colors"
                  />
                </div>
                <div>
                  <p className="font-bold text-white text-sm mb-1.5">{label}</p>
                  <p className="text-neutral-500 text-xs leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM DETAILS ─────────────────────────────── */}
      <section className="py-20 px-4 sm:px-8 lg:px-16 bg-neutral-900 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-500 text-xs font-bold tracking-[0.2em] uppercase mb-3">
            Company Info
          </p>
          <h2 className="text-4xl sm:text-5xl font-black mb-12">
            PLATFORM DETAILS
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {details.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-center gap-4 bg-neutral-950 border border-neutral-800 hover:border-red-600/30 p-5 transition-colors group cursor-default"
              >
                <div className="w-11 h-11 flex-shrink-0 bg-red-600/10 border border-red-600/20 flex items-center justify-center group-hover:bg-red-600/20 transition-colors">
                  <Icon size={18} className="text-red-500" />
                </div>
                <div>
                  <p className="text-neutral-600 text-xs uppercase tracking-widest">
                    {label}
                  </p>
                  <p className="text-white font-bold text-sm mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────── */}
      <section
        id="contact"
        className="py-20 px-4 sm:px-8 lg:px-16 border-t border-neutral-800"
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14">
          {/* Left — info + map + socials */}
          <div>
            <p className="text-red-500 text-xs font-bold tracking-[0.2em] uppercase mb-3">
              Get In Touch
            </p>
            <h2 className="text-4xl sm:text-5xl font-black mb-4">CONTACT US</h2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-8 max-w-sm">
              Questions, partnerships, or general enquiries — fill in the form
              and we'll respond within 24 hours.
            </p>

            <div className="space-y-3 mb-10">
              {[
                { icon: Mail, val: "support@garage24.io" },
                { icon: Phone, val: "+1 (800) 555-0192" },
                { icon: MapPin, val: "42 Engine Way, Detroit, MI 48201" },
              ].map(({ icon: Icon, val }) => (
                <div
                  key={val}
                  className="flex items-center gap-3 text-sm text-neutral-300"
                >
                  <div className="w-9 h-9 flex-shrink-0 bg-red-600/10 border border-red-600/20 flex items-center justify-center">
                    <Icon size={14} className="text-red-500" />
                  </div>
                  {val}
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="relative bg-neutral-900 border border-neutral-800 h-52 flex items-center justify-center mb-8 overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg,#fff,#fff 1px,transparent 1px,transparent 24px),repeating-linear-gradient(90deg,#fff,#fff 1px,transparent 1px,transparent 24px)",
                }}
              />
              <div className="relative text-center">
                <div className="w-12 h-12 bg-red-600 flex items-center justify-center mx-auto mb-3">
                  <MapPin size={22} className="text-white" />
                </div>
                <p className="text-neutral-300 text-sm font-bold">
                  42 Engine Way, Detroit, MI
                </p>
                <p className="text-neutral-600 text-xs mt-1">
                  Google Maps integration point
                </p>
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="text-neutral-600 text-xs uppercase tracking-widest mb-3">
                Follow Us
              </p>
              <div className="flex gap-3">
                {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 bg-neutral-900 border border-neutral-700 hover:bg-red-600 hover:border-red-600 flex items-center justify-center text-neutral-400 hover:text-white transition-all"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — contact form */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 sm:p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center py-16 h-full">
                <div className="w-16 h-16 bg-red-600/10 border border-red-600/30 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={30} className="text-red-500" />
                </div>
                <p className="text-2xl font-black text-white mb-2">
                  MESSAGE SENT!
                </p>
                <p className="text-neutral-500 text-sm">
                  We'll be in touch within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter your name."
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-600 focus:outline-none text-white text-sm placeholder-neutral-600 px-4 py-3 transition-colors"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter your email."
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-600 focus:outline-none text-white text-sm placeholder-neutral-600 px-4 py-3 transition-colors"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Enter a contact number."
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-600 focus:outline-none text-white text-sm placeholder-neutral-600 px-4 py-3 transition-colors"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 uppercase tracking-widest mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell us how we can help..."
                    className="w-full bg-neutral-950 border border-neutral-700 focus:border-red-600 focus:outline-none text-white text-sm placeholder-neutral-600 px-4 py-3 transition-colors resize-none"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white font-black text-sm tracking-widest uppercase px-6 py-4 transition-all"
                >
                  <Send size={15} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
