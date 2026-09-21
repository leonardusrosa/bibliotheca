try { process.loadEnvFile(); } catch {}
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

const adminClient = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const anonClient = createClient(supabaseUrl, anonKey);

async function main() {
  const cabritaUserId = '98758dcc-1b58-49de-ac2d-b6c1de247c6b';

  console.log('1. Ensuring user_profiles has cabrita on the real account...');
  const { error: pErr } = await adminClient
    .from('user_profiles')
    .update({ username: 'cabrita', display_name: 'cabrita' })
    .eq('user_id', cabritaUserId);
  if (pErr) throw pErr;
  console.log('✓ user_profiles verified for cabrita');

  console.log('2. Updating auth password to "cabrita"...');
  const { error: aErr } = await adminClient.auth.admin.updateUserById(cabritaUserId, {
    password: 'cabrita',
    user_metadata: { username: 'cabrita' }
  });
  if (aErr) throw aErr;
  console.log('✓ Password updated to "cabrita"');

  console.log('3. Testing username lookup...');
  const { data: prof, error: fErr } = await adminClient
    .from('user_profiles')
    .select('*')
    .eq('username', 'cabrita')
    .single();
  if (fErr || !prof) throw fErr || new Error('Not found');
  console.log(`✓ Lookup "cabrita" resolves to email: ${prof.email} (user_id: ${prof.user_id})`);

  console.log('4. Testing signInWithPassword with resolved email...');
  const { data: authData, error: authErr } = await anonClient.auth.signInWithPassword({
    email: prof.email,
    password: 'cabrita'
  });
  if (authErr) throw authErr;
  console.log('✓ Successfully authenticated! User ID:', authData.user.id);

  console.log('5. Verifying library items accessible for this user...');
  const { data: items, error: iErr } = await anonClient
    .from('bibliotheca_library_items')
    .select('id, reading_status')
    .eq('user_id', authData.user.id);
  if (iErr) throw iErr;
  console.log(`✓ Total LibraryItems verified under "cabrita": ${items.length}`);
}

main().catch(console.error);
