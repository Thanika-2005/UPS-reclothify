'use client';
import { useState } from 'react';

export default function DonatePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    clothingType: '',
    quantity: '',
    condition: 'good',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Donation form submitted:', form);
    alert('Thank you for your donation! We will contact you soon.');
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Donate Clothes</h1>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              className="border border-gray-300 rounded-lg px-4 py-2"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 rounded-lg px-4 py-2"
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              required
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="tel"
              placeholder="Phone Number"
              className="border border-gray-300 rounded-lg px-4 py-2"
              value={form.phone}
              onChange={(e) => setForm({...form, phone: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Clothing Type (e.g., Shirts, Pants)"
              className="border border-gray-300 rounded-lg px-4 py-2"
              value={form.clothingType}
              onChange={(e) => setForm({...form, clothingType: e.target.value})}
              required
            />
          </div>

          <textarea
            placeholder="Pickup Address"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            rows={3}
            value={form.address}
            onChange={(e) => setForm({...form, address: e.target.value})}
            required
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Estimated Quantity"
              className="border border-gray-300 rounded-lg px-4 py-2"
              value={form.quantity}
              onChange={(e) => setForm({...form, quantity: e.target.value})}
              required
            />
            <select
              className="border border-gray-300 rounded-lg px-4 py-2"
              value={form.condition}
              onChange={(e) => setForm({...form, condition: e.target.value})}
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
          </div>

          <textarea
            placeholder="Additional Description"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Submit Donation Request
          </button>
        </form>
      </div>
    </div>
  );
}
