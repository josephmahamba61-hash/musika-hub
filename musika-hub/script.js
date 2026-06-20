// ========================================
// MUSIKA HUB - LocalStorage Recommendation Engine
// ========================================

const STORAGE_KEYS = {
  products: 'musika-hub-products',
  events: 'musika-hub-events',
  cart: 'musika-hub-cart',
  subscribers: 'musika-hub-subscribers',
  theme: 'tema-hub-theme',
  user: 'musika-hub-user'
};

const EVENT_WEIGHTS = {
  search: 1,
  view: 2,
  add: 3
};

const TREND_MODES = [
  { key: 'all', label: 'All' },
  { key: 'most-viewed', label: 'Most Viewed' },
  { key: 'recently-added', label: 'Recently Added' },
  { key: 'top-categories', label: 'Top Categories' }
];

let activeTrendMode = 'all';
let activeTrendCategory = 'all';

function initializeTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.querySelector('.theme-icon');
  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDarkTheme = savedTheme ? savedTheme === 'dark' : prefersDark;

  if (!isDarkTheme) {
    document.body.classList.add('light-theme');
  }

  if (themeIcon) {
    themeIcon.textContent = isDarkTheme ? '🌙' : '☀️';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

function toggleTheme() {
  const themeIcon = document.querySelector('.theme-icon');
  const isLight = document.body.classList.contains('light-theme');

  if (isLight) {
    document.body.classList.remove('light-theme');
    localStorage.setItem(STORAGE_KEYS.theme, 'dark');
    if (themeIcon) themeIcon.textContent = '🌙';
  } else {
    document.body.classList.add('light-theme');
    localStorage.setItem(STORAGE_KEYS.theme, 'light');
    if (themeIcon) themeIcon.textContent = '☀️';
  }
}

function getStoredProducts() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.products) || '[]');
}

function saveStoredProducts(products) {
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
}

function getStoredEvents() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.events) || '[]');
}

function saveStoredEvents(events) {
  localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(events));
}

function getCartItems() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEYS.cart) || '[]');
}

function saveCartItems(items) {
  sessionStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(items));
}

function getSubscribers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.subscribers) || '[]');
}

function saveSubscribers(list) {
  localStorage.setItem(STORAGE_KEYS.subscribers, JSON.stringify(list));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.user) || 'null');
}

function saveCurrentUser(user) {
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
}

function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEYS.user);
}

function pushEvent(event) {
  const events = getStoredEvents();
  events.unshift(event);
  saveStoredEvents(events.slice(0, 150));
}

function addProductEvent(name, category, type) {
  if (!name || !category || !type) return;
  pushEvent({
    type,
    name,
    category,
    timestamp: new Date().toISOString()
  });
}

function addSearchForTrends(query) {
  if (!query || !query.trim()) return;
  pushEvent({
    type: 'search',
    name: query.trim(),
    category: 'Search',
    timestamp: new Date().toISOString()
  });
}


function handleSearch() {
  const searchInput = document.getElementById('headerSearch');
  const query = searchInput?.value.trim();
  const defaultPlaceholder = searchInput?.getAttribute('placeholder') || 'Search products, categories or brands';

  if (!query) {
    alert('Please enter a search query');
    return;
  }

  addSearchForTrends(query);

  if (searchInput) {
    searchInput.value = '';
    searchInput.placeholder = 'Search saved ✓';
    setTimeout(() => {
      if (searchInput) searchInput.placeholder = defaultPlaceholder;
    }, 1200);
  }
}

function handleSubscribe() {
  const emailInput = document.getElementById('newsletterEmail');
  const email = emailInput?.value.trim();

  if (!email) {
    alert('Enter a valid email address to subscribe');
    return;
  }

  const subscribers = getSubscribers();
  if (!subscribers.includes(email.toLowerCase())) {
    subscribers.push(email.toLowerCase());
    saveSubscribers(subscribers);
  }

  alert('Subscribed successfully. We will share trend alerts with you.');
  if (emailInput) emailInput.value = '';
}

function addToCart(productName, category) {
  if (!productName) return;
  const cart = getCartItems();
  cart.push({
    name: productName,
    category,
    added: new Date().toISOString()
  });
  saveCartItems(cart);
  addProductEvent(productName, category, 'add');
  alert(`${productName} was added to your cart.`);
}

function viewProduct(name, category) {
  if (!name) return;
  addProductEvent(name, category || 'Uncategorized', 'view');
}

function handleAddProduct(event) {
  event.preventDefault();

  const nameInput = document.getElementById('productName');
  const categorySelect = document.getElementById('productCategory');
  const name = nameInput?.value.trim();
  const category = categorySelect?.value || 'General';

  if (!name) {
    alert('Please enter a product name.');
    return false;
  }

  const products = getStoredProducts();
  const duplicate = products.some(item => item.name.toLowerCase() === name.toLowerCase());
  if (duplicate) {
    alert('This product already exists. Try another name.');
    return false;
  }

  products.unshift({
    id: Date.now().toString(),
    name,
    category,
    added: new Date().toISOString()
  });

  saveStoredProducts(products);
  addProductEvent(name, category, 'add');
  renderHomeProducts();

  if (nameInput) nameInput.value = '';
  if (categorySelect) categorySelect.selectedIndex = 0;

  return false;
}

function getRecencyWeight(timestamp) {
  if (!timestamp) return 1;
  const ageDays = (Date.now() - new Date(timestamp).getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(0.6, 1 + (30 - ageDays) / 60);
}

function getTrendingProducts(category = 'all', mode = 'all') {
  const products = getStoredProducts();
  const events = getStoredEvents();

  if (!products.length || !events.length) {
    return [];
  }

  const normalizedCategory = category.toLowerCase();
  const productScores = products.map(product => {
    let score = 1;
    const normalizedName = product.name.toLowerCase();
    const normalizedCategoryName = product.category.toLowerCase();

    events.forEach(event => {
      const eventType = event.type.toLowerCase();
      const weight = EVENT_WEIGHTS[eventType] || 1;
      const recency = getRecencyWeight(event.timestamp);
      const searchText = (event.name || '').toLowerCase();

      if (eventType === 'search' && (normalizedName.includes(searchText) || normalizedCategoryName.includes(searchText))) {
        score += weight * 1.1 * recency;
      }

      if (event.name && normalizedName === event.name.toLowerCase()) {
        score += weight * 1.4 * recency;
      }

      if (event.category && normalizedCategoryName === event.category.toLowerCase()) {
        score += weight * 0.75 * recency;
      }
    });

    return {
      product,
      score,
      addedTime: new Date(product.added).getTime()
    };
  });

  let filtered = productScores;

  if (normalizedCategory !== 'all') {
    filtered = filtered.filter(item => item.product.category.toLowerCase() === normalizedCategory);
  }

  const topCounts = {};
  getStoredEvents().forEach(event => {
    if (!event.category) return;
    const key = event.category.toLowerCase();
    topCounts[key] = (topCounts[key] || 0) + (EVENT_WEIGHTS[event.type] || 1);
  });

  if (mode === 'recently-added') {
    filtered.sort((a, b) => b.addedTime - a.addedTime);
  } else if (mode === 'most-viewed') {
    filtered.sort((a, b) => b.score - a.score);
  } else if (mode === 'top-categories') {
    filtered.sort((a, b) => {
      const first = topCounts[a.product.category.toLowerCase()] || 0;
      const second = topCounts[b.product.category.toLowerCase()] || 0;
      return second - first || b.score - a.score;
    });
  } else {
    filtered.sort((a, b) => b.score - a.score);
  }

  return filtered.slice(0, 12).map(item => item.product);
}

function getUniqueProductCategories() {
  const products = getStoredProducts();
  const categories = [...new Set(products.map(product => product.category))];
  return categories.sort((a, b) => a.localeCompare(b));
}

function getTopCategories() {
  const products = getStoredProducts();
  const events = getStoredEvents();
  const categories = {};

  products.forEach(product => {
    const key = product.category || 'Uncategorized';
    categories[key] = categories[key] || { category: key, productCount: 0, score: 0 };
    categories[key].productCount += 1;
  });

  events.forEach(event => {
    if (!event.category || event.category === 'Search') return;
    const key = event.category;
    categories[key] = categories[key] || { category: key, productCount: 0, score: 0 };
    categories[key].score += (EVENT_WEIGHTS[event.type] || 1) * getRecencyWeight(event.timestamp);
  });

  return Object.values(categories).sort((a, b) => b.score - a.score);
}

function formatPrice(value) {
  return `ZWL ${value.toLocaleString()}`;
}

function buildProductCard(product, index = 0) {
  const imageClass = `product-img-${(index % 6) + 1}`;
  const description = `Reliable ${product.category.toLowerCase()} solution for your industrial operations.`;
  return `
    <div class="product-card">
      <div class="product-image ${imageClass}" onclick="viewProduct(${JSON.stringify(product.name)}, ${JSON.stringify(product.category)})"></div>
      <div class="product-content">
        <h4 class="product-title" onclick="viewProduct(${JSON.stringify(product.name)}, ${JSON.stringify(product.category)})">${product.name}</h4>
        <p class="product-specs">${product.category}</p>
        <p class="product-desc">${description}</p>
        <div class="product-price">${formatPrice(950 + (index + 1) * 150)}</div>
        <div class="product-actions">
          <button class="btn-primary" type="button" onclick="addToCart(${JSON.stringify(product.name)}, ${JSON.stringify(product.category)})">Add to Cart</button>
          <button class="btn-secondary" type="button" onclick="viewProduct(${JSON.stringify(product.name)}, ${JSON.stringify(product.category)})">View</button>
        </div>
      </div>
    </div>
  `;
}

function renderHomeProducts() {
  const products = getStoredProducts();
  const productArea = document.getElementById('productArea');
  const emptyState = document.getElementById('emptyProducts');

  if (!productArea || !emptyState) return;

  if (!products.length) {
    productArea.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  productArea.innerHTML = products.map(buildProductCard).join('');
}

function renderTrendControls() {
  const modeContainer = document.getElementById('trendModes');
  const categoryContainer = document.getElementById('trendCategories');

  if (!modeContainer || !categoryContainer) return;

  modeContainer.innerHTML = TREND_MODES.map(mode => `
    <button class="mode-button ${mode.key === activeTrendMode ? 'active' : ''}" onclick="setTrendMode('${mode.key}')">${mode.label}</button>
  `).join('');

  const categories = getUniqueProductCategories();
  categoryContainer.innerHTML = ['All', ...categories].map(category => `
    <button class="category-button ${category.toLowerCase() === activeTrendCategory ? 'active' : ''}" onclick="setTrendCategory('${category.toLowerCase()}')">${category}</button>
  `).join('');
}

function setTrendMode(modeKey) {
  activeTrendMode = modeKey;
  renderTrendControls();
  renderTrendProducts();
  renderTrendCategorySummary();
}

function setTrendCategory(categoryKey) {
  activeTrendCategory = categoryKey;
  renderTrendControls();
  renderTrendProducts();
  renderTrendCategorySummary();
}

function renderTrendProducts() {
  const productArea = document.getElementById('trendProducts');
  const emptyState = document.getElementById('emptyTrends');

  if (!productArea || !emptyState) return;

  const category = activeTrendCategory === 'all' ? 'all' : activeTrendCategory;
  const products = getTrendingProducts(category, activeTrendMode);

  if (!products.length) {
    productArea.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  productArea.innerHTML = products.map(buildProductCard).join('');
}

function renderTrendCategorySummary() {
  const summaryArea = document.getElementById('trendCategorySummary');
  const emptyState = document.getElementById('emptyTrends');
  if (!summaryArea) return;

  const categories = getTopCategories();
  if (!categories.length) {
    summaryArea.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  summaryArea.innerHTML = categories.slice(0, 6).map(item => `
    <div class="category-card">
      <div class="category-icon">📦</div>
      <h5>${item.category}</h5>
      <p>${item.productCount} products</p>
      <p>${Math.round(item.score)} trend score</p>
    </div>
  `).join('');
}

function applyTrendUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('category');
  const mode = params.get('mode');

  if (category) {
    activeTrendCategory = category.toLowerCase();
  }

  if (mode && TREND_MODES.some(item => item.key === mode)) {
    activeTrendMode = mode;
  }
}

function renderTrendsPage() {
  renderTrendControls();
  renderTrendProducts();
  renderTrendCategorySummary();
}

function renderJobsPage() {
  const jobArea = document.getElementById('jobListings');
  const recommendationArea = document.getElementById('jobRecommendations');
  const emptyArea = document.getElementById('emptyJobs');
  const topCategories = getTopCategories();

  if (!jobArea || !recommendationArea || !emptyArea) return;

  const jobs = [
    { title: 'Procurement Specialist', location: 'Harare', company: 'Zim Industrial', tags: 'Tender, Sourcing' },
    { title: 'Sourcing Analyst', location: 'Bulawayo', company: 'Bulk Materials', tags: 'Supplier onboarding' },
    { title: 'Supply Chain Coordinator', location: 'Mutare', company: 'AgriTech', tags: 'Logistics' },
    { title: 'Category Manager', location: 'Harare', company: 'Industrial Hub', tags: 'Contract, Vendor' }
  ];

  jobArea.innerHTML = jobs.map(job => `
    <div class="job-card">
      <div>
        <h4>${job.title}</h4>
        <p>${job.company} • ${job.location}</p>
      </div>
      <div>
        <span class="job-tag">${job.tags}</span>
        <button class="btn-secondary" type="button" onclick="window.location.href='procurement.html'">View Project</button>
      </div>
    </div>
  `).join('');

  if (!topCategories.length) {
    recommendationArea.innerHTML = '';
    emptyArea.style.display = 'block';
    return;
  }

  emptyArea.style.display = 'none';
  recommendationArea.innerHTML = topCategories.slice(0, 5).map(item => `
    <div class="category-card">
      <div class="category-icon">💼</div>
      <h5>${item.category}</h5>
      <p>${Math.round(item.score)} activity signal</p>
    </div>
  `).join('');
}

function renderSupplierDashboard() {
  const dashboardArea = document.getElementById('supplierDashboard');
  if (!dashboardArea) return;

  const user = getCurrentUser();
  if (!user || user.role.toLowerCase() !== 'supplier') {
    dashboardArea.innerHTML = `
      <div class="empty-state">
        <p>Sign in as a supplier to access your dashboard.</p>
        <button class="btn-primary" type="button" onclick="window.location.href='signin.html'">Sign In</button>
      </div>
    `;
    return;
  }

  const products = getStoredProducts();
  const supplierProducts = products.filter(product => product.category);
  const topCategories = getTopCategories();

  dashboardArea.innerHTML = `
    <div class="dashboard-summary-grid">
      <div class="dashboard-card">
        <span class="dashboard-label">Supplier</span>
        <strong>${user.name}</strong>
      </div>
      <div class="dashboard-card">
        <span class="dashboard-label">Listed products</span>
        <strong>${supplierProducts.length}</strong>
      </div>
      <div class="dashboard-card">
        <span class="dashboard-label">Pending quotes</span>
        <strong>${Math.max(2, Math.ceil(supplierProducts.length / 2))}</strong>
      </div>
      <div class="dashboard-card">
        <span class="dashboard-label">Top categories</span>
        <strong>${topCategories.slice(0, 3).map(item => item.category).join(', ') || 'No activity yet'}</strong>
      </div>
    </div>
    <section class="section-block">
      <div class="section-header">
        <div>
          <h2>Latest supplier signals</h2>
          <p class="section-description">Activity derived from buyer requests, local searches and product demand.</p>
        </div>
      </div>
      <div class="categories-grid">
        ${topCategories.slice(0, 4).map(item => `
          <div class="category-card">
            <div class="category-icon">📦</div>
            <h5>${item.category}</h5>
            <p>${item.productCount} matched products</p>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function renderAdminDashboard() {
  const dashboardArea = document.getElementById('adminDashboard');
  if (!dashboardArea) return;

  const user = getCurrentUser();
  if (!user || user.role.toLowerCase() !== 'admin') {
    dashboardArea.innerHTML = `
      <div class="empty-state">
        <p>Sign in as an administrator to access the management dashboard.</p>
        <button class="btn-primary" type="button" onclick="window.location.href='signin.html'">Sign In</button>
      </div>
    `;
    return;
  }

  const requests = getStoredEvents().filter(event => event.type === 'search');
  const suppliers = getSubscribers();
  const topCategories = getTopCategories();

  dashboardArea.innerHTML = `
    <div class="dashboard-summary-grid">
      <div class="dashboard-card">
        <span class="dashboard-label">Administrator</span>
        <strong>${user.name}</strong>
      </div>
      <div class="dashboard-card">
        <span class="dashboard-label">Active requests</span>
        <strong>${requests.length}</strong>
      </div>
      <div class="dashboard-card">
        <span class="dashboard-label">Email subscribers</span>
        <strong>${suppliers.length}</strong>
      </div>
      <div class="dashboard-card">
        <span class="dashboard-label">Category alerts</span>
        <strong>${topCategories.length}</strong>
      </div>
    </div>
    <section class="section-block">
      <div class="section-header">
        <div>
          <h2>Recent approvals</h2>
          <p class="section-description">Review supplier requests and prepare a response for the platform.</p>
        </div>
      </div>
      <div class="tasks-grid">
        ${requests.slice(0, 5).map(request => `
          <div class="task-card">
            <h5>${request.name}</h5>
            <p>${request.category}</p>
            <span class="task-meta">${new Date(request.timestamp).toLocaleDateString()}</span>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}
  const cardArea = document.getElementById('categoryCards');
  const emptyArea = document.getElementById('emptyCategories');
  const summaryArea = document.getElementById('categorySummary');
  const summaryEmpty = document.getElementById('emptyCategorySummary');

  const categories = getUniqueProductCategories();
  const topCategories = getTopCategories();

  if (cardArea) {
    if (!categories.length) {
      cardArea.innerHTML = '';
      if (emptyArea) emptyArea.style.display = 'block';
    } else {
      if (emptyArea) emptyArea.style.display = 'none';
      cardArea.innerHTML = categories.map(category => `
        <a href="trends.html?category=${encodeURIComponent(category)}" class="category-card">
          <div class="category-icon">🔍</div>
          <h5>${category}</h5>
          <p>Browse ${category} listings</p>
        </a>
      `).join('');
    }
  }

  if (summaryArea) {
    if (!topCategories.length) {
      summaryArea.innerHTML = '';
      if (summaryEmpty) summaryEmpty.style.display = 'block';
    } else {
      if (summaryEmpty) summaryEmpty.style.display = 'none';
      summaryArea.innerHTML = topCategories.slice(0, 6).map(item => `
        <div class="category-card">
          <div class="category-icon">📈</div>
          <h5>${item.category}</h5>
          <p>${item.productCount} products</p>
          <p>${Math.round(item.score)} activity score</p>
        </div>
      `).join('');
    }
  }
}

function renderServicesPage() {
  const services = [
    {
      title: 'Engineering Consultancy',
      description: 'Expert guidance for industrial design, efficiency and compliance.',
      icon: '🔧'
    },
    {
      title: 'Equipment Installation',
      description: 'Professional installation and commissioning for large equipment.',
      icon: '🏭'
    },
    {
      title: 'Maintenance & Repairs',
      description: 'Preventative and corrective maintenance for plant equipment.',
      icon: '🔩'
    },
    {
      title: 'Fabrication Services',
      description: 'Custom metal fabrication coverage for complex assemblies.',
      icon: '⚙️'
    },
    {
      title: 'Training & Workshops',
      description: 'Hands-on technical training for teams and operators.',
      icon: '📚'
    },
    {
      title: 'Automation Solutions',
      description: 'Systems integration, PLC and controls consulting.',
      icon: '🤖'
    }
  ];

  const cardArea = document.getElementById('serviceCards');
  const emptyArea = document.getElementById('emptyServices');
  const highlightArea = document.getElementById('serviceCategoryHighlights');
  const highlightEmpty = document.getElementById('emptyServiceCategories');
  const topCategories = getTopCategories();

  if (cardArea) {
    cardArea.innerHTML = services.map(service => `
      <div class="service-card">
        <div class="service-icon">${service.icon}</div>
        <h4>${service.title}</h4>
        <p>${service.description}</p>
        <a class="btn-text" href="procurement.html">Request Quote</a>
      </div>
    `).join('');
    if (emptyArea) emptyArea.style.display = 'none';
  }

  if (highlightArea) {
    if (!topCategories.length) {
      highlightArea.innerHTML = '';
      if (highlightEmpty) highlightEmpty.style.display = 'block';
    } else {
      highlightArea.innerHTML = topCategories.slice(0, 6).map(item => `
        <div class="category-card">
          <div class="category-icon">⚙️</div>
          <h5>${item.category}</h5>
          <p>${item.productCount} products</p>
        </div>
      `).join('');
      if (highlightEmpty) highlightEmpty.style.display = 'none';
    }
  }
}

function handleProcurementRequest(event) {
  event.preventDefault();

  const title = document.getElementById('procurementTitle')?.value.trim();
  const description = document.getElementById('procurementDescription')?.value.trim();
  const category = document.getElementById('procurementCategory')?.value;

  if (!title || !description || !category) {
    alert('Please complete all procurement fields.');
    return false;
  }

  addProductEvent(title, category, 'search');
  alert('Procurement request submitted successfully. Suppliers will be notified.');
  return false;
}

function renderProcurementPage() {
  const categoryArea = document.getElementById('procurementCategories');
  const emptyArea = document.getElementById('emptyProcurement');
  const topCategories = getTopCategories();

  if (!categoryArea) return;

  if (!topCategories.length) {
    categoryArea.innerHTML = '';
    if (emptyArea) emptyArea.style.display = 'block';
    return;
  }

  categoryArea.innerHTML = topCategories.slice(0, 6).map(item => `
    <div class="category-card">
      <div class="category-icon">📦</div>
      <h5>${item.category}</h5>
      <p>${item.productCount} products</p>
      <p>${Math.round(item.score)} category score</p>
    </div>
  `).join('');
  if (emptyArea) emptyArea.style.display = 'none';
}

function renderCartPage() {
  const cartItems = getCartItems();
  const cartArea = document.getElementById('cartItems');
  const emptyArea = document.getElementById('emptyCart');
  const summaryArea = document.getElementById('cartSummary');

  if (!cartArea || !summaryArea) return;

  if (!cartItems.length) {
    cartArea.innerHTML = '';
    summaryArea.innerHTML = '';
    if (emptyArea) emptyArea.style.display = 'block';
    return;
  }

  if (emptyArea) emptyArea.style.display = 'none';
  cartArea.innerHTML = cartItems.map((item, index) => `
    <div class="product-card">
      <div class="product-image product-img-${(index % 6) + 1}"></div>
      <div class="product-content">
        <h4>${item.name}</h4>
        <p class="product-specs">${item.category}</p>
        <p class="product-desc">Added to cart on ${new Date(item.added).toLocaleDateString()}.</p>
      </div>
    </div>
  `).join('');

  summaryArea.innerHTML = `
    <div>
      <strong>${cartItems.length}</strong> item(s) in your cart.
    </div>
    <div style="margin-top: 12px; display: flex; gap: 12px; flex-wrap: wrap;">
      <button class="btn-primary" type="button" onclick="clearCart()">Clear Cart</button>
      <button class="btn-secondary" type="button" onclick="window.location.href='procurement.html'">Request Supplier Quotes</button>
    </div>
  `;
}

function clearCart() {
  saveCartItems([]);
  renderCartPage();
}

function updateAuthHeader() {
  const authButton = document.getElementById('authButton');
  const user = getCurrentUser();
  if (!authButton) return;
  if (user) {
    authButton.textContent = `👤 ${user.name} (${user.role})`;
    authButton.classList.add('signed-in');
    authButton.onclick = () => window.location.href = 'account.html';
  } else {
    authButton.textContent = 'Sign In';
    authButton.classList.remove('signed-in');
    authButton.onclick = () => window.location.href = 'signin.html';
  }
}

function highlightActiveBottomNav() {
  const page = document.body.dataset.page || 'home';
  const links = document.querySelectorAll('.bottom-nav .nav-item');
  links.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href') || '';
    if (page === 'home' && href.includes('index.html')) {
      link.classList.add('active');
    } else if (page !== 'home' && href.includes(`${page}.html`)) {
      link.classList.add('active');
    }
  });
}

function goToRoute(route) {
  const routeMap = {
    '#home': 'index.html',
    '#trends': 'trends.html',
    '#categories': 'categories.html',
    '#services': 'services.html',
    '#procurement': 'procurement.html',
    '#jobs': 'jobs.html',
    '#supplier': 'supplier.html',
    '#admin': 'admin.html',
    '#request-quotation': 'procurement.html',
    '#post-procurement': 'procurement.html',
    '#cart': 'cart.html'
  };

  const target = routeMap[route];
  if (!target) return;
  window.location.href = target;
}

function mayaOption(option) {
  const routes = {
    'find-products': 'index.html#products',
    'find-suppliers': 'categories.html',
    'request-quote': 'procurement.html',
    'track-order': 'cart.html',
    'procurement': 'procurement.html'
  };
  const destination = routes[option] || 'index.html';
  closeMaya();
  window.location.href = destination;
}

function toggleMaya() {
  const mayaPanel = document.getElementById('mayaPanel');
  if (!mayaPanel) return;
  mayaPanel.classList.toggle('active');
}

function closeMaya() {
  const mayaPanel = document.getElementById('mayaPanel');
  if (!mayaPanel) return;
  mayaPanel.classList.remove('active');
}

function initPage() {
  const page = document.body.dataset.page || 'home';

  switch (page) {
    case 'home':
      renderHomeProducts();
      break;
    case 'trends':
      applyTrendUrlParams();
      renderTrendControls();
      renderTrendProducts();
      renderTrendCategorySummary();
      break;
    case 'categories':
      renderCategoriesPage();
      break;
    case 'services':
      renderServicesPage();
      break;
    case 'procurement':
      renderProcurementPage();
      break;
    case 'cart':
      renderCartPage();
      break;
    case 'jobs':
      renderJobsPage();
      break;
    case 'supplier':
      renderSupplierDashboard();
      break;
    case 'admin':
      renderAdminDashboard();
      break;
    default:
      renderHomeProducts();
      break;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  initializeTheme();
  updateAuthHeader();
  highlightActiveBottomNav();
  initPage();
});

window.addEventListener('hashchange', () => {
  if (window.location.hash) {
    goToRoute(window.location.hash);
  }
});
