-- Add rating fields to products table
ALTER TABLE products ADD COLUMN rating numeric(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5);
ALTER TABLE products ADD COLUMN review_count integer DEFAULT 0 CHECK (review_count >= 0);

-- Update existing products with sample ratings
UPDATE products SET rating = 4.8, review_count = 211 WHERE name = 'Premium Wireless Headphones';
UPDATE products SET rating = 4.5, review_count = 189 WHERE name = 'Modern Laptop Pro';
UPDATE products SET rating = 4.9, review_count = 356 WHERE name = 'Smartphone X';
UPDATE products SET rating = 4.7, review_count = 142 WHERE name = 'Smart Fitness Watch';
UPDATE products SET rating = 4.9, review_count = 310 WHERE name = 'Wireless Earbuds Pro';
UPDATE products SET rating = 4.6, review_count = 98 WHERE name = 'Portable Bluetooth Speaker';
UPDATE products SET rating = 4.8, review_count = 76 WHERE name = 'Professional DSLR Camera';
UPDATE products SET rating = 4.7, review_count = 234 WHERE name = 'RGB Gaming Mouse';
UPDATE products SET rating = 4.8, review_count = 198 WHERE name = 'Mechanical Gaming Keyboard';
UPDATE products SET rating = 4.5, review_count = 412 WHERE name = 'USB-C Fast Charging Cable';
UPDATE products SET rating = 4.6, review_count = 287 WHERE name = 'Protective Phone Case';
UPDATE products SET rating = 4.7, review_count = 156 WHERE name = 'Professional Laptop Backpack';