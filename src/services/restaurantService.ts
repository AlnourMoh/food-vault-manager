
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

// Define the restaurant data response interface
export interface RestaurantResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  logo_url?: string | null;
}

// Create a restaurant in the database
export async function createRestaurant(
  name: string,
  email: string,
  phone: string,
  address: string
): Promise<RestaurantResponse> {
  const { data, error } = await supabase.rpc('create_company_secure', {
    p_name: name,
    p_email: email,
    p_phone: phone,
    p_address: address,
  });

  if (error) {
    // Check specifically for duplicate email error
    if (error.code === '23505' && error.message.includes('companies_email_key')) {
      throw new Error('duplicate_email');
    }
    throw error;
  }

  return data as unknown as RestaurantResponse;
}
