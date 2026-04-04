import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function DestinationCard({ city, code, img, href }) {
  return (
    <Link
      to={href}
      className="group relative block h-[320px] overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-2xl"
      title={`${city} (${code})`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url(${img})` }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-all duration-500 group-hover:from-black/85 group-hover:via-black/40 group-hover:to-black/20" />

      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_28%)]" />

      <div className="relative z-10 flex h-full flex-col items-start justify-between px-7 py-6 lg:p-5 text-white">
        <div>
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.35em] text-amber-400">
            Featured Route
          </p>

          <h3 className="text-3xl font-serif italic leading-tight">
            {city}
          </h3>

          <p className="mt-2 text-sm text-white/80">
            {city} ({code})
          </p>
        </div>

        <div className="w-full">
          <div className="mb-4 h-px w-full bg-white/15" />

          <div className="flex items-center justify-between">
            <span className="text-sm text-white/75">
              Premium booking experience
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-all duration-300 translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
              Book Now
              <ArrowRight size={16} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default DestinationCard;
