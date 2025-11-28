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
      <div id="heroCarousel" className="carousel slide mb-5 shadow-lg rounded-bottom overflow-hidden" data-bs-ride="carousel" data-bs-interval="3000">
        <div className="carousel-indicators">
          {[0, 1, 2, 3].map((i) => (
            <button
              key={i}
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to={i}
              className={i === 0 ? 'active' : ''}
              aria-current={i === 0 ? 'true' : undefined}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <div className="carousel-inner">
          {[
            'https://d368g9lw5ileu7.cloudfront.net/races/races-74xxx/74779/raceBanner-2n2wPEFs-bDd_8h.png',
            'https://www.fortador.com/wp-content/uploads/2022/11/brad-starkey-eP8h7YVhFHk-unsplash-1080x675.jpg',
            'https://cdnassets.stihlusa.com/1632165150-fs56rceact2002.jpg?fit=crop&h=554&w=984',
            'https://media.istockphoto.com/id/453936599/photo/woman-getting-her-makeup-done.jpg?s=612x612&w=0&k=20&c=SeueKhzqKRMvIvUZcJ6QvmzHDpBjC0x6vllC_MWovVY='
          ].map((src, i) => (
            <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
              <img src={src} className="d-block w-100 carousel-img" alt={`Slide ${i + 1}`} />
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
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