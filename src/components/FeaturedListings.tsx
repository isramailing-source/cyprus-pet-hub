import PetCard from "./PetCard";
import goldenRetrieverImage from "@/assets/golden-retriever-cyprus.jpg";
import britishShorthairImage from "@/assets/british-shorthair-cyprus.jpg";
import birdsImage from "@/assets/birds-cyprus.jpg";

const featuredPets = [
  {
    id: "1",
    name: "Golden Buddy",
    price: "800",
    location: "Limassol",
    timePosted: "2 hours ago",
    image: goldenRetrieverImage,
    category: "Dogs",
    age: "3 months",
    breed: "Golden Retriever",
    isFavorited: true
  },
  {
    id: "2",
    name: "Luna",
    price: "450",
    location: "Nicosia",
    timePosted: "5 hours ago",
    image: britishShorthairImage,
    category: "Cats",
    age: "6 months",
    breed: "British Shorthair",
    isFavorited: false
  },
  {
    id: "3",
    name: "Colorful Parrots",
    price: "250",
    location: "Paphos",
    timePosted: "1 day ago",
    image: birdsImage,
    category: "Birds",
    age: "1 year",
    breed: "Mixed Parrots",
    isFavorited: false
  },
  {
    id: "4",
    name: "Bella",
    price: "600",
    location: "Larnaca",
    timePosted: "2 days ago",
    image: goldenRetrieverImage,
    category: "Dogs",
    age: "4 months",
    breed: "Labrador Mix",
    isFavorited: true
  },
  {
    id: "5",
    name: "Whiskers",
    price: "300",
    location: "Famagusta",
    timePosted: "3 days ago",
    image: britishShorthairImage,
    category: "Cats",
    age: "8 months",
    breed: "Persian Cat",
    isFavorited: false
  },
  {
    id: "6",
    name: "Canary Duo",
    price: "120",
    location: "Kyrenia",
    timePosted: "4 days ago",
    image: birdsImage,
    category: "Birds",
    age: "6 months",
    breed: "Canaries",
    isFavorited: true
  }
];

const FeaturedListings = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Pets
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing pets looking for their forever homes in Cyprus
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredPets.map((pet) => (
            <PetCard key={pet.id} {...pet} />
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-full hover:opacity-90 transition-opacity font-medium">
            View All Listings
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;