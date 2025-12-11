import brandLogo1 from "@assets/brandLogos/brandLogo1.png"
import brandLogo2 from "@assets/brandLogos/brandLogo2.png"
import brandLogo3 from "@assets/brandLogos/brandLogo3.png"
import brandLogo4 from "@assets/brandLogos/brandLogo4.png"
import brandLogo5 from "@assets/brandLogos/brandLogo5.png"
import brandLogo6 from "@assets/brandLogos/brandLogo6.png"
import processSectionBanner from "@assets/banner/processSectionBanner.png"

export default function UserProcess() {
  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-[#1b1b1b] to-[#111] text-white
      px-4 sm:px-8 lg:px-16 py-10 sm:py-12">

      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center 
        justify-between gap-6 mb-12 lg:mb-20">

        <p className="text-sm tracking-wide text-center lg:text-left">
          Quality Car Repair You Can Count On !
        </p>

        {/* Logos */}
        <div className="flex flex-wrap justify-center lg:justify-end gap-4 sm:gap-6 lg:gap-8">
          <img src={brandLogo1} alt="logo" className="h-10 sm:h-14 lg:h-20" />
          <img src={brandLogo2} alt="logo" className="h-10 sm:h-14 lg:h-20" />
          <img src={brandLogo3} alt="logo" className="h-10 sm:h-14 lg:h-20" />
          <img src={brandLogo4} alt="logo" className="h-10 sm:h-14 lg:h-20" />
          <img src={brandLogo5} alt="logo" className="h-10 sm:h-14 lg:h-20" />
          <img src={brandLogo6} alt="logo" className="h-10 sm:h-14 lg:h-20" />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

        {/* Left Content */}
        <div className="space-y-8 lg:space-y-10 text-center lg:text-left">
          <div>
            <p className="text-xs sm:text-sm uppercase tracking-widest text-gray-400 mb-2">
              Service Process
            </p>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight">
              What to Expect with <br />
              <span className="text-red-500">GARAGE24</span>
            </h1>
          </div>

          <div className="space-y-6 lg:space-y-8 max-w-xl mx-auto lg:mx-0">
            <ProcessItem
              title="Book Your Appointment"
              desc="Easily book your car repair appointment online. Choose your preferred time and get your vehicle back in top shape—fast and hassle-free."
            />

            <ProcessItem
              title="Vehicle Check-In"
              desc="Quick and easy vehicle check-in. Drop off your car, and we'll take care of the rest—ensuring a smooth and efficient repair process."
            />

            <ProcessItem
              title="Approval & Repairs"
              desc="Get fast approval for repairs. Once we assess your vehicle, we'll confirm the work needed and get started right away."
            />

            <ProcessItem
              title="Drive Away Confidently"
              desc="Drive away with confidence. After our expert repairs, your vehicle is ready to hit the road safely and smoothly."
            />
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full rounded-2xl overflow-hidden shadow-2xl
          h-[240px] sm:h-[320px] lg:h-auto">
          <img
            src={processSectionBanner}
            alt="Service Process"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}

interface ProcessItemProps {
  title: string;
  desc: string
}

function ProcessItem({ title, desc }: ProcessItemProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}