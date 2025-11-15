export const LandingPage = () => {
	const services = [
		{
			icon: '🏁',
			title: 'Professional Racing',
			description: 'High-speed racing events and professional racing services for enthusiasts and professionals alike.',
			gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
		},
		{
			icon: '🧹',
			title: 'Professional Cleaning',
			description: 'Comprehensive cleaning services for residential and commercial properties with attention to detail.',
			gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
		},
		{
			icon: '🌿',
			title: 'Landscaping Services',
			description: 'Professional landscaping, garden maintenance, and outdoor design to enhance your property.',
			gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
		},
		{
			icon: '💄',
			title: 'Beauty & Cosmetics',
			description: 'Premium beauty services and cosmetic treatments delivered by certified professionals.',
			gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
		},
		{
			icon: '⭐',
			title: 'Premium Consulting',
			description: 'Expert consultation services to help optimize and grow your business operations.',
			gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
		}
	];

	const ServiceCard = ({ service }) => (
		<div className="col-md-6 col-lg-4">
			<div 
				className="card h-100 border-0 shadow-sm"
				style={{ 
					transition: 'transform 0.3s ease, box-shadow 0.3s ease',
					cursor: 'pointer'
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.transform = 'translateY(-10px)';
					e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.transform = 'translateY(0)';
					e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
				}}
			>
				<div 
					className="card-body text-center p-4"
					style={{ background: service.gradient }}
				>
					<div 
						style={{ 
							fontSize: '3rem',
							marginBottom: '1rem',
							color: '#fff'
						}}
					>
						{service.icon}
					</div>
					<h5 className="card-title fw-bold text-white mb-3">{service.title}</h5>
					<p className="card-text text-white-50">
						{service.description}
					</p>
				</div>
				<div className="card-footer border-0 bg-white text-center py-3">
					<a href="#" className="btn btn-sm btn-outline-primary">Learn More</a>
				</div>
			</div>
		</div>
	);

	return (
		<>
			{/* Carousel Section */}
			<div className="carousel">
				<div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
					<div className="carousel-indicators">
						<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
						<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
						<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
						<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>
					</div>
					<div className="carousel-inner p-5">
						<div className="carousel-item active">
							<img src="https://d368g9lw5ileu7.cloudfront.net/races/races-74xxx/74779/raceBanner-2n2wPEFs-bDd_8h.png" className="d-block w-100" height="400" width="auto" alt="Slide 1"/>
						</div>
						<div className="carousel-item">
							<img src="https://www.fortador.com/wp-content/uploads/2022/11/brad-starkey-eP8h7YVhFHk-unsplash-1080x675.jpg" className="d-block w-100" height="400" alt="Slide 2"/>
						</div>
						<div className="carousel-item">
							<img src="https://cdnassets.stihlusa.com/1632165150-fs56rceact2002.jpg?fit=crop&h=554&w=984" className="d-block w-100" height="400" alt="Slide 3"/>
						</div>
						<div className="carousel-item">
							<img src="https://media.istockphoto.com/id/453936599/photo/woman-getting-her-makeup-done.jpg?s=612x612&w=0&k=20&c=SeueKhzqKRMvIvUZcJ6QvmzHDpBjC0x6vllC_MWovVY=" className="d-block w-100" height="400" alt="Slide 4"/>
						</div>
					</div>
					<button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
						<span className="carousel-control-prev-icon" aria-hidden="true"></span>
						<span className="visually-hidden">Previous</span>
					</button>
					<button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
						<span className="carousel-control-next-icon" aria-hidden="true"></span>
						<span className="visually-hidden">Next</span>
					</button>
				</div>
			</div>

			{/* About Us Section */}
			<section className="about-us py-5" style={{ backgroundColor: '#f8f9fa' }}>
				<div className="container">
					<div className="row align-items-center">
						<div className="col-lg-6 mb-4 mb-lg-0">
							<h2 className="display-5 fw-bold mb-4">About Us</h2>
							<p className="lead mb-3">
								We are a dedicated team of professionals committed to delivering exceptional services across multiple industries. With years of experience and a passion for excellence, we've built a reputation for quality and reliability.
							</p>
							<p className="mb-3">
								Our mission is to provide innovative, cost-effective solutions that exceed our clients' expectations. Whether you're looking for professional services or specialized expertise, we're here to help your business succeed.
							</p>
							<ul className="list-unstyled">
								<li className="mb-2">
									<span style={{ color: '#28a745', marginRight: '8px' }}>✓</span>
									<strong>Professional Team:</strong> Experienced experts in their fields
								</li>
								<li className="mb-2">
									<span style={{ color: '#28a745', marginRight: '8px' }}>✓</span>
									<strong>Quality Assured:</strong> Every project meets our high standards
								</li>
								<li className="mb-2">
									<span style={{ color: '#28a745', marginRight: '8px' }}>✓</span>
									<strong>Customer Focused:</strong> Your satisfaction is our priority
								</li>
								<li className="mb-2">
									<span style={{ color: '#28a745', marginRight: '8px' }}>✓</span>
									<strong>Competitive Pricing:</strong> Best value for your investment
								</li>
							</ul>
						</div>
						<div className="col-lg-6">
							<img 
								src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=400&fit=crop" 
								alt="About Us" 
								className="img-fluid rounded shadow"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Services Section */}
			<section className="services py-5" style={{ backgroundColor: '#ffffff' }}>
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

			{/* CTA Section */}
			<section className="cta py-5" style={{ backgroundColor: '#667eea' }}>
				<div className="container text-center">
					<h3 className="display-6 fw-bold text-white mb-3">Ready to Get Started?</h3>
					<p className="lead text-white-50 mb-4">
						Contact us today to learn more about how we can serve you
					</p>
					<button className="btn btn-light btn-lg me-2">Contact Us</button>
					<button className="btn btn-outline-light btn-lg">Get a Quote</button>
				</div>
			</section>
		</>
	);
};