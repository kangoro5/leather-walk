'use client';
import { FaShoePrints, FaLeaf, FaUsers, FaAward } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-white to-amber-200 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-white/90 rounded-3xl shadow-2xl p-8 md:p-14 mt-10 mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-amber-900 mb-4 text-center drop-shadow-lg">
          About <span className="text-amber-700">Leather Walk</span>
        </h1>
        <p className="text-lg md:text-xl text-amber-800 mb-8 text-center max-w-2xl mx-auto">
          At Leather Walk, we believe every step should be a statement. We are passionate about crafting premium, handcrafted leather shoes that blend timeless elegance, modern comfort, and Kenyan artistry.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="flex flex-col items-center text-center">
            <FaShoePrints className="text-amber-700 text-5xl mb-4" />
            <h2 className="text-2xl font-bold text-amber-900 mb-2">Our Story</h2>
            <p className="text-amber-800">
              Founded in Nairobi, Leather Walk was born from a love for quality footwear and a desire to support local artisans. Each pair is meticulously crafted using ethically sourced leather and traditional techniques, ensuring durability and style for every occasion.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <FaLeaf className="text-amber-700 text-5xl mb-4" />
            <h2 className="text-2xl font-bold text-amber-900 mb-2">Sustainability</h2>
            <p className="text-amber-800">
              We are committed to sustainable practices, from eco-friendly materials to fair wages for our craftsmen. Our shoes are made to last, reducing waste and promoting conscious fashion.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="flex flex-col items-center text-center">
            <FaUsers className="text-amber-700 text-5xl mb-4" />
            <h2 className="text-2xl font-bold text-amber-900 mb-2">Our Community</h2>
            <p className="text-amber-800">
              Leather Walk is more than a brand—it's a community. We celebrate Kenyan culture and empower local talent, creating opportunities and inspiring confidence with every step.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <FaAward className="text-amber-700 text-5xl mb-4" />
            <h2 className="text-2xl font-bold text-amber-900 mb-2">Quality Promise</h2>
            <p className="text-amber-800">
              Every shoe undergoes strict quality checks to ensure you receive nothing but the best. Experience the perfect blend of tradition, innovation, and comfort with Leather Walk.
            </p>
          </div>
        </div>

        <div className="bg-amber-50 rounded-2xl p-8 mt-8 shadow-inner flex flex-col items-center">
          <h3 className="text-2xl font-bold text-amber-900 mb-2">Step Into Style With Us</h3>
          <p className="text-amber-800 mb-4 text-center max-w-xl">
            Whether you're dressing for business, leisure, or a special occasion, Leather Walk has the perfect pair for you. Thank you for supporting local craftsmanship and walking with us on this journey.
          </p>
          <a
            href="/shop"
            className="inline-flex items-center justify-center bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-200 gap-3 text-lg md:text-xl mt-2"
          >
            Shop Now
          </a>
        </div>
      </div>
    </div>
  );
}