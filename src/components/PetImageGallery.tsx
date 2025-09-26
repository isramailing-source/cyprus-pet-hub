import { useState } from 'react';
import beachGoldenRetriever from '@/assets/pets-beach-golden-retriever.jpg';
import gardenPersianCat from '@/assets/pets-garden-persian-cat.jpg';
import birdsColorfulParrot from '@/assets/pets-birds-colorful-parrot.jpg';
import fieldCuteRabbit from '@/assets/pets-field-cute-rabbit.jpg';
import vineyardBorderCollie from '@/assets/pets-vineyard-border-collie.jpg';
import architectureMaineCoon from '@/assets/pets-architecture-maine-coon.jpg';
import greyPitbullCyprus from '@/assets/pets-grey-pitbull-cyprus.jpg';

const PetImageGallery = () => {
  const petImages = [
    {
      src: beachGoldenRetriever,
      alt: "Golden Retriever playing on Cyprus beach",
      category: "dogs"
    },
    {
      src: gardenPersianCat,
      alt: "Persian cat in Mediterranean garden",
      category: "cats"
    },
    {
      src: birdsColorfulParrot,
      alt: "Colorful parrot in Cyprus countryside",
      category: "birds"
    },
    {
      src: fieldCuteRabbit,
      alt: "Rabbit in Cyprus wildflower field",
      category: "small-pets"
    },
    {
      src: vineyardBorderCollie,
      alt: "Border Collie running through vineyard",
      category: "dogs"
    },
    {
      src: architectureMaineCoon,
      alt: "Maine Coon cat on ancient Cyprus architecture",
      category: "cats"
    },
    {
      src: greyPitbullCyprus,
      alt: "Grey pitbull in Mediterranean Cyprus garden",
      category: "dogs"
    }
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getRandomImage = () => {
    return petImages[Math.floor(Math.random() * petImages.length)];
  };

  const getCurrentImage = () => {
    return petImages[currentImageIndex % petImages.length];
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % petImages.length);
  };

  return {
    petImages,
    getRandomImage,
    getCurrentImage,
    nextImage,
    currentImageIndex
  };
};

export default PetImageGallery;
export { PetImageGallery };