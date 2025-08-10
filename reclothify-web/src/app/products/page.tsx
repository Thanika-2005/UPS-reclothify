export default function ProductsPage() {
  const products = [
    {
      id: 1,
      name: 'Vintage Denim Jacket',
      category: 'Outerwear',
      condition: 'Excellent',
      price: 'Free',
      image: '/placeholder-image.jpg'
    },
    {
      id: 2,
      name: 'Cotton T-Shirts (Pack of 3)',
      category: 'Tops',
      condition: 'Good',
      price: 'Free',
      image: '/placeholder-image.jpg'
    },
    {
      id: 3,
      name: 'Winter Coat',
      category: 'Outerwear',
      condition: 'Very Good',
      price: 'Free',
      image: '/placeholder-image.jpg'
    },
    {
      id: 4,
      name: 'Summer Dress',
      category: 'Dresses',
      condition: 'Excellent',
      price: 'Free',
      image: '/placeholder-image.jpg'
    },
    {
      id: 5,
      name: 'Business Shirts (Pack of 2)',
      category: 'Formal',
      condition: 'Good',
      price: 'Free',
      image: '/placeholder-image.jpg'
    },
    {
      id: 6,
      name: 'Casual Jeans',
      category: 'Bottoms',
      condition: 'Very Good',
      price: 'Free',
      image: '/placeholder-image.jpg'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Available Products</h1>
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        Browse our collection of donated clothing items. All items are available for free 
        to those in need through our redistribution program.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Product Image</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-2">Category: {product.category}</p>
              <p className="text-gray-600 mb-4">Condition: {product.condition}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">{product.price}</span>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
                  Request Item
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">
          Looking for something specific? We receive new donations regularly.
        </p>
        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
          Submit a Request
        </button>
      </div>
    </div>
  );
}
