import { FaFacebookF, FaInstagram, FaTwitter, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#3e2723] via-[#a67c52] to-[#8d6748] text-white pt-12 pb-6 px-6 mt-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/logo.png"
              alt="Leather Walk Logo"
              className="h-10 w-10 rounded-full border-2 border-[#e0c097] shadow"
            />
            <span className="text-2xl font-bold font-serif tracking-widest">Leather Walk</span>
          </div>
          <p className="text-[#e0c097] mb-2">Premium Leather Shoes</p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="hover:text-[#ffd700] transition"><FaFacebookF /></a>
            <a href="#" className="hover:text-[#ffd700] transition"><FaInstagram /></a>
            <a href="#" className="hover:text-[#ffd700] transition"><FaTwitter /></a>
          </div>
        </div>
        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-[#ffd700]">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-[#ffd700] transition">Home</a></li>
            <li><a href="/shop" className="hover:text-[#ffd700] transition">Shop</a></li>
            <li><a href="/account" className="hover:text-[#ffd700] transition">Account</a></li>
            <li><a href="/contact" className="hover:text-[#ffd700] transition">Contact</a></li>
          </ul>
        </div>
        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-[#ffd700]">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-[#ffd700]" /> +254 712 345678
            </li>
            <li className="flex items-center gap-2">
              <FaEnvelope className="text-[#ffd700]" /> info@leatherwalk.co.ke
            </li>
            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#ffd700]" /> Nairobi, Kenya
            </li>
          </ul>
        </div>
        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-[#ffd700]">Newsletter</h3>
          <form className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-2 rounded-full text-[#3e2723] focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#ffd700] text-[#3e2723] font-semibold py-2 rounded-full hover:bg-[#e0c097] transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-[#e0c097]/30 mt-10 pt-4 text-center text-sm text-[#e0c097]">
        &copy; {new Date().getFullYear()} Leather Walk. All rights reserved.
      </div>
    </footer>
  );
}