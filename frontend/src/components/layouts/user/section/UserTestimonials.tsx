import testimonialBanner from "@assets/banner/userTestimonialBanner.jpg";

interface Testimonial {
  name: string;
  image: string;
  review: string;
  rating: number;
}

export default function Garage24Testimonials() {
  const testimonials: Testimonial[] = [
    {
      name: "Albert Flores",
      image:
        "https://fastly.picsum.photos/id/22/4434/3729.jpg?hmac=fjZdkSMZJNFgsoDh8Qo5zdA_nSGUAWvKLyyqmEt2xs0",
      review:
        "For years, I've trusted my car to FixMoto, and they've never let me down. The staff is not only friendly but also incredibly knowledgeable, taking the time to walk me through every repair.",
      rating: 5,
    },
    {
      name: "Mary Thomas",
      image:
        "https://fastly.picsum.photos/id/22/4434/3729.jpg?hmac=fjZdkSMZJNFgsoDh8Qo5zdA_nSGUAWvKLyyqmEt2xs0",
      review:
        "When I faced a sudden issue with my vehicle, FixMoto managed to fit me in for an appointment the same day. Their team quickly diagnosed the problem and had my car back on the road in no time.",
      rating: 5,
    },
    {
      name: "Eleanor Pena",
      image:
        "https://fastly.picsum.photos/id/22/4434/3729.jpg?hmac=fjZdkSMZJNFgsoDh8Qo5zdA_nSGUAWvKLyyqmEt2xs0",
      review:
        "I encountered an unexpected breakdown and was fortunate to discover this garage. Their swift response and professional handling of the issue were impressive.",
      rating: 5,
    },
  ];

  return (
    <section className="w-full bg-[#141414] text-white py-14 sm:py-20">

      {/* ✅ CTA Banner */}
      <div
        className="relative w-full h-[260px] sm:h-[340px] lg:h-[440px]
        bg-cover bg-bottom flex items-center
        px-4 sm:px-10 lg:px-20"
        style={{ backgroundImage: `url(${testimonialBanner})` }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 max-w-xl text-center sm:text-left">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3">
            Let’s Get Your Vehicle in{" "}
            <span className="text-red-500">Top Shape!</span>
          </h2>

          <p className="text-gray-300 text-xs sm:text-sm">
            Ready to give your vehicle the care it deserves? Contact GARAGE24 for a
            free consultation or to book a service appointment today.
          </p>
        </div>
      </div>

      {/* ✅ Testimonials Section */}
      <div className="mt-16 sm:mt-20 lg:mt-24 px-4 sm:px-10 lg:px-20">

        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start
          justify-between gap-6 mb-10 text-center lg:text-left">

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

        {/* ✅ Cards Wrapper */}
        <div className="bg-red-600 p-4 sm:p-6 lg:p-10 rounded-3xl">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((item, index) => (
              <TestimonialCard key={index} {...item} />
            ))}
          </div>

          {/* ✅ Arrows */}
          <div className="flex justify-center lg:justify-end gap-6 mt-6 lg:mt-8">
            <button className="text-white text-xl">←</button>
            <button className="text-white text-xl">→</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({
  name,
  image,
  review,
  rating,
}: Testimonial) {
  return (
    <div className="bg-white text-black rounded-2xl p-5 sm:p-6
      flex flex-col justify-between shadow-lg">

      <div className="flex items-center gap-4 mb-4">
        <img
          src={image}
          alt={name}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
        />

        <div>
          <p className="font-semibold text-sm">{name}</p>

          <div className="flex text-red-500 text-xs">
            {Array.from({ length: rating }).map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
        {review}
      </p>
    </div>
  );
}