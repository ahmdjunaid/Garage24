import { useState, useEffect, useCallback } from "react";
import testimonialBanner from "@assets/banner/userTestimonialBanner.jpg";
import { fetchPaginatedTestimonials } from "../services/homepageServices";
import { errorToast } from "@/utils/notificationAudio";

// ─── Types aligned with your MongoDB schema ───────────────────────────────────

interface AppointmentService {
  serviceId: string;
  name: string;
  price: number;
  durationMinutes: number;
  status: string;
  _id: string;
}

interface PopulatedAppointment {
  _id: string;
  services: AppointmentService[];
}

interface PopulatedUser {
  _id: string;
  imageUrl?: string;
  name?: string;
}

interface PopulatedGarage {
  _id: string;
  name: string;
}

interface TestimonialDoc {
  _id: string;
  appointmentId: PopulatedAppointment;
  userId: PopulatedUser;
  garageId: PopulatedGarage;
  rating: number;
  review: string;
  createdAt: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i < rating ? "text-red-500" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ─── Testimonial Card ─────────────────────────────────────────────────────────

function TestimonialCard({ doc }: { doc: TestimonialDoc }) {
  const userName = doc.userId?.name ?? "Anonymous";
  const userImage = doc.userId?.imageUrl;
  const garageName = doc.garageId?.name ?? "GARAGE24";
  const services = doc.appointmentId?.services ?? [];

  return (
    <div className="bg-white text-black rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-lg h-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        {userImage ? (
          <img
            src={userImage}
            alt={userName}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-red-200 flex-shrink-0"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 ring-2 ring-red-200">
            <span className="text-red-600 font-bold text-base">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{userName}</p>
          <StarRating rating={doc.rating} />
          <p className="text-[10px] text-gray-400 mt-0.5 truncate">
            at {garageName}
          </p>
        </div>
      </div>

      {/* Review */}
      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed flex-1">
        "{doc.review}"
      </p>

      {/* Services */}
      {services.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {services.map((s) => (
            <span
              key={s._id}
              className="text-[10px] bg-red-50 text-red-600 border border-red-200 rounded-full px-2.5 py-0.5 font-medium"
              title={`₹${s.price} · ${s.durationMinutes} min`}
            >
              {s.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 flex flex-col gap-4 shadow-lg animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
      </div>
      <div className="space-y-2 flex-1">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-4/6" />
      </div>
      <div className="flex gap-2">
        <div className="h-5 w-16 bg-gray-200 rounded-full" />
        <div className="h-5 w-20 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}

export default function Garage24Testimonials() {
  const [docs, setDocs] = useState<TestimonialDoc[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 3;

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const data = await fetchPaginatedTestimonials(p, ITEMS_PER_PAGE);
      setDocs(data.docs);
      setTotalPages(data.totalPages);
      setPage(data.page ?? p);
    } catch (e) {
      if (e instanceof Error) errorToast(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(1);
  }, [load]);

  const prev = () => {
    if (page > 1) load(page - 1);
  };
  const next = () => {
    if (page < totalPages) load(page + 1);
  };

  return (
    <section className="w-full bg-[#141414] text-white py-14 sm:py-20">
      {/* ── Banner ─────────────────────────────────────────────────────────── */}
      <div
        className="relative w-full h-[260px] sm:h-[340px] lg:h-[440px]
          bg-cover bg-bottom flex items-center px-4 sm:px-10 lg:px-20"
        style={{ backgroundImage: `url(${testimonialBanner})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-xl text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3">
            Let's Get Your Vehicle in{" "}
            <span className="text-red-500">Top Shape!</span>
          </h2>
          <p className="text-gray-300 text-xs sm:text-sm">
            Ready to give your vehicle the care it deserves? Contact GARAGE24
            for a free consultation or to book a service appointment today.
          </p>
        </div>
      </div>

      {/* ── Testimonials ───────────────────────────────────────────────────── */}
      <div className="mt-16 sm:mt-20 lg:mt-24 px-4 sm:px-10 lg:px-20">
        {/* Header row */}
        <div
          className="flex flex-col lg:flex-row items-center lg:items-start
            justify-between gap-6 mb-10 text-center lg:text-left"
        >
          <div>
            <p className="text-xs sm:text-sm tracking-widest text-gray-400 uppercase mb-2">
              Testimonials
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              What Drivers Are Saying <br />
              About <span className="text-red-500">GARAGE24</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xs">
            Read what our satisfied customers have to say about our products and
            services.
          </p>
        </div>

        {/* Card area */}
        <div className="bg-red-600 p-4 sm:p-6 lg:p-10 rounded-3xl">
          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {loading
              ? Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : docs.map((doc) => <TestimonialCard key={doc._id} doc={doc} />)}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between lg:justify-end gap-4 mt-6 lg:mt-8">
              {/* Page indicator */}
              <span className="text-white/70 text-xs lg:mr-4">
                Page {page} of {totalPages}
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={prev}
                  disabled={page <= 1 || loading}
                  aria-label="Previous page"
                  className="w-9 h-9 flex items-center justify-center rounded-full
                        bg-white/15 hover:bg-white/30 disabled:opacity-40
                        disabled:cursor-not-allowed transition-colors text-white text-base
                        focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  ←
                </button>

                {/* Dot indicators */}
                <div className="flex gap-1.5">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => load(i + 1)}
                      aria-label={`Go to page ${i + 1}`}
                      className={`rounded-full transition-all focus:outline-none
                            ${
                              page === i + 1
                                ? "w-5 h-2 bg-white"
                                : "w-2 h-2 bg-white/40 hover:bg-white/70"
                            }`}
                    />
                  ))}
                </div>

                <button
                  onClick={next}
                  disabled={page >= totalPages || loading}
                  aria-label="Next page"
                  className="w-9 h-9 flex items-center justify-center rounded-full
                        bg-white/15 hover:bg-white/30 disabled:opacity-40
                        disabled:cursor-not-allowed transition-colors text-white text-base
                        focus:outline-none focus:ring-2 focus:ring-white/50"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
