-- Clean up external source names to remove references to competitor sites
UPDATE ads 
SET source_name = CASE 
  WHEN source_name ILIKE '%bazaraki%' THEN 'Cyprus Pet Listings'
  WHEN source_name ILIKE '%facebook%' THEN 'Local Pet Network'
  WHEN source_name ILIKE '%sell.com.cy%' THEN 'Cyprus Pet Market'
  ELSE source_name
END
WHERE source_name ILIKE '%bazaraki%' OR source_name ILIKE '%facebook%' OR source_name ILIKE '%sell.com.cy%';