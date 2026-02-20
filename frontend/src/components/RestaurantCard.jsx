import { Link } from "react-router-dom";

export default function RestaurantCard({ restaurant }) {
  return (
    <Link
      to={`/restaurant/${restaurant._id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className="card h-100 shadow-sm">

        <img
          src={
            restaurant.image ||
            "https://via.placeholder.com/400x200"
          }
          className="card-img-top"
          style={{ height: "200px", objectFit: "cover" }}
        />

        <div className="card-body">
          <h5>{restaurant.name}</h5>
          <p className="text-muted">
            {restaurant.cuisine || "Restaurant"}
          </p>
        </div>

      </div>
    </Link>
  );
}