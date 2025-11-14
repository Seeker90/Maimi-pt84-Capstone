
export const LandingPage = () => {
	return (
		<>
			<div className="carousel" >
				<div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
					<div className="carousel-indicators">
						<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
						<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
						<button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3" aria-label="Slide 4"></button>

					</div>
					<div className="carousel-inner p-5">
						<div className="carousel-item active">
							<img src="https://d368g9lw5ileu7.cloudfront.net/races/races-74xxx/74779/raceBanner-2n2wPEFs-bDd_8h.png" className="d-block w-100"  height="400" width="auto" alt="Slide 1"/>
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
            <div>
                
            </div>
		</>
	);
};