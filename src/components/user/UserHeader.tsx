import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useMe } from "@/hooks/useMe";
import { useAppSelector } from "@/app/store";
import BookyLogo from "@/assets/Booky-logo.svg";

export default function UserHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const { data: cart } = useCart();
  const { data: me } = useMe();

  const cartCount = cart?.items?.length ?? 0;

  const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
  const avatarSrc = me?.profilePhoto ? `${BASE_URL}/${me.profilePhoto}` : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleCloseSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header className="w-full bg-white sticky top-0 z-40 shadow-[0px_0px_20px_rgba(203,202,202,0.25)]">
      {/* ═ MOBILE */}
      <div className="md:hidden flex items-center justify-between px-4 h-16">
        {/* Default state */}
        {!searchOpen && (
          <>
            <Link to="/" className="shrink-0">
              <img src={BookyLogo} alt="Booky" className="w-10 h-10" />
            </Link>

            {/* Icons row  */}
            <div className="flex items-center gap-4 relative">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="w-6 h-6 flex items-center justify-center"
                aria-label="Open search"
              >
                <Search className="w-6 h-6 text-neutral-950" strokeWidth={2} />
              </button>

              {/* Bag + badge */}
              <Link
                to="/cart"
                className="relative w-7 h-7 flex items-center justify-center"
                aria-label={`Cart (${cartCount} items)`}
              >
                <ShoppingBag
                  className="w-7 h-7 text-neutral-950"
                  strokeWidth={2}
                />
                {cartCount > 0 && (
                  <span
                    className="absolute w-5 h-5 flex items-center justify-center bg-[#EE1D52] rounded-full pointer-events-non font-bold text-white text-[12px] leading-[23px] tracking-[-0.02em] top-[-3px] left-4"
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>

              {/* Hamburger */}
              <button
                className="w-6 h-6 flex items-center justify-center"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-neutral-950" strokeWidth={2} />
              </button>
            </div>
          </>
        )}

        {/* Search active state */}
        {searchOpen && (
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-4 w-full"
          >
            <Link to="/" className="shrink-0" onClick={handleCloseSearch}>
              <img src={BookyLogo} alt="Booky" className="w-10 h-10" />
            </Link>

            {/* Input pill */}
            <div
              className="flex items-center gap-1.5 px-3 h-10 border
                         border-neutral-300 rounded-full bg-white flex-1"
            >
              <Search
                className="w-5 h-5 text-neutral-600 shrink-0"
                strokeWidth={1.25}
              />
              <input
                autoFocus
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent font-medium text-neutral-600 tracking-[-0.03em] text-sm leading-7 outline-none  placeholder:text-neutral-500"
              />
            </div>

            {/* X close */}
            <button
              type="button"
              onClick={handleCloseSearch}
              className="w-6 h-6 flex items-center justify-center shrink-0"
              aria-label="Close search"
            >
              <X className="w-6 h-6 text-neutral-950" strokeWidth={2} />
            </button>
          </form>
        )}
      </div>

      {/* DESKTOP*/}
      <div className="hidden md:flex items-center justify-between px-[120px] h-20">
        {/* Left: Logo + wordmark */}
        <Link to="/" className="flex items-center gap-[15px] shrink-0">
          <img src={BookyLogo} alt="Booky" className="w-[42px] h-[42px]" />
          <span className="font-bold text-neutral-950 text-[36px] leading-[44px]">
            Booky
          </span>
        </Link>

        {/* Center */}
        <form
          onSubmit={handleSearch}
          className="flex-1 flex justify-center px-8"
        >
          <div
            className="flex items-center gap-1.5 px-4 h-11 border  border-neutral-300 rounded-full bg-white  w-full max-w-[500px]"
          >
            <Search
              className="w-5 h-5 text-neutral-600 shrink-0"
              strokeWidth={1.25}
            />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent font-medium text-neutral-600 tracking-[-0.03em] text-sm leading-7 outline-none  placeholder:text-neutral-500"
            />
          </div>
        </form>

        {/* Right: Bag */}
        <div className="flex items-center gap-6 shrink-0">
          {/* Bag  */}
          <Link
            to="/cart"
            className="relative w-8 h-8 flex items-center justify-center"
            aria-label={`Cart (${cartCount} items)`}
          >
            <ShoppingBag className="w-8 h-8 text-neutral-950" strokeWidth={2} />
            {cartCount > 0 && (
              <span
                className="absolute w-5 h-5 flex items-center justify-center bg-[#EE1D52] rounded-full pointer-events-none font-bold text-white text-[12px] leading-[23px]tracking-[-0.02em] top-[7px] left-[18px]"
              >
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Authenticated: */}
          {isAuthenticated ? (
            <Link to="/profile" className="flex items-center gap-4">
              {/* Avatar */}
              <div
                className="w-12 h-12 rounded-full bg-neutral-200 overflow-hidden shrink-0"
              >
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={me?.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center  font-semibold text-neutral-600 text-base"
                  >
                    {me?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
              </div>

              {/* Name: */}
              <span
                className="font-semibold text-neutral-950 tracking-[-0.02em] text-[18px] leading-8"
              >
                {me?.name ?? "User"}
              </span>

              <ChevronDown
                className="w-6 h-6 text-neutral-950"
                strokeWidth={2}
              />
            </Link>
          ) : (
            /* Not logged in  */
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="font-semibold text-neutral-950 tracking-[-0.02em]text-base leading-[30px] hover:text-primarytransition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="flex items-center justify-center px-5 h-10 rounded-full bg-primary text-white font-bold tracking-[-0.02em] text-base leading-[30px]  hover:bg-primary/90 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
