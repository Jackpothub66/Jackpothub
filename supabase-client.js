// supabase-client.js

// Supabase क्लाइंट को इम्पोर्ट करें (इसे हम HTML में CDN से लोड करेंगे)
const { createClient } = supabase;

// अपनी Supabase जानकारी यहाँ डालें
// अपने Supabase प्रोजेक्ट के Settings -> API से इन्हें कॉपी करें
const SUPABASE_URL = 'https://dxvsjlbhnnfbwxapouyt.supabase.co'; // इसे अपनी Supabase URL से बदलें
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4dnNqbGJobm5mYnd4YXBvdXl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4NDE5ODIsImV4cCI6MjA3NjQxNzk4Mn0.Su5c-keZ51aMUxiX2ISe_Yda2Owzq0Dt_q7VRh4cQzQ'; // इसे अपनी anon public key से बदलें

// Supabase क्लाइंट बनाएँ
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// इसे अन्य फ़ाइलों में उपयोग के लिए वैश्विक रूप से (globally) उपलब्ध कराएँ
window.supabase = supabaseClient;