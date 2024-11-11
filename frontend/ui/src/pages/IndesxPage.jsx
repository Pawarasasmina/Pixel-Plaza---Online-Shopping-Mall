import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/indexpage.css";
import axios from 'axios';

const IndexPage = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: true,
    pauseOnHover: true, // Pauses autoplay on hover
  };
  const [shops, setShops] = useState([]);
  useEffect(() => {
    axios.get('http://localhost:3000/api/shops/get')
      .then(response => {
        const filteredShops = response.data.filter(
          shop => shop.shopKeeperName && shop.shopName && shop.description && shop.floorID
        ); // Filter out shops with missing data
        const shuffledShops = filteredShops.sort(() => 0.5 - Math.random());
        const selectedShops = shuffledShops.slice(0, 4); // Select 4 random shops
        setShops(selectedShops);
      })
      .catch(error => console.error('Error fetching shops:', error));
  }, []);

  return (
    <div className="homepage">
    <section id="offers" className="section offers flex">
      <div className="offer-slider-container">
        <Slider {...sliderSettings} className="offer-slider">
          <div>
            <img
              src="https://img.freepik.com/free-vector/mega-sale-offers-banner-template_1017-31299.jpg?ga=GA1.1.1753345720.1723288546&semt=ais_hybrid"
              alt="50% off on Electronics"
              className="offer-image"
            />
            <div className="slider-overlay">
              <div className="offer-title">50% Off on Electronics</div>
            </div>
          </div>
          <div>
            <img
              src="https://img.freepik.com/free-vector/promotion-sale-labels-best-offers_206725-127.jpg?t=st=1723357868~exp=1723361468~hmac=7d41c55863d7d1185ec051a4a054563e5ada0eead88b99cf7a4739fdc9b74cd1&w=740"
              alt="Buy 1 Get 1 Free on Fashion"
              className="offer-image"
            />
            <div className="slider-overlay">
              <div className="offer-title">Buy 1 Get 1 Free on Fashion</div>
            </div>
          </div>
        </Slider>
      </div>
      <div className="map-button-container">
        <Link to="/map" className="map-button">
          <img
            src="https://img.icons8.com/ios-filled/100/ffffff/map-marker.png" // Replace with your button image
            alt="View on Map"
            className="map-button-image"
          />
          <span className="map-button-text">View on Map</span>
        </Link>
      </div>
    </section>

      <section id="categories" className="section categories">
        <h2>Shop by Categories</h2>
        <div className="category-list">
          <Link to="/itemlist?category=Electronics" className="category-item">
            <img
              src="https://img.freepik.com/premium-photo/gadgets-accessories-isolated-white-background_1272184-39.jpg"
              alt="Electronics"
            />
            <div>Electronics</div>
          </Link>
          <Link to="/itemlist?category=Fashion" className="category-item">
            <img
              src="https://img.freepik.com/free-photo/portrait-smiling-beautiful-girl-her-handsome-boyfriend-laughing-happy-cheerful-couple-sunglasses_158538-5002.jpg?t=st=1723301802~exp=1723305402~hmac=1ca1bc78964225539b12f228a6368ad0c06948a549d391422613e1c67fc4f830&w=740"
              alt="Fashion"
            />
            <div>Fashion</div>
          </Link>
          <Link to={`/itemlist?category=${encodeURIComponent('Home & Garden')}`} className="category-item">

            <img
              src="https://img.freepik.com/premium-photo/gardening-gardener-rustic-shed-wellington-flowerpot-potted_488220-80989.jpg?ga=GA1.1.1753345720.1723288546&semt=ais_hybrid"
              alt="Home & Garden"
            />
            <div>Home & Garden</div>
          </Link>
          <Link to={`/itemlist?category=${encodeURIComponent('Health & Beauty')}`} className="category-item">

            <img
              src="https://img.freepik.com/free-vector/spa-health-beauty-template_23-2147494970.jpg?ga=GA1.1.1753345720.1723288546&semt=ais_hybrid"
              alt="Health and Beauty"
            />
            <div>Health and Beauty</div>
          </Link>
          <Link to={`/itemlist?category=${encodeURIComponent('Sport & Outdoor')}`} className="category-item">

            <img
              src="https://img.freepik.com/free-photo/kettlebell-fitness-still-life_23-2151739196.jpg?ga=GA1.1.1753345720.1723288546&semt=ais_hybrid"
              alt="Sports and Outdoor"
            />
            <div>Sports and Outdoor</div>
          </Link>
          <Link to="/itemlist?category=Groceries" className="category-item">
            <img
              src="https://img.freepik.com/free-photo/shopping-cart-full-with-groceries-dark-backgrounds_1268-29508.jpg?ga=GA1.1.1753345720.1723288546&semt=ais_hybrid"
              alt="Groceries"
            />
            <div>Groceries</div>
          </Link>
          <Link to={`/itemlist?category=${encodeURIComponent('Gaming & Entertainment')}`} className="category-item">

            <img
              src="https://img.freepik.com/free-photo/person-wearing-futuristic-virtual-reality-glasses-gaming_23-2151133155.jpg?ga=GA1.1.1753345720.1723288546&semt=ais_hybrid"
              alt="Gaming & Entertainment"
            />
            <div>Gaming & Entertainment</div>
          </Link>
          <Link to="/itemlist?category=Toys" className="category-item">
            <img
              src="https://img.freepik.com/premium-photo/toys-collection-isolated-background_488220-1015.jpg?w=740"
              alt="Toys"
            />
            <div>Toys</div>
          </Link>
        </div>
      </section>

      <div className="shop-list p-6">
        <h2 className="text-2xl font-bold text-center mb-8">Featured Shops</h2>
        {shops.length === 0 ? (
          <p className="text-center text-gray-500">No shops available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shops.map((shop) => (
              <div
                key={shop._id}
                className="shop-card bg-white shadow-lg rounded-lg p-6 transition transform hover:scale-105 hover:shadow-xl"
              >
                <img 
                  src={shop.shopKeeperPhoto || "data:image/jpeg;base64,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AdPtPngDyACACACACACACACACACACACACACACACACACACACACACACACACACACACAPX2nzwB5ABABABABABABABABABABABABABABABABABABABABABABABABABABABAH/9k="} 
                  alt={shop.shopKeeperPhoto} 
                  className="w-full h-40 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{shop.shopName}</h2>
                  <p className="text-gray-600 mb-1">Shopkeeper: {shop.shopKeeperName}</p>
                  <p className="text-gray-600 mb-1">Description: {shop.description}</p>
                  <p className="text-gray-600">Floor ID: {shop.floorID}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

  
    </div>
  );
};

export default IndexPage;
