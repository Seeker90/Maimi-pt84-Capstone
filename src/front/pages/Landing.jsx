
import './../../lib/LandingPage.css';

export const LandingPage = () => {
  const services = [
    {
      icon: '🚗',
      title: 'Vehicle',
      description: 'Any services related to vehicles such as maintenance or cleaning',
      gradientClass: 'gradient-purple'
    },
    {
      icon: '🏠',
      title: 'Home Care',
      description: 'Comprehensive cleaning services for your house, both inside and out.',
      gradientClass: 'gradient-pink-red'
    },
    {
      icon: '🐾',
      title: 'Pets',
      description: 'Any services related to Pets such as Grooming, walks, etc.',
      gradientClass: 'gradient-cyan'
    },
    {
      icon: '💄',
      title: 'Beauty',
      description: 'Premium beauty services and cosmetic treatments delivered by certified professionals.',
      gradientClass: 'gradient-pink-yellow'
    },
  ];

  const allImages = [
    { src: '/pet-services-merged.jpg', service: 'Pet Services' },
    { src: '/car-services-merged.jpg', service: 'Car Services' },
    { src: '/home-care-merged.jpg', service: 'Home Care' },
    { src: '/personal-services-merged.jpg', service: 'Personal services' }
  ];

  const ServiceCard = ({ service }) => (
    <div className="col-md-6">
      <div className="card h-100 border-0 shadow service-card overflow-hidden">
        <div className={`card-body text-center text-white p-4 p-lg-5 ${service.gradientClass}`}>
          <div className="service-icon fs-1 mb-3">{service.icon}</div>
          <h5 className="card-title fw-bold fs-4 mb-2">{service.title}</h5>
          <p className="card-text opacity-75">{service.description}</p>
        </div>
        <div className="card-footer bg-white border-0 text-center py-3">
          <a href="/login" className="btn btn-outline-primary rounded-pill px-4">
            Learn More
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="carousel-grid-container mb-5">
        <div className="carousel-grid">
          {[0, 1, 2, 3].map((colIndex) => (
            <div key={colIndex} className="carousel-column">
              <div id={`carousel${colIndex}`} className="carousel slide h-100" data-bs-ride="carousel" data-bs-interval={3000 + colIndex * 500}>
                <div className="carousel-inner h-100">
                  {allImages.map((item, imgIndex) => (
                    <div key={imgIndex} className={`carousel-item h-100 ${imgIndex === colIndex ? 'active' : ''}`}>
                      <div className="carousel-image-wrapper">
                        <img src={item.src} className="d-block w-100 h-100 carousel-column-img" alt={`Column ${colIndex + 1} - Image ${imgIndex + 1}`} />
                        <div className="carousel-overlay">
                          <span className="service-name">{item.service}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <section className="about-bg py-5">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-4">About Us</h2>
              <p className="lead text-secondary mb-3">
                We are a dedicated team of professionals committed to delivering exceptional services across multiple industries.
              </p>
              <p className="text-muted mb-4">
                Our mission is to provide innovative, cost-effective solutions that exceed our clients' expectations.
              </p>
              <ul className="list-unstyled">
                {[
                  { label: 'Professional Team', desc: 'Experienced experts in their fields' },
                  { label: 'Quality Assured', desc: 'Every project meets our high standards' },
                  { label: 'Customer Focused', desc: 'Your satisfaction is our priority' },
                  { label: 'Competitive Pricing', desc: 'Best value for your investment' },
                ].map((item, i) => (
                  <li key={i} className="d-flex align-items-start mb-3 p-3 bg-white rounded shadow-sm">
                    <span className="text-success fs-5 me-3">✓</span>
                    <div>
                      <strong className="d-block">{item.label}</strong>
                      <small className="text-muted">{item.desc}</small>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop"
                alt="About Us"
                className="img-fluid rounded shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Our Services</h2>
            <p className="lead text-muted">
              We offer a comprehensive range of professional services to meet your needs
            </p>
          </div>
          <div className="row g-4">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
