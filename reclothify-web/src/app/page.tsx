import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            Reclothify Logistics
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Revolutionizing sustainable fashion through efficient logistics and clothing redistribution
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/donate"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Donate Clothes
            </Link>
            <Link
              href="/products"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🚛</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">AI-Powered Logistics</h3>
            <p className="text-gray-600 mb-4">
              Advanced route optimization with 87%+ efficiency using machine learning algorithms.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Real-time vehicle tracking</li>
              <li>• Smart route optimization</li>
              <li>• Cost reduction analytics</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Live Fleet Management</h3>
            <p className="text-gray-600 mb-4">
              Monitor your entire fleet with real-time tracking and performance metrics.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Live vehicle positions</li>
              <li>• Driver performance tracking</li>
              <li>• Fuel efficiency monitoring</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Green Technology</h3>
            <p className="text-gray-600 mb-4">
              Sustainable logistics with CO₂ tracking and environmentally optimized routes.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Carbon footprint tracking</li>
              <li>• Green vehicle selection</li>
              <li>• Sustainability reporting</li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Join the Sustainable Fashion Revolution
          </h2>
          <p className="text-gray-600 mb-6">
            Whether you&apos;re a donor, recipient, or business partner, Reclothify Logistics has solutions for you.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/register"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/business/logistics"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors"
            >
              🚛 Try Logistics Demo
            </Link>
            <Link
              href="/fleet"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition-colors"
            >
              📍 View Fleet
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
