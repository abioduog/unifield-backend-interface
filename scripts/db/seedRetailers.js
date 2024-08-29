import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your .env.local file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const sampleRetailers = [
  {
    store_name: "SuperMart Plus",
    address: "Lagos, Nigeria",
    credit_score: 800,
    credit_limit: 50000,
    annual_revenue: 5000000.00
  },
  {
    store_name: "QuickStop Convenience",
    address: "Abuja, Nigeria",
    credit_score: 750,
    credit_limit: 30000,
    annual_revenue: 1000000.00
  },
  {
    store_name: "Pharma Plus",
    address: "Port Harcourt, Nigeria",
    credit_score: 780,
    credit_limit: 40000,
    annual_revenue: 2000000.00
  }
];

async function addSampleData() {
  try {
    // Check if data already exists
    const { data: existingData, error: existingError } = await supabase
      .from('retailers')
      .select('store_name')
      .in('store_name', sampleRetailers.map(r => r.store_name));

    if (existingError) {
      console.error('Error checking existing data:', existingError);
      return;
    }

    if (existingData.length > 0) {
      console.log('Some sample data already exists. Skipping insertion.');
      return;
    }

    // Proceed with insertion if no existing data found
    const { data, error } = await supabase
      .from('retailers')
      .insert(sampleRetailers);

    if (error) {
      console.error('Error inserting data:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
    } else if (data === null) {
      console.log('Sample data inserted successfully, but no data was returned. This is normal for some Supabase configurations.');
    } else {
      console.log('Sample data inserted successfully:', data);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

addSampleData();