const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function run() {
  const envStr = fs.readFileSync('.env.local', 'utf8');
  const supabaseUrl = envStr.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1].trim();
  const supabaseKey = envStr.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1].trim();
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  // create user
  let userId = '';
  const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
    email: 'ngusitink@tacticianclimb.com',
    password: 'Password123!',
    email_confirm: true,
  });

  if (authErr && authErr.code !== 'email_exists' && !authErr.message.includes('already been registered')) {
    console.error('Auth error', authErr);
    return;
  }
  
  if (authUser && authUser.user) {
    userId = authUser.user.id;
  } else {
    const { data: usersData } = await supabase.auth.admin.listUsers();
    const existing = usersData.users.find(u => u.email === 'ngusitink@tacticianclimb.com');
    if (existing) userId = existing.id;
  }

  console.log('Using User ID:', userId);

  // get MOCK_USERS equivalent
  const mock = {
    profile: {
      username: 'ngusitink', display_name: 'Minh / ngusitink', 
      avatar_url: '/ngusitink-avatar.png',
      contact_links: { discord: 'ngusitink', facebook: 'https://fb.com/' }
    },
    page: { id: 'default', template_id: 'default', theme_config: {}, section_order: [], is_published: true },
    sections: [] // Just empty for now to test insert
  };

  const { error: pErr } = await supabase.from('booster_profiles').upsert({
    user_id: userId,
    username: mock.profile.username,
    display_name: mock.profile.display_name,
    avatar_url: mock.profile.avatar_url,
    contact_links: mock.profile.contact_links,
  });
  if (pErr) console.log('pErr', pErr);

  const { error: pageErr } = await supabase.from('booster_pages').upsert({
    id: `page_${userId}`,
    user_id: userId,
    template_id: mock.page.template_id,
    theme_config: { ...mock.page.theme_config, section_order: mock.page.section_order },
    is_published: mock.page.is_published,
    blocks: mock.sections,
  });
  if (pageErr) console.log('pageErr', pageErr);

  console.log('Done!');
}
run();
