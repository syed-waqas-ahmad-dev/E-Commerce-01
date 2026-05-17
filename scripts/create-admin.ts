const adminUsername = 'admin';
const adminPassword = 'Admin@2026!Secure#9X';

const supabaseUrl = 'https://smnuoteeyokrqaugoalh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtbnVvdGVleW9rcnFhdWdvYWxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NjQxNzYsImV4cCI6MjA5MzQ0MDE3Nn0.noyNLuktQxKTI84ol6lrUxNO_1JyCyIeyW8G3qucGiI';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtbnVvdGVleW9rcnFhdWdvYWxoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzg2NDE3NiwiZXhwIjoyMDkzNDQwMTc2fQ.BTcvOkpNOrb0yIGoukOYIknRHvJFNu2qqkHwo1XiCyA';

async function createAdminAccount() {
  try {
    console.log('Creating admin account...');
    
    const signUpResponse = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
      },
      body: JSON.stringify({
        email: `${adminUsername}@miaoda.com`,
        password: adminPassword,
      }),
    });

    const signUpData = await signUpResponse.json();

    if (!signUpResponse.ok || !signUpData.user) {
      console.error('Error creating admin account:', signUpData);
      return;
    }

    console.log('Admin user created, updating role...');

    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${signUpData.user.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        role: 'admin',
        username: adminUsername,
      }),
    });

    if (!updateResponse.ok) {
      console.error('Error updating admin role:', await updateResponse.text());
      return;
    }

    console.log('\n✅ Admin account created successfully!');
    console.log('==========================================');
    console.log('Username:', adminUsername);
    console.log('Password:', adminPassword);
    console.log('==========================================\n');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createAdminAccount();
