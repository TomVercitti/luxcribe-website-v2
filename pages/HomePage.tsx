import React from 'react';
import CustomerReviews from '../components/CustomerReviews';
import ReviewSubmissionForm from '../components/ReviewSubmissionForm';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center text-center text-white overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 z-0 object-cover filter brightness-90"
          poster="https://placehold.co/1920x1080/0a0a0a/333333?text=Luxcribe+Engraving"
        >
          <source src="https://raw.githubusercontent.com/TomVercitti/luxcribe-website/main/62_Laser_Engraving_Timelapse_Video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>
        <div className="relative z-20 container mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-playfair mb-4">Your Vision,<br/>Laser Crafted.</h1>
          <p className="text-xl md:text-2xl mb-8">
            Personalized gifts, unique decor, and custom creations.
          </p>
        </div>
      </section>

      {/* Core Offerings Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-playfair text-center mb-4">Our Services</h2>
          <p className="max-w-3xl mx-auto text-center text-gray-400 mb-12">
            Whether you're looking for a ready-to-ship gift, a personalized item from our collection, or want to engrave something of your own, we have you covered.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Ready-Made Gifts */}
            <div className="bg-gray-900 rounded-lg p-8 text-center flex flex-col items-center justify-between shadow-lg hover:shadow-indigo-500/20 transition-shadow">
              <div>
                <h3 className="text-2xl font-bold mb-3">Shop Ready-Made Gifts</h3>
                <p className="text-gray-400 mb-6">Browse our collection of pre-designed, ready-to-ship items. Perfect for last-minute gifts.</p>
              </div>
              <Link to="/shop?type=ready-made" className="mt-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors w-full">
                Browse Gifts
              </Link>
            </div>
            {/* Card 2: Customize Our Products */}
            <div className="bg-gray-900 rounded-lg p-8 text-center flex flex-col items-center justify-between shadow-lg hover:shadow-indigo-500/20 transition-shadow">
              <div>
                <h3 className="text-2xl font-bold mb-3">Customize Our Products</h3>
                <p className="text-gray-400 mb-6">Choose an item from our catalog and bring your vision to life with our powerful design editor.</p>
              </div>
              <Link to="/shop?type=customizable" className="mt-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors w-full">
                Start Customizing
              </Link>
            </div>
            {/* Card 3: Engrave Your Own Item */}
            <div className="bg-gray-900 rounded-lg p-8 text-center flex flex-col items-center justify-between shadow-lg hover:shadow-indigo-500/20 transition-shadow">
              <div>
                <h3 className="text-2xl font-bold mb-3">Engrave Your Own Item</h3>
                <p className="text-gray-400 mb-6">Have a special item you want to personalize? Contact us for a custom quote on our engraving services.</p>
              </div>
              <Link to="/custom-form" className="mt-auto px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors w-full">
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Customer Reviews Section */}
      <section id="reviews" className="py-20 bg-gray-900">
          <div className="container mx-auto px-4 text-center">
              <h3 className="text-4xl md:text-5xl font-playfair mb-4">What Our Customers Say</h3>
              <p className="max-w-3xl mx-auto mt-4 mb-12 text-gray-400">See what our customers have brought to life with our AI-powered design tools.</p>
              <CustomerReviews />
              <ReviewSubmissionForm />
          </div>
      </section>
    </div>
  );
};

export default HomePage;