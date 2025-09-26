import { useState, useEffect } from 'react';
import beachGoldenRetriever from '@/assets/pets-beach-golden-retriever.jpg';
import gardenPersianCat from '@/assets/pets-garden-persian-cat.jpg';
import birdsColorfulParrot from '@/assets/pets-birds-colorful-parrot.jpg';
import fieldCuteRabbit from '@/assets/pets-field-cute-rabbit.jpg';
import vineyardBorderCollie from '@/assets/pets-vineyard-border-collie.jpg';
import architectureMaineCoon from '@/assets/pets-architecture-maine-coon.jpg';
import greyPitbullCyprus from '@/assets/pets-grey-pitbull-cyprus.jpg';

const EnhancedPetHero = () => {
  const heroImages = [
    {
      src: greyPitbullCyprus,
      alt: "Grey pitbull in Mediterranean Cyprus garden",
      title: "Loyal Companions",
      description: "Discover the perfect pet for your family"
    },
    {
      src: architectureMaineCoon,
      alt: "Maine Coon cat on ancient Cyprus architecture",
      title: "Heritage & Pets",
      description: "Where tradition meets modern pet care"
    },
    {
      src: birdsColorfulParrot,
      alt: "Colorful parrot in Cyprus countryside",
      title: "Exotic Pet Care",
      description: "Specialized care for unique companions"
    },
    {
      src: vineyardBorderCollie,
      alt: "Border Collie running through vineyard",
      title: "Active Pet Lifestyle", 
      description: "Exercise and adventure in Cyprus"
    },
    {
      src: gardenPersianCat,
      alt: "Persian cat in Mediterranean garden", 
      title: "Garden Paradise",
      description: "Creating pet-friendly outdoor spaces"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const currentImage = heroImages[currentIndex];

  return (
    <div className="relative overflow-hidden rounded-3xl shadow-elegant border border-primary/20">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${currentImage.src})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-cyprus-blue/80 via-primary/60 to-cyprus-gold/70" />
      
      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">
          {currentImage.title}
        </h2>
        <p className="text-lg md:text-xl opacity-90 max-w-2xl animate-fade-in">
          {currentImage.description}
        </p>
        
        {/* Image Indicators */}
        <div className="flex gap-2 mt-6">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-white shadow-lg' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`View image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnhancedPetHero;