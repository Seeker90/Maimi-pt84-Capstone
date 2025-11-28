import { useNavigate } from 'react-router-dom';
import './../../lib/Services.css';

export const Services = () => {
  const navigate = useNavigate();
  
  const serviceCategories = [
    { id: 'beauty', name: 'Beauty', icon: '💄', gradient: 'gradient-pink-red' },
    { id: 'home', name: 'Home Care', icon: '🏠', gradient: 'gradient-purple' },
    { id: 'pets', name: 'Pets', icon: '🐾', gradient: 'gradient-cyan' },
    { id: 'vehicles', name: 'Vehicles', icon: '🚗', gradient: 'gradient-pink-yellow' }
  ];
  
  const handleCategoryClick = (categoryId) => {
    navigate(`/services/${categoryId}`);
  };
  
  return (
    <div className="min-vh-100 bg-light">
      <main className="container py-5">
        <h1 className="text-center display-1 fw-light mb-5">Services</h1>
        
        <div className="row justify-content-center g-4 py-4">
          {serviceCategories.map((category) => (
            <div key={category.id} className="col-6 col-sm-4 col-md-3 col-lg-2">
              <div
                className={`card category-card h-100 text-center text-white border-0 ${category.gradient}`}
                onClick={() => handleCategoryClick(category.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleCategoryClick(category.id)}
              >
                <div className="card-body d-flex flex-column justify-content-center align-items-center p-3">
                  <div className="display-4 mb-2">{category.icon}</div>
                  <p className="card-text fw-semibold mb-0">{category.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};