import { useNavigate } from 'react-router-dom';
import './Services.css';

export const Services = () => {
  const navigate = useNavigate();

  const serviceCategories = [
    { id: 'beauty', name: 'Beauty', icon: '💄' },
    { id: 'home-care', name: 'Home Care', icon: '🏠' },
    { id: 'pets', name: 'Pets', icon: '🐾' },
    { id: 'vehicles', name: 'Vehicles', icon: '🚗' },
    { id: 'others', name: 'Others', icon: '📦' }
  ];

  const handleCategoryClick = (categoryId) => {
    navigate(`/services/${categoryId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="services-page">
      <header className="services-header">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="services-content">
        <h1 className="services-title">Services</h1>
        
        <div className="services-categories">
          {serviceCategories.map((category) => (
            <div
              key={category.id}
              className="category-card"
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="category-icon">{category.icon}</div>
              <p className="category-name">{category.name}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};