-- Create function to reduce product stock atomically
CREATE OR REPLACE FUNCTION reduce_product_stock(p_product_id uuid, p_quantity integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE products
  SET 
    stock_quantity = stock_quantity - p_quantity,
    updated_at = now()
  WHERE id = p_product_id
    AND stock_quantity >= p_quantity;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock or product not found';
  END IF;
END;
$$;