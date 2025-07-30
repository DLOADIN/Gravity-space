-- First, create a temporary column to store the new JSONB data
ALTER TABLE transactions ADD COLUMN shipping_address_new JSONB;

-- Update the temporary column with properly formatted JSONB data
UPDATE transactions 
SET shipping_address_new = jsonb_build_object(
  'fullName', COALESCE(shipping_address, ''),
  'streetAddress', '',
  'city', '',
  'state', '',
  'zipCode', '',
  'country', ''
);

-- Drop the old column and rename the new one
ALTER TABLE transactions DROP COLUMN shipping_address;
ALTER TABLE transactions RENAME COLUMN shipping_address_new TO shipping_address;

-- Make the column NOT NULL
ALTER TABLE transactions ALTER COLUMN shipping_address SET NOT NULL; 