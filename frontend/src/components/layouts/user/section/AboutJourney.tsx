import checkingBanner from "@assets/banner/checkingBanner.jpg"
import inspectionBanner from "@assets/banner/inspectionBanner.jpg"

const AboutJourney = () => {
  return (
    <section className="relative w-full bg-[#262626] px-6 py-16">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          <p className="text-red-500 text-sm font-medium mb-3">
            The GARAGE24 Journey
          </p>

          <h2 className="text-white text-4xl lg:text-5xl font-bold leading-tight mb-6">
            From{" "}
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-red-600 -skew-x-6 rounded-sm"></span>
              <span className="relative px-2">Passion</span>
            </span>{" "}
            <br />
            to{" "}
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-red-600 -skew-x-6 rounded-sm"></span>
              <span className="relative px-2">Precision</span>
            </span>
          </h2>

          <p className="text-gray-400 text-sm leading-relaxed max-w-xl">
            At GARAGE24, our journey began with a shared passion for cars and a
            drive to make automotive care easier, more accessible, and more
            reliable. What started as a small group of enthusiasts who were
            tired of the typical repair shop experience has grown into a
            trusted brand committed to providing exceptional service and
            expert knowledge.
          </p>
        </div>

        {/* RIGHT IMAGES */}
        <div className="relative flex justify-end">
          {/* Main Image */}
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img
              src={inspectionBanner}
              alt="Mechanic"
              className="w-[360px] lg:w-[420px] h-auto object-cover"
            />
          </div>

          {/* Overlay Image */}
          <div className="absolute bottom-[-40px] left-[-40px] bg-[#1f1f1f] rounded-xl p-2 shadow-xl">
            <img
              src={checkingBanner}
              alt="Inspection"
              className="w-[220px] h-auto rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutJourney;
