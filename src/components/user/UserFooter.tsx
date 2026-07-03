import { Link } from "react-router-dom";
import BookyLogo from "@/assets/Booky-logo.svg";

const SOCIAL_LINKS = [
  { label: "Facebook",  icon: "f",  href: "#" },
  { label: "Instagram", icon: "ig", href: "#" },
  { label: "LinkedIn",  icon: "in", href: "#" },
  { label: "TikTok",    icon: "tt", href: "#" },
];

export default function UserFooter() {
  return (
    <footer
      className="w-full border-t border-neutral-300
                 px-4 py-10
                 md:px-[150px] md:py-20"
    >
      {/* Mobile */}
      <div
        className="flex flex-col items-center gap-4 text-center
                   md:flex-row md:items-center md:justify-between md:text-left"
      >
        {/* Left: Logo + tagline */}
        <div className="flex flex-col items-center gap-3 md:items-start">
          {/* Logo row */}
          <Link to="/" className="flex items-center gap-2">
            <img src={BookyLogo} alt="Booky" className="w-8 h-8 md:w-10 md:h-10" />
            <span
              className="font-bold text-neutral-950 tracking-[-0.02em] text-xl leading-[34px] md:text-[24px]"
            >
              Booky
            </span>
          </Link>

          {/* Tagline */}
          <p
            className="font-medium text-neutral-600 tracking-[-0.03em] text-xs leading-[22px] max-w-[280px] md:text-sm md:leading-7 md:max-w-[360px]"
          >
            Discover inspiring stories and timeless knowledge, ready to borrow
            anytime. Explore online or visit our nearest library branch.
          </p>
        </div>

        {/* Right: Follow on Social Media */}
        <div className="flex flex-col items-center gap-3 md:items-end">
          <p
            className="font-semibold text-neutral-950 tracking-[-0.02em] text-sm leading-7 md:text-base md:leading-[30px]"
          >
            Follow on Social Media
          </p>

          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ label, icon, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-300 font-bold text-neutral-600 text-xs hover:border-primary hover:text-primarytransition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}