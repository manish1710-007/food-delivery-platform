import { Link } from 'react-router-dom';

export default function RestaurantCard({ restaurant }) {
    return (
        <div classname="card h-100">
            <div classname="card-body">
                <h5>{restaurant.name}</h5>
                <p>{restaurant.address}</p>
                <p><strong>Cuisine:</strong> {restaurant.cuisine}</p>

                <Link to={`/restaurant/${restaurant._id}`} className="btn btn-primary btn-sm">
                    View Menu
                </Link>
            </div>
        </div>
    );
}