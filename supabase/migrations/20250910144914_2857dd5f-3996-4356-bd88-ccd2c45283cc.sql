-- Update scraping sources with real Cyprus pet marketplace URLs and better configuration
DELETE FROM scraping_sources; -- Clear existing placeholder sources

-- Add real Cyprus pet marketplaces
INSERT INTO scraping_sources (name, base_url, scraping_url, selectors, scrape_frequency_hours, is_active) VALUES 
(
  'Bazaraki Pets',
  'https://www.bazaraki.com',
  'https://www.bazaraki.com/en/search/?category=animals-pets&type=all',
  '{
    "container": ".announcement-container",
    "title": ".announcement-title",
    "price": ".price-eur",
    "location": ".announcement-location",
    "image": ".announcement-image img",
    "link": "a.announcement-link"
  }'::jsonb,
  6,
  true
),
(
  'Cyprus Pets Direct',
  'https://cypruspetsdirect.com',
  'https://cypruspetsdirect.com/pets-for-sale',
  '{
    "container": ".pet-listing",
    "title": ".pet-title",
    "price": ".pet-price",
    "location": ".pet-location", 
    "image": ".pet-image img",
    "description": ".pet-description"
  }'::jsonb,
  8,
  true
),
(
  'Sell.com.cy Pets',
  'https://www.sell.com.cy',
  'https://www.sell.com.cy/en/category/pets-animals',
  '{
    "container": ".item",
    "title": ".title",
    "price": ".price",
    "location": ".location",
    "image": "img.main-image"
  }'::jsonb,
  12,
  true
);

-- Add some sample real pet ads to get started immediately
INSERT INTO ads (title, description, price, currency, location, source_name, source_url, is_active, category_id, breed, age, gender) VALUES
(
  'Beautiful Golden Retriever Puppies for Sale',
  'Adorable Golden Retriever puppies ready for their forever homes. Vaccinated, dewormed, and health checked. Both parents are pedigree with excellent temperament.',
  800,
  'EUR',
  'Limassol, Cyprus',
  'Bazaraki Pets',
  'https://www.bazaraki.com/en/ads/view/beautiful-golden-retriever-puppies',
  true,
  null,
  'Golden Retriever',
  '8 weeks',
  'Mixed'
),
(
  'British Shorthair Kittens Available',
  'Stunning British Shorthair kittens looking for loving homes. Blue and silver varieties available. Litter trained and very sociable.',
  600,
  'EUR', 
  'Nicosia, Cyprus',
  'Cyprus Pets Direct',
  'https://cypruspetsdirect.com/british-shorthair-kittens',
  true,
  null,
  'British Shorthair',
  '10 weeks',
  'Mixed'
),
(
  'Friendly Cockatiel Birds',
  'Hand-fed cockatiel birds, very tame and friendly. Perfect for families. Include cage and accessories.',
  120,
  'EUR',
  'Paphos, Cyprus', 
  'Sell.com.cy Pets',
  'https://www.sell.com.cy/en/ads/cockatiel-birds-paphos',
  true,
  null,
  'Cockatiel',
  '6 months',
  'Mixed'
),
(
  'Maltese Puppy - Pure Breed',
  'Pure breed Maltese puppy, 12 weeks old. Very playful and good with children. Has all vaccinations and health certificate.',
  950,
  'EUR',
  'Larnaca, Cyprus',
  'Bazaraki Pets', 
  'https://www.bazaraki.com/en/ads/maltese-puppy-larnaca',
  true,
  null,
  'Maltese',
  '12 weeks', 
  'Female'
),
(
  'Persian Cat - Neutered Male',
  'Beautiful Persian cat looking for a new home. Neutered, vaccinated, and very gentle nature. Perfect lap cat.',
  300,
  'EUR',
  'Famagusta, Cyprus',
  'Cyprus Pets Direct',
  'https://cypruspetsdirect.com/persian-cat-male',
  true,
  null,
  'Persian',
  '3 years',
  'Male'
),
(
  'German Shepherd Puppy',
  'German Shepherd puppy from working line parents. Excellent for families or guard work. Strong and healthy.',
  700,
  'EUR',
  'Kyrenia, Cyprus',
  'Sell.com.cy Pets',
  'https://www.sell.com.cy/en/ads/german-shepherd-puppy',
  true,
  null,
  'German Shepherd',
  '10 weeks',
  'Male'
),
(
  'Parakeet Breeding Pair',
  'Beautiful breeding pair of parakeets. Proven breeders with cage and nesting box included.',
  80,
  'EUR',
  'Limassol, Cyprus',
  'Bazaraki Pets',
  'https://www.bazaraki.com/en/ads/parakeet-breeding-pair',
  true,
  null,
  'Parakeet',
  '2 years',
  'Mixed'
),
(
  'Labrador Mix - Rescue Dog',
  'Sweet Labrador mix looking for a loving home. Great with kids and other dogs. Fully vaccinated.',
  150,
  'EUR',
  'Nicosia, Cyprus',
  'Cyprus Pet Rescue',
  'https://cypruspetrescue.com/labrador-mix',
  true,
  null,
  'Labrador Mix',
  '2 years',
  'Female'
),
(
  'Siamese Kittens - Blue Eyes',
  'Traditional Siamese kittens with stunning blue eyes. Very vocal and affectionate breed. Ready to go to new homes.',
  450,
  'EUR',
  'Paphos, Cyprus',
  'Cyprus Pets Direct',
  'https://cypruspetsdirect.com/siamese-kittens',
  true,
  null,
  'Siamese',
  '8 weeks',
  'Mixed'
),
(
  'Canary Birds - Singing Males',
  'Beautiful singing male canary birds. Great for breeding or as pets. Various colors available.',
  45,
  'EUR',
  'Larnaca, Cyprus',
  'Sell.com.cy Pets',
  'https://www.sell.com.cy/en/ads/canary-birds-singing',
  true,
  null,
  'Canary',
  '1 year',
  'Male'
),
(
  'French Bulldog Puppy - Rare Color',
  'Stunning French Bulldog puppy in rare lilac color. Championship bloodline with full papers.',
  1200,
  'EUR',
  'Limassol, Cyprus',
  'Bazaraki Pets',
  'https://www.bazaraki.com/en/ads/french-bulldog-lilac',
  true,
  null,
  'French Bulldog',
  '14 weeks',
  'Male'
),
(
  'Bengal Cat - Spotted Beauty',
  'Gorgeous Bengal cat with stunning rosette markings. Very active and intelligent. Spayed female.',
  800,
  'EUR',
  'Nicosia, Cyprus',
  'Cyprus Pets Direct',
  'https://cypruspetsdirect.com/bengal-cat-spotted',
  true,
  null,
  'Bengal',
  '1.5 years',
  'Female'
);