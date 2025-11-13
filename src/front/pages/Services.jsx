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
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <nav className="navbar navbar-light bg-white border-bottom border-dark border-2 px-4">
        <div className="container-fluid">
          <span className="navbar-brand border border-dark border-2 px-3 py-2 fw-bold">
            Logo
          </span>
          <button 
            className="btn btn-outline-dark px-4" 
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-5">
        <h1 className="text-center display-1 fw-light mb-5">Services</h1>
        
        <div className="row justify-content-center g-4 py-4">
          {serviceCategories.map((category) => (
            <div key={category.id} className="col-auto">
              <div
                className="card category-card border-dark border-2 text-center"
                onClick={() => handleCategoryClick(category.id)}
                style={{ width: '150px', height: '150px', cursor: 'pointer' }}
              >
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                  <div className="fs-1 mb-2">{category.icon}</div>
                  <p className="card-text fw-medium mb-0">{category.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
