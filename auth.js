// =================================================================
//                 MINES JACKPOT - AUTHENTICATION SCRIPT (SUPABASE)
// =================================================================

// Supabase client को window ऑब्जेक्ट से एक्सेस करें (यह supabase-client.js से आता है)
const auth = window.supabase.auth;

// --- PAGE AND AUTH LOGIC ---
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const protectedPages = ['dashboard.html', 'games.html', 'payments.html', 'profile.html', 'bonuses.html', 'security.html', 'bonus-details.html'];
const publicOnlyPages = ['login.html', 'signup.html'];

// --- DYNAMIC NAVIGATION (UI कोड में कोई बदलाव नहीं) ---
const navLoggedOutHTML = `
    <!-- Desktop Menu -->
    <div class="hidden md:flex items-center space-x-2">
        <a href="index.html" class="nav-item text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-lg transition-colors ${currentPage === 'index.html' ? 'text-blue-600 bg-blue-50' : ''}"><i class="fas fa-home mr-2"></i>Home</a>
        <a href="bonuses.html" class="nav-item text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-lg transition-colors ${currentPage === 'bonuses.html' ? 'text-blue-600 bg-blue-50' : ''}"><i class="fas fa-gift mr-2"></i>Bonuses</a>
        <a href="security.html" class="nav-item text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-lg transition-colors ${currentPage === 'security.html' ? 'text-blue-600 bg-blue-50' : ''}"><i class="fas fa-shield-alt mr-2"></i>Security</a>
        <a href="login.html" class="text-gray-600 hover:text-blue-600 font-semibold px-3 py-2 ${currentPage === 'login.html' ? 'text-blue-600' : ''}"><i class="fas fa-sign-in-alt mr-2"></i>Login</a>
        <a href="signup.html" class="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold transition-transform transform hover:scale-105 shadow-md hover:shadow-lg">Get Started</a>
    </div>
    <!-- Mobile "Get Started" Button -->
    <div class="md:hidden">
        <a href="signup.html" class="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">Get Started</a>
    </div>
`;

const navLoggedInHTML = (userName) => `
    <!-- Desktop Menu -->
    <div class="hidden md:flex items-center space-x-2">
        <a href="dashboard.html" class="nav-item text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-lg transition-colors ${currentPage === 'dashboard.html' ? 'text-blue-600 bg-blue-50' : ''}"><i class="fas fa-tachometer-alt mr-2"></i>Dashboard</a>
        <a href="games.html" class="nav-item text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-lg transition-colors ${currentPage === 'games.html' ? 'text-blue-600 bg-blue-50' : ''}"><i class="fas fa-gamepad mr-2"></i>Games</a>
        <a href="payments.html" class="nav-item text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-lg transition-colors ${currentPage === 'payments.html' ? 'text-blue-600 bg-blue-50' : ''}"><i class="fas fa-credit-card mr-2"></i>Payments</a>
        <a href="bonuses.html" class="nav-item text-gray-600 hover:text-blue-600 font-medium px-3 py-2 rounded-lg transition-colors ${currentPage === 'bonuses.html' ? 'text-blue-600 bg-blue-50' : ''}"><i class="fas fa-gift mr-2"></i>Bonuses</a>
        <a href="profile.html" class="bg-gray-100 text-blue-600 font-semibold px-4 py-2 rounded-full hover:bg-blue-100 transition-colors flex items-center ${currentPage === 'profile.html' ? 'bg-blue-100' : ''}"><i class="fas fa-user mr-2"></i><span>${userName}</span></a>
        <button id="logout-btn" class="bg-red-500 text-white w-10 h-10 rounded-full hover:bg-red-600 transition-transform transform hover:scale-105 flex items-center justify-center shadow-md hover:shadow-lg"><i class="fas fa-sign-out-alt"></i></button>
    </div>
    <!-- Mobile Profile Icon -->
    <div class="md:hidden">
         <a href="profile.html" class="bg-gray-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center shadow-md"><i class="fas fa-user"></i></a>
    </div>
`;

const mobileBottomNavHTML = `
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden shadow-lg">
        <div class="flex justify-around items-center py-2">
            <a href="dashboard.html" class="flex flex-col items-center p-2 text-gray-600 ${currentPage === 'dashboard.html' ? 'text-blue-600' : ''}"><i class="fas fa-tachometer-alt text-lg"></i><span class="text-xs mt-1">Dashboard</span></a>
            <a href="games.html" class="flex flex-col items-center p-2 text-gray-600 ${currentPage === 'games.html' ? 'text-blue-600' : ''}"><i class="fas fa-gamepad text-lg"></i><span class="text-xs mt-1">Games</span></a>
            <a href="payments.html" class="flex flex-col items-center p-2 text-gray-600 ${currentPage === 'payments.html' ? 'text-blue-600' : ''}"><i class="fas fa-credit-card text-lg"></i><span class="text-xs mt-1">Payments</span></a>
            <a href="bonuses.html" class="flex flex-col items-center p-2 text-gray-600 ${currentPage === 'bonuses.html' ? 'text-blue-600' : ''}"><i class="fas fa-gift text-lg"></i><span class="text-xs mt-1">Bonuses</span></a>
            <a href="profile.html" class="flex flex-col items-center p-2 text-gray-600 ${currentPage === 'profile.html' ? 'text-blue-600' : ''}"><i class="fas fa-user text-lg"></i><span class="text-xs mt-1">Profile</span></a>
        </div>
    </div>
`;

const mobileBottomNavLoggedOutHTML = `
    <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden shadow-lg">
        <div class="flex justify-around items-center py-2">
            <a href="index.html" class="flex flex-col items-center p-2 text-gray-600 ${currentPage === 'index.html' ? 'text-blue-600' : ''}"><i class="fas fa-home text-lg"></i><span class="text-xs mt-1">Home</span></a>
            <a href="bonuses.html" class="flex flex-col items-center p-2 text-gray-600 ${currentPage === 'bonuses.html' ? 'text-blue-600' : ''}"><i class="fas fa-gift text-lg"></i><span class="text-xs mt-1">Bonuses</span></a>
            <a href="security.html" class="flex flex-col items-center p-2 text-gray-600 ${currentPage === 'security.html' ? 'text-blue-600' : ''}"><i class="fas fa-shield-alt text-lg"></i><span class="text-xs mt-1">Security</span></a>
            <a href="login.html" class="flex flex-col items-center p-2 text-gray-600 ${currentPage === 'login.html' ? 'text-blue-600' : ''}"><i class="fas fa-sign-in-alt text-lg"></i><span class="text-xs mt-1">Login</span></a>
        </div>
    </div>
`;


// --- [CHANGED] AUTHENTICATION STATE CHANGE LISTENER ---
auth.onAuthStateChange((event, session) => {
    const user = session?.user;
    updateUI(user);
    updateMobileNavUI(user);
});

// --- [NEW] UI UPDATE FUNCTIONS ---
function updateUI(user) {
    const topNavContainer = document.getElementById('nav-container');
    const bottomNavContainer = document.getElementById('bottom-nav-container');

    if (user) {
        if (publicOnlyPages.includes(currentPage)) { window.location.replace('dashboard.html'); return; }
        const displayName = user.user_metadata?.full_name || user.email.split('@')[0];
        if (topNavContainer) { topNavContainer.innerHTML = navLoggedInHTML(displayName); attachLogoutListener(); }
        if (bottomNavContainer) { bottomNavContainer.innerHTML = mobileBottomNavHTML; }
    } else {
        if (protectedPages.includes(currentPage)) { window.location.replace('login.html'); return; }
        if (topNavContainer) { topNavContainer.innerHTML = navLoggedOutHTML; }
        if (bottomNavContainer) { bottomNavContainer.innerHTML = mobileBottomNavLoggedOutHTML; }
    }
}

function updateMobileNavUI(user) {
    const mobileNavContainer = document.getElementById('mobile-nav-container');
    if (!mobileNavContainer) return;

    if (user) {
        mobileNavContainer.innerHTML = `
            <a href="dashboard.html" class="flex items-center px-4 py-3 text-gray-700 rounded-lg mb-2 ${currentPage === 'dashboard.html' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}"><i class="fas fa-tachometer-alt mr-3"></i>Dashboard</a>
            <a href="games.html" class="flex items-center px-4 py-3 text-gray-700 rounded-lg mb-2 ${currentPage === 'games.html' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}"><i class="fas fa-gamepad mr-3"></i>Games</a>
            <a href="payments.html" class="flex items-center px-4 py-3 text-gray-700 rounded-lg mb-2 ${currentPage === 'payments.html' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}"><i class="fas fa-credit-card mr-3"></i>Payments</a>
            <a href="bonuses.html" class="flex items-center px-4 py-3 text-gray-700 rounded-lg mb-2 ${currentPage === 'bonuses.html' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}"><i class="fas fa-gift mr-3"></i>Bonuses</a>
            <a href="profile.html" class="flex items-center px-4 py-3 text-gray-700 rounded-lg mb-2 ${currentPage === 'profile.html' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}"><i class="fas fa-user mr-3"></i>Profile</a>
            <a href="security.html" class="flex items-center px-4 py-3 text-gray-700 rounded-lg mb-2 ${currentPage === 'security.html' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}"><i class="fas fa-shield-alt mr-3"></i>Security</a>
            <button id="mobile-logout-btn" class="w-full flex items-center px-4 py-3 text-red-600 rounded-lg mb-2 hover:bg-red-50 text-left"><i class="fas fa-sign-out-alt mr-3"></i>Logout</button>
        `;
        const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
        if (mobileLogoutBtn) {
            mobileLogoutBtn.addEventListener('click', async () => {
                await auth.signOut();
                window.location.href = 'index.html';
            });
        }
    } else {
        mobileNavContainer.innerHTML = `
            <a href="index.html" class="flex items-center px-4 py-3 text-gray-700 rounded-lg mb-2 ${currentPage === 'index.html' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}"><i class="fas fa-home mr-3"></i>Home</a>
            <a href="bonuses.html" class="flex items-center px-4 py-3 text-gray-700 rounded-lg mb-2 ${currentPage === 'bonuses.html' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}"><i class="fas fa-gift mr-3"></i>Bonuses</a>
            <a href="security.html" class="flex items-center px-4 py-3 text-gray-700 rounded-lg mb-2 ${currentPage === 'security.html' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}"><i class="fas fa-shield-alt mr-3"></i>Security</a>
            <a href="login.html" class="flex items-center px-4 py-3 text-gray-700 rounded-lg mb-2 ${currentPage === 'login.html' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}"><i class="fas fa-sign-in-alt mr-3"></i>Login</a>
            <a href="signup.html" class="flex items-center px-4 py-3 text-blue-600 rounded-lg mb-2 bg-blue-50 hover:bg-blue-100"><i class="fas fa-user-plus mr-3"></i>Sign Up</a>
        `;
    }
}


// --- [CHANGED] EVENT LISTENER ATTACHMENT FUNCTION ---
async function attachLogoutListener() {
    const handleLogout = async () => {
        const { error } = await auth.signOut();
        if (error) { console.error('Logout error:', error); showToast('Error during logout. Please try again.', 'error'); } 
        else { window.location.href = 'index.html'; }
    };
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
}

// --- TOAST NOTIFICATION FUNCTION (No changes) ---
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500';
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg text-white ${bgColor} transition-transform transform translate-x-full`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { toast.classList.remove('translate-x-full'); }, 100);
    setTimeout(() => {
        toast.classList.add('translate-x-full');
        setTimeout(() => { if (document.body.contains(toast)) { document.body.removeChild(toast); } }, 300);
    }, 3000);
}


// --- MOBILE NAVIGATION FUNCTIONALITY ---
document.addEventListener('DOMContentLoaded', function() {
    // Initial check to render UI based on current session
    auth.getSession().then(({ data: { session } }) => {
        updateUI(session?.user);
        updateMobileNavUI(session?.user);
    });
    
    // Setup mobile sidebar toggles
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileSidebar = document.getElementById('mobile-sidebar');
    const mobileSidebarClose = document.getElementById('mobile-sidebar-close');
    const mobileSidebarOverlay = document.getElementById('mobile-sidebar-overlay');
    
    if (mobileMenuButton && mobileSidebar) {
        mobileMenuButton.addEventListener('click', () => mobileSidebar.classList.remove('-translate-x-full'));
    }
    if (mobileSidebarClose) {
        mobileSidebarClose.addEventListener('click', () => mobileSidebar.classList.add('-translate-x-full'));
    }
    if (mobileSidebarOverlay) {
        mobileSidebarOverlay.addEventListener('click', () => mobileSidebar.classList.add('-translate-x-full'));
    }
    document.addEventListener('click', (e) => {
        if (e.target.closest('#mobile-nav-container a') && mobileSidebar) {
            mobileSidebar.classList.add('-translate-x-full');
        }
    });
});