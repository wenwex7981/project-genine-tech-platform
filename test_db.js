const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
let supabaseUrl = '';
let supabaseAnonKey = '';

envFile.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1].trim();
  }
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
    supabaseAnonKey = line.split('=')[1].trim();
  }
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  console.log("Connecting to Supabase at", supabaseUrl);
  
  const { data, error } = await supabase
    .from('custom_requirements')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error("❌ DATABASE ERROR:", error.message);
    if (error.details) console.error("Details:", error.details);
    if (error.hint) console.error("Hint:", error.hint);
  } else {
    console.log("✅ DATABASE CONNECTION SUCCESSFUL!");
    console.log(`Found ${data.length} recent requests in the database.`);
    if (data.length > 0) {
      console.log("Latest entry:");
      console.log(JSON.stringify(data[0], null, 2));
    }
  }
}

checkDatabase();
