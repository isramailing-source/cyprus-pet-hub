-- PHASE 1: CRITICAL DATABASE CLEANUP - Fix Foreign Key Issues
-- First delete affiliate clicks for fake networks
DELETE FROM affiliate_clicks 
WHERE network_id IN (
  SELECT id FROM affiliate_networks 
  WHERE name IN (
    'Bywiola Network',
    'Dorinebeaumont Network', 
    'Plrvq Network',
    'Uhtkc Network',
    'Xmknb Network',
    'Yyczo Network',
    'Chewy',
    'Petco', 
    'PetSmart'
  )
);

-- Delete affiliate products for fake networks
DELETE FROM affiliate_products 
WHERE network_id IN (
  SELECT id FROM affiliate_networks 
  WHERE name IN (
    'Bywiola Network',
    'Dorinebeaumont Network', 
    'Plrvq Network',
    'Uhtkc Network',
    'Xmknb Network',
    'Yyczo Network',
    'Chewy',
    'Petco', 
    'PetSmart'
  )
);

-- Now delete the fake affiliate networks
DELETE FROM affiliate_networks 
WHERE name IN (
  'Bywiola Network',
  'Dorinebeaumont Network', 
  'Plrvq Network',
  'Uhtkc Network',
  'Xmknb Network',
  'Yyczo Network',
  'Chewy',
  'Petco', 
  'PetSmart'
);

-- Update remaining networks with correct names and affiliate IDs
UPDATE affiliate_networks 
SET 
  name = 'AliExpress',
  affiliate_id = 'Cyrus-pets'
WHERE name = 'Alibaba.com';

UPDATE affiliate_networks 
SET affiliate_id = 'cypruspets20-20' 
WHERE name = 'Amazon Associates';

UPDATE affiliate_networks 
SET affiliate_id = 'YYRTH55h9KSt9edQPnKzvyCayG90UHuN' 
WHERE name = 'Rakuten Advertising';

UPDATE affiliate_networks 
SET affiliate_id = 'Da3R4IYVMtYBoCcGb7UmxnZDP289bo' 
WHERE name = 'Admitad';