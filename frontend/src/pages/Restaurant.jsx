import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

export default function RestaurantPage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products?restaurant=${id}`).then(r => setProducts(r.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="m-4">Loading menu...</p>;

   return (
    <div className="container mt-4">
      <h2 className="mb-4">Menu</h2>

      <div className="row">
        {products.map((product) => (
          <div key={product._id} className="col-md-3 mb-4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}