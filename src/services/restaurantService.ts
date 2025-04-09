
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
  manager?: string | null;
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

// Update a restaurant in the database
export async function updateRestaurant(
  id: string,
  name: string,
  phone: string,
  address: string,
  manager?: string | null,
  logo_url?: string | null
): Promise<RestaurantResponse> {
  const { data, error } = await supabase.rpc('force_update_company_with_manager', {
    p_company_id: id,
    p_name: name,
    p_phone: phone,
    p_address: address,
    p_manager: manager,
    p_logo_url: logo_url
  });

  if (error) {
    throw error;
  }

  return data as unknown as RestaurantResponse;
}

// Delete a restaurant from the database
export async function deleteRestaurant(id: string): Promise<void> {
  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}
