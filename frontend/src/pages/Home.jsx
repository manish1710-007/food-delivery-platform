import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import RestaurantCard from '../components/RestaurantCard';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/restaurants').then(r => setRestaurants(r.data)).finally(() => setLoading(false))
    api.get('/products').then(r => setProducts(r.data));
  }, []);

  if (loading) return <p classname="m-4">Loading restaurants...</p>;

  {products.map((product) => (
    <div key={product._id} className="col-md-3 mb-4">
      <ProductCard product={product} />
    </div>
  ))}

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Nearby Restaurants</h2>

      <div className="row">
        {restaurants.map(r => (
          <div className="col-md-4 mb-3" key={r._id}>
            <RestaurantCard restaurant={r} />
          </div>
        ))}
      </div>
    </div>
  );
}
