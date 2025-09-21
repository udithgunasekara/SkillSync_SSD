import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import axios from 'axios';

interface ImageData {
  gigImageId: string;
  gigImage: string;
}

interface ImageCarouselProps {
  gigId: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ gigId }) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [firstImage, setFirstImage] = useState<string>('');

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get<Map<string, string[]>>(`http://localhost:8082/freelancer-gigs/${gigId}/gig-images/my-gig-images`);
        // Transform response data to ImageData format
        const imageData: ImageData[] = Object.entries(response.data).map(([title, imageList]) => ({
          gigImageId: title,
          gigImage: imageList[0] // Assuming only one image per title for simplicity
        }));
        setImages(imageData);

        // Set the first image to be displayed below the carousel
        if (imageData.length > 0) {
          setFirstImage(imageData[0].gigImage);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, [gigId]);

  return (
<div className="image-carousel-container" style={{ width: '700px', height: '495px', margin: 'auto' }}>
  <Carousel className="carousel-custom" style={{ width: '100%', height: '100%' }} interval={2000}>
    {images.map((image, index) => (
      <Carousel.Item key={index}>
        <img 
          className="d-block w-100 rounded" // Ensure image fills the carousel width
          src={`data:image/jpeg;base64,${image.gigImage}`} 
          alt={`Slide ${index}`} 
          style={{ 
            width: '600px', 
            height: '495px', 
            objectFit: 'cover', 
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)', // Increase shadow intensity
            transition: 'transform 0.5s ease', // Add animation transition
            transform: 'scale(1)', // Initial scale
          }} 
          onMouseEnter={(e: React.MouseEvent<HTMLImageElement>) => (e.target as HTMLImageElement).style.transform = 'scale(1.05)'} // Scale up on hover
          onMouseLeave={(e: React.MouseEvent<HTMLImageElement>) => (e.target as HTMLImageElement).style.transform = 'scale(1)'} // Scale back to normal on hover out
        />
      </Carousel.Item>
    ))}
  </Carousel>
</div>
  );
};

export default ImageCarousel;
