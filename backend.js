// Real-Time Weather Dashboard Logic
// Fetches weather data using Open-Meteo REST APIs and updates the DOM dynamically.

document.addEventListener('DOMContentLoaded', () => {
  // 1. DOM Element Setup & Page Repurposing
  const todoContainer = document.getElementById('todo');
  if (!todoContainer) return;

  // Add padding top dynamically to clear fixed navigation header if not already present
  const computedStyle = window.getComputedStyle(todoContainer);
  const paddingTopVal = parseInt(computedStyle.paddingTop, 10);
  if (!paddingTopVal || paddingTopVal < 50) {
    todoContainer.style.paddingTop = '100px';
  }

  // Update Navigation link text from "To-Do List" to "Weather"
  const todoNavLinks = document.querySelectorAll('[data-page="todo"]');
  todoNavLinks.forEach(link => {
    if (link.classList.contains('nav-link')) {
      link.textContent = 'Weather';
    }
  });

  // Inject CSS styles into the document head
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    /* Weather Dashboard Base Layout */
    :root {
      --bg-surface: var(--navy2, #111827);
      --bg-surface-alt: rgba(240, 235, 225, 0.05);
      --border-subtle: rgba(240, 235, 225, 0.08);
      --border-focus: rgba(240, 235, 225, 0.25);
      --text-main: var(--cream, #F0EBE1);
      --text-muted: var(--slate, #8892A4);
      --color-brand: var(--amber, #F5A623);
      --color-brand-hover: #d98e1a;
      --color-error: #e05c5c;
    }

    .weather-dashboard-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1.8rem;
      margin-top: 0.5rem;
      animation: weatherFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes weatherFadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Search Component & Suggestion dropdown */
    .weather-search-container {
      position: relative;
      width: 100%;
      max-width: 650px;
      margin: 0 auto;
    }

    .weather-search-form {
      display: flex;
      gap: 0.75rem;
    }

    .weather-search-input-wrapper {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
    }

    .weather-search-input-wrapper .search-icon {
      position: absolute;
      left: 1.2rem;
      font-size: 1.1rem;
      color: var(--text-muted);
      pointer-events: none;
    }

    .weather-search-input-wrapper input {
      width: 100%;
      padding: 0.85rem 1rem 0.85rem 3rem;
      border-radius: 12px;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      font-size: 0.95rem;
      font-family: var(--font-body);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 4px 6px rgba(0,0,0,0.01);
    }

    .weather-search-input-wrapper input:focus {
      outline: none;
      border-color: var(--color-brand);
      box-shadow: 0 0 0 4px rgba(245, 166, 35, 0.12), 0 8px 16px rgba(0,0,0,0.04);
    }

    .weather-clear-btn {
      position: absolute;
      right: 1.2rem;
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 1rem;
      padding: 0.2rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .weather-clear-btn:hover {
      color: var(--text-main);
      background: var(--border-subtle);
    }

    .weather-search-submit-btn {
      border-radius: 12px;
      padding: 0 1.8rem;
      font-size: 0.9rem;
      font-weight: 600;
      height: 48px;
    }

    .weather-suggestions-dropdown {
      position: absolute;
      top: 110%;
      left: 0;
      right: 0;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.08);
      z-index: 200;
      max-height: 240px;
      overflow-y: auto;
    }

    .suggestion-item {
      padding: 0.8rem 1.2rem;
      cursor: pointer;
      border-bottom: 1px solid var(--border-subtle);
      transition: all 0.2s;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: left;
    }

    .suggestion-item:last-child {
      border-bottom: none;
    }

    .suggestion-item:hover, .suggestion-item.highlighted {
      background: var(--bg-surface-alt);
      padding-left: 1.4rem;
    }

    .suggestion-city {
      font-weight: 600;
      color: var(--text-main);
      font-size: 0.9rem;
    }

    .suggestion-details {
      font-size: 0.78rem;
      color: var(--text-muted);
    }

    /* Recent Searches */
    .recent-searches-container {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      max-width: 650px;
      margin: -1.2rem auto 0;
      flex-wrap: wrap;
    }

    .recent-label {
      font-size: 0.78rem;
      color: var(--text-muted);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .recent-searches-list {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .recent-chip {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      padding: 0.3rem 0.8rem;
      border-radius: 100px;
      font-size: 0.8rem;
      color: var(--text-main);
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 500;
    }

    .recent-chip:hover {
      border-color: var(--color-brand);
      background: var(--bg-surface-alt);
    }

    .recent-chip-delete {
      font-size: 0.85rem;
      color: var(--text-muted);
      cursor: pointer;
      display: inline-block;
      line-height: 1;
      width: 14px;
      height: 14px;
      text-align: center;
      transition: color 0.2s;
    }

    .recent-chip-delete:hover {
      color: var(--color-error);
    }

    /* Grid layout */
    .weather-content-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (min-width: 900px) {
      .weather-content-grid {
        grid-template-columns: 1.1fr 1fr;
      }
      .weather-forecast-panel {
        grid-column: span 2;
      }
    }

    /* Main Card styling */
    .weather-main-card {
      background: linear-gradient(135deg, rgba(245, 166, 35, 0.12) 0%, rgba(124, 152, 133, 0.08) 100%), var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 300px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.01);
      position: relative;
    }

    .weather-main-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .city-name {
      font-family: var(--font-display);
      font-size: clamp(1.8rem, 4vw, 2.5rem);
      font-weight: 700;
      line-height: 1.2;
      color: var(--text-main);
    }

    .country-name {
      font-size: 0.9rem;
      color: var(--text-muted);
      font-weight: 600;
      margin-top: 0.2rem;
    }

    .current-date-time {
      font-size: 0.8rem;
      color: var(--text-muted);
      background: var(--bg-surface-alt);
      padding: 0.35rem 0.75rem;
      border-radius: 8px;
      border: 1px solid var(--border-subtle);
      font-weight: 500;
      text-align: right;
    }

    .weather-main-body {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 1.5rem;
    }

    .large-temp {
      font-family: var(--font-display);
      font-size: clamp(3.5rem, 8vw, 5rem);
      font-weight: 900;
      line-height: 0.95;
      color: var(--text-main);
      letter-spacing: -0.02em;
    }

    .weather-hi-low {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 0.4rem;
      display: flex;
      gap: 0.6rem;
    }

    .weather-hi-low strong {
      color: var(--text-main);
    }

    .weather-condition-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .weather-visual-icon {
      font-size: clamp(4rem, 8vw, 5.5rem);
      line-height: 1;
      filter: drop-shadow(0 8px 15px rgba(245, 166, 35, 0.25));
      animation: floatIcon 6s ease-in-out infinite;
    }

    @keyframes floatIcon {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }

    .weather-description {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-main);
      margin-top: 0.4rem;
    }

    /* Details Panel styling */
    .weather-details-panel {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      padding: 1.8rem;
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.01);
    }

    .panel-subtitle {
      font-family: var(--font-display);
      font-size: 1.25rem;
      color: var(--text-main);
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: 0.6rem;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .metric-card {
      background: var(--bg-surface-alt);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      padding: 0.95rem;
      display: flex;
      position: relative;
      gap: 0.8rem;
      align-items: center;
      overflow: hidden;
    }

    .metric-icon {
      font-size: 1.6rem;
      line-height: 1;
      flex-shrink: 0;
    }

    .metric-info {
      display: flex;
      flex-direction: column;
    }

    .metric-lbl {
      font-size: 0.72rem;
      color: var(--text-muted);
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.05em;
    }

    .metric-val {
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-main);
      margin-top: 0.05rem;
    }

    .metric-progress-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: rgba(240, 235, 225, 0.1);
    }

    .metric-progress-fill {
      height: 100%;
      background: var(--color-brand);
      transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .wind-direction-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-left: auto;
      gap: 0.1rem;
    }

    .wind-direction-arrow {
      font-size: 1rem;
      font-weight: 900;
      color: var(--color-brand);
      display: inline-block;
      transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .wind-direction-text {
      font-size: 0.6rem;
      font-weight: 700;
      color: var(--text-muted);
    }

    /* Solar Arc Component */
    .solar-card {
      background: var(--bg-surface-alt);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      padding: 0.95rem;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .solar-title {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--text-muted);
      letter-spacing: 0.05em;
    }

    .solar-widget {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .solar-arc-container {
      position: relative;
      width: 100%;
      max-width: 220px;
      margin: 0 auto;
    }

    .solar-arc-svg {
      width: 100%;
      height: auto;
      display: block;
    }

    .solar-sun-node {
      position: absolute;
      font-size: 1.1rem;
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      transform: translate(-50%, -50%);
      top: 90%;
      left: 50%;
      transition: left 0.8s cubic-bezier(0.4, 0, 0.2, 1), top 0.8s cubic-bezier(0.4, 0, 0.2, 1);
      filter: drop-shadow(0 0 4px var(--color-brand));
      z-index: 10;
    }

    .solar-timings {
      display: flex;
      justify-content: space-between;
      margin-top: 0.1rem;
    }

    .solar-timings > div {
      display: flex;
      flex-direction: column;
    }

    .solar-label {
      font-size: 0.65rem;
      color: var(--text-muted);
    }

    .solar-time {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-main);
      margin-top: 0.05rem;
    }

    .solar-timings .sunset {
      text-align: right;
    }

    /* Forecast styling */
    .weather-forecast-panel {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      padding: 1.8rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.01);
    }

    .forecast-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .forecast-card {
      background: var(--bg-surface-alt);
      border: 1px solid var(--border-subtle);
      border-radius: 14px;
      padding: 1rem 0.8rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .forecast-card:hover {
      transform: translateY(-3px);
      border-color: var(--color-brand);
    }

    .forecast-day {
      font-weight: 700;
      font-size: 0.85rem;
      color: var(--text-main);
    }

    .forecast-date {
      font-size: 0.68rem;
      color: var(--text-muted);
      margin-top: -0.3rem;
    }

    .forecast-icon {
      font-size: 2.2rem;
      line-height: 1;
      margin: 0.1rem 0;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.03));
      transition: transform 0.3s;
    }

    .forecast-card:hover .forecast-icon {
      transform: scale(1.1) rotate(4deg);
    }

    .forecast-temp {
      display: flex;
      gap: 0.4rem;
      font-size: 0.8rem;
    }

    .forecast-temp-max {
      color: var(--text-main);
      font-weight: 700;
    }

    .forecast-temp-min {
      color: var(--text-muted);
    }

    .forecast-desc {
      font-size: 0.68rem;
      color: var(--text-muted);
      font-weight: 600;
    }

    /* Skeleton Loading Anim */
    .weather-skeleton {
      background: linear-gradient(90deg, var(--bg-surface-alt) 25%, var(--border-subtle) 50%, var(--bg-surface-alt) 75%);
      background-size: 200% 100%;
      animation: skeletonShimmer 1.5s infinite;
      border-radius: 14px;
    }

    @keyframes skeletonShimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .weather-loading-state {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    @media (min-width: 900px) {
      .weather-loading-state {
        grid-template-columns: 1.1fr 1fr;
      }
      .skeleton-forecast-panel {
        grid-column: span 2;
      }
    }

    .skeleton-main-card {
      height: 300px;
    }

    .skeleton-details-panel {
      height: 300px;
    }

    .skeleton-forecast-panel {
      height: 180px;
      border-radius: 20px;
    }

    /* Error UI styling */
    .weather-error-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 20px;
      padding: 3rem 1.5rem;
      text-align: center;
      max-width: 480px;
      margin: 2rem auto;
      box-shadow: 0 4px 20px rgba(0,0,0,0.01);
      animation: shakeError 0.5s ease-in-out;
    }

    @keyframes shakeError {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-6px); }
      40%, 80% { transform: translateX(6px); }
    }

    .error-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: 1rem;
      animation: pulseError 2s infinite;
    }

    @keyframes pulseError {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.8; }
    }

    .weather-error-card h3 {
      font-family: var(--font-display);
      font-size: 1.4rem;
      color: var(--text-main);
      margin-bottom: 0.5rem;
    }

    .weather-error-card p {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
  `;
  document.head.appendChild(styleEl);

  // Overwrite the #todo container HTML with the Weather Dashboard layout
  todoContainer.innerHTML = `
    <div class="container">
      <div class="weather-dashboard-wrapper">
        
        <!-- 1. Search Box & Suggestions -->
        <div class="weather-search-container">
          <form id="weather-search-form" class="weather-search-form" autocomplete="off" novalidate>
            <div class="weather-search-input-wrapper">
              <span class="search-icon">🔍</span>
              <input type="text" id="weather-city-input" placeholder="Search city (e.g. Paris, Tokyo, Berlin)..." required />
              <button type="button" id="weather-clear-search-btn" class="weather-clear-btn" style="display:none;" aria-label="Clear search input">✕</button>
            </div>
            <button type="submit" id="weather-search-submit-btn" class="btn btn-primary weather-search-submit-btn">Search</button>
          </form>
          <div id="weather-suggestions-dropdown" class="weather-suggestions-dropdown" style="display:none;"></div>
        </div>

        <!-- 2. Recent Searches -->
        <div id="weather-recent-searches-container" class="recent-searches-container" style="display:none;">
          <span class="recent-label">Recent:</span>
          <div id="weather-recent-searches-list" class="recent-searches-list"></div>
        </div>

        <!-- 3. Skeleton Loading State -->
        <div id="weather-loading-container" class="weather-loading-state" style="display:none;">
          <div class="skeleton-main-card weather-skeleton"></div>
          <div class="skeleton-details-panel weather-skeleton"></div>
          <div class="skeleton-forecast-panel weather-skeleton"></div>
        </div>

        <!-- 4. Error Fallback Card -->
        <div id="weather-error-card" class="weather-error-card" style="display:none;">
          <span class="error-icon" role="img" aria-label="Warning">⚠️</span>
          <h3 id="weather-error-title">Oops! Something went wrong</h3>
          <p id="weather-error-message">Could not retrieve weather data. Please try again.</p>
          <button id="weather-error-retry-btn" class="btn btn-outline">Try Again</button>
        </div>

        <!-- 5. Dynamic Weather Data Display Grid -->
        <div id="weather-content-wrapper" class="weather-content-grid" style="display:none;">
          
          <!-- Current Weather Card (Left Column) -->
          <div class="weather-main-card" role="region" aria-label="Current Weather Conditions">
            <div class="weather-main-header">
              <div>
                <h2 id="weather-city-name" class="city-name">--</h2>
                <p id="weather-country-name" class="country-name">--</p>
              </div>
              <p id="weather-date-time" class="current-date-time">--</p>
            </div>
            
            <div class="weather-main-body">
              <div class="weather-temp-container">
                <span id="weather-temp" class="large-temp">--</span>
                <div class="weather-hi-low">
                  <span>Max: <strong id="weather-temp-max">--</strong></span>
                  <span>Min: <strong id="weather-temp-min">--</strong></span>
                </div>
              </div>
              <div class="weather-condition-wrapper">
                <div id="weather-visual-icon" class="weather-visual-icon" aria-hidden="true">--</div>
                <span id="weather-description" class="weather-description">--</span>
              </div>
            </div>
          </div>

          <!-- Key Metrics & Sun timings (Right Column) -->
          <div class="weather-details-panel" role="region" aria-label="Detailed Weather Metrics">
            <h3 class="panel-subtitle">Weather Details</h3>
            
            <div class="metrics-grid">
              <!-- Feels Like -->
              <div class="metric-card">
                <div class="metric-icon" aria-hidden="true">🌡️</div>
                <div class="metric-info">
                  <span class="metric-lbl">Feels Like</span>
                  <span id="weather-feels-like" class="metric-val">--</span>
                </div>
              </div>
              
              <!-- Humidity -->
              <div class="metric-card">
                <div class="metric-icon" aria-hidden="true">💧</div>
                <div class="metric-info">
                  <span class="metric-lbl">Humidity</span>
                  <span id="weather-humidity" class="metric-val">--</span>
                </div>
                <div class="metric-progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                  <div id="weather-humidity-progress" class="metric-progress-fill" style="width: 0%"></div>
                </div>
              </div>
              
              <!-- Wind -->
              <div class="metric-card">
                <div class="metric-icon" aria-hidden="true">💨</div>
                <div class="metric-info">
                  <span class="metric-lbl">Wind Speed</span>
                  <span id="weather-wind-speed" class="metric-val">--</span>
                </div>
                <div class="wind-direction-wrap">
                  <span id="weather-wind-direction" class="wind-direction-arrow" aria-hidden="true">↑</span>
                  <span id="weather-wind-dir-text" class="wind-direction-text">--</span>
                </div>
              </div>
              
              <!-- Precipitation -->
              <div class="metric-card">
                <div class="metric-icon" aria-hidden="true">🌧️</div>
                <div class="metric-info">
                  <span class="metric-lbl">Precipitation</span>
                  <span id="weather-precipitation" class="metric-val">--</span>
                </div>
              </div>
            </div>

            <!-- Sun curve widget -->
            <div class="solar-card">
              <span class="solar-title">Day/Night Path</span>
              <div class="solar-widget">
                <div class="solar-arc-container">
                  <svg viewBox="0 0 100 50" class="solar-arc-svg" aria-hidden="true">
                    <path d="M 5,45 A 45,45 0 0,1 95,45" fill="none" stroke="rgba(240, 235, 225, 0.12)" stroke-width="2" stroke-dasharray="3,3" />
                    <path id="solar-arc-progress" d="M 5,45 A 45,45 0 0,1 95,45" fill="none" stroke="var(--color-brand)" stroke-width="2.5" stroke-dasharray="141.3" stroke-dashoffset="141.3" />
                  </svg>
                  <div id="solar-sun-node" class="solar-sun-node" aria-hidden="true">☀️</div>
                </div>
                <div class="solar-timings">
                  <div class="sunrise">
                    <span class="solar-label">Sunrise</span>
                    <span id="weather-sunrise" class="solar-time">--</span>
                  </div>
                  <div class="sunset">
                    <span class="solar-label">Sunset</span>
                    <span id="weather-sunset" class="solar-time">--</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Forecast Grid Panel -->
          <div class="weather-forecast-panel" role="region" aria-label="4-Day Future Forecast">
            <h3 class="panel-subtitle">4-Day Forecast</h3>
            <div id="weather-forecast-grid" class="forecast-grid"></div>
          </div>

        </div>

      </div>
    </div>
  `;

  // 2. Select Generated UI Elements
  const searchForm = document.getElementById('weather-search-form');
  const cityInput = document.getElementById('weather-city-input');
  const clearSearchBtn = document.getElementById('weather-clear-search-btn');
  const suggestionsDropdown = document.getElementById('weather-suggestions-dropdown');
  
  const recentSearchesContainer = document.getElementById('weather-recent-searches-container');
  const recentSearchesList = document.getElementById('weather-recent-searches-list');
  
  const loadingContainer = document.getElementById('weather-loading-container');
  const errorCard = document.getElementById('weather-error-card');
  const errorTitle = document.getElementById('weather-error-title');
  const errorMessage = document.getElementById('weather-error-message');
  const errorRetryBtn = document.getElementById('weather-error-retry-btn');
  
  const contentWrapper = document.getElementById('weather-content-wrapper');

  // Weather Metrics Elements
  const elCityName = document.getElementById('weather-city-name');
  const elCountryName = document.getElementById('weather-country-name');
  const elDateTime = document.getElementById('weather-date-time');
  const elTemp = document.getElementById('weather-temp');
  const elTempMax = document.getElementById('weather-temp-max');
  const elTempMin = document.getElementById('weather-temp-min');
  const elVisualIcon = document.getElementById('weather-visual-icon');
  const elDescription = document.getElementById('weather-description');
  
  const elFeelsLike = document.getElementById('weather-feels-like');
  const elHumidity = document.getElementById('weather-humidity');
  const elHumidityProgress = document.getElementById('weather-humidity-progress');
  const elWindSpeed = document.getElementById('weather-wind-speed');
  const elWindDirection = document.getElementById('weather-wind-direction');
  const elWindDirText = document.getElementById('weather-wind-dir-text');
  const elPrecipitation = document.getElementById('weather-precipitation');
  
  const elSunrise = document.getElementById('weather-sunrise');
  const elSunset = document.getElementById('weather-sunset');
  const elSolarArcFill = document.getElementById('solar-arc-progress');
  const elSunNode = document.getElementById('solar-sun-node');
  
  const elForecastGrid = document.getElementById('weather-forecast-grid');

  // 3. Application State
  let currentCity = null; // { name, country, lat, lon, timezone }
  let currentSuggestions = [];
  let suggestionFocusIndex = -1;
  let recentSearches = [];

  // 4. Translate WMO Weather Code
  function translateWMOCode(code) {
    const weatherMap = {
      0: { icon: '☀️', desc: 'Clear Sky' },
      1: { icon: '🌤️', desc: 'Mainly Clear' },
      2: { icon: '⛅', desc: 'Partly Cloudy' },
      3: { icon: '☁️', desc: 'Overcast' },
      45: { icon: '🌫️', desc: 'Foggy' },
      48: { icon: '🌫️', desc: 'Depositing Rime Fog' },
      51: { icon: '🌧️', desc: 'Light Drizzle' },
      53: { icon: '🌧️', desc: 'Moderate Drizzle' },
      55: { icon: '🌧️', desc: 'Dense Drizzle' },
      56: { icon: '🌧️', desc: 'Light Freezing Drizzle' },
      57: { icon: '🌧️', desc: 'Dense Freezing Drizzle' },
      61: { icon: '🌧️', desc: 'Slight Rain' },
      63: { icon: '🌧️', desc: 'Moderate Rain' },
      65: { icon: '🌧️', desc: 'Heavy Rain' },
      66: { icon: '🌧️', desc: 'Light Freezing Rain' },
      67: { icon: '🌧️', desc: 'Heavy Freezing Rain' },
      71: { icon: '❄️', desc: 'Slight Snowfall' },
      73: { icon: '❄️', desc: 'Moderate Snowfall' },
      75: { icon: '❄️', desc: 'Heavy Snowfall' },
      77: { icon: '❄️', desc: 'Snow Grains' },
      80: { icon: '🌦️', desc: 'Slight Rain Showers' },
      81: { icon: '🌦️', desc: 'Moderate Rain Showers' },
      82: { icon: '🌦️', desc: 'Violent Rain Showers' },
      85: { icon: '🌨️', desc: 'Slight Snow Showers' },
      86: { icon: '🌨️', desc: 'Heavy Snow Showers' },
      95: { icon: '⛈️', desc: 'Thunderstorm' },
      96: { icon: '⛈️', desc: 'Thunderstorm with Hail' },
      99: { icon: '⛈️', desc: 'Thunderstorm with Heavy Hail' }
    };
    return weatherMap[code] || { icon: '🌡️', desc: 'Unknown weather' };
  }

  // 5. Utility: Get Wind Direction Label
  function getWindDirectionText(degrees) {
    const sectors = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return sectors[index];
  }

  // 6. Utility: Format current local time in targeted city's timezone
  function formatLocalDateTime(timezone) {
    try {
      const options = {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: timezone
      };
      return new Intl.DateTimeFormat('en-US', options).format(new Date());
    } catch (e) {
      return new Date().toLocaleDateString();
    }
  }

  // 7. Utility: Format sunrise/sunset string safely
  function formatTimeFromISO(isoStr) {
    if (!isoStr) return '--';
    const parts = isoStr.split('T');
    if (parts.length < 2) return isoStr;
    const timePart = parts[1];
    const [hoursStr, minutesStr] = timePart.split(':');
    let hours = parseInt(hoursStr, 10);
    const minutes = minutesStr;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  // 8. Load Recent Searches from LocalStorage
  function loadRecentSearches() {
    try {
      const stored = localStorage.getItem('weather-recent-searches');
      recentSearches = stored ? JSON.parse(stored) : [];
      renderRecentSearches();
    } catch (e) {
      console.error('Failed to load recent searches:', e);
      recentSearches = [];
    }
  }

  // 9. Save and Add City to Recent Searches
  function saveRecentSearch(city) {
    try {
      // Remove any matching items to avoid duplicate visual chips
      recentSearches = recentSearches.filter(
        item => item.name.toLowerCase() !== city.name.toLowerCase() || 
                item.country.toLowerCase() !== city.country.toLowerCase()
      );
      
      // Unshift to add to front of chip row
      recentSearches.unshift({
        name: city.name,
        country: city.country,
        lat: city.lat,
        lon: city.lon,
        timezone: city.timezone
      });

      // Cap at 5 chips max
      if (recentSearches.length > 5) {
        recentSearches.pop();
      }

      localStorage.setItem('weather-recent-searches', JSON.stringify(recentSearches));
      renderRecentSearches();
    } catch (e) {
      console.error('Failed to save recent search:', e);
    }
  }

  // 10. Delete a city from search history
  function deleteRecentSearch(index, event) {
    if (event) event.stopPropagation(); // prevent loading the deleted city
    recentSearches.splice(index, 1);
    try {
      localStorage.setItem('weather-recent-searches', JSON.stringify(recentSearches));
      renderRecentSearches();
    } catch (e) {
      console.error('Failed to update recent searches after deletion:', e);
    }
  }

  // 11. Render Recent Searches Chips
  function renderRecentSearches() {
    recentSearchesList.innerHTML = '';
    if (recentSearches.length === 0) {
      recentSearchesContainer.style.display = 'none';
      return;
    }

    recentSearchesContainer.style.display = 'flex';
    recentSearches.forEach((city, index) => {
      const chip = document.createElement('div');
      chip.className = 'recent-chip';
      chip.setAttribute('role', 'button');
      chip.setAttribute('tabindex', '0');
      chip.innerHTML = `
        <span>${escapeHTML(city.name)}</span>
        <span class="recent-chip-delete" aria-label="Delete recent search">×</span>
      `;

      // Load weather on click
      chip.addEventListener('click', () => {
        loadWeatherData(city);
      });

      // Accessibility keypress binding
      chip.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          loadWeatherData(city);
        }
      });

      // Delete button hook
      const delBtn = chip.querySelector('.recent-chip-delete');
      delBtn.addEventListener('click', (e) => {
        deleteRecentSearch(index, e);
      });

      recentSearchesList.appendChild(chip);
    });
  }

  // 12. Geocoding API Search (Suggestions)
  async function fetchSuggestions(query) {
    if (!query || query.trim().length < 3) {
      hideSuggestions();
      return;
    }

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
      );

      if (!response.ok) throw new Error('Geocoding API network error');
      const data = await response.json();
      currentSuggestions = data.results || [];
      renderSuggestions();
    } catch (e) {
      console.error('Suggestions lookup failed:', e);
      hideSuggestions();
    }
  }

  // 13. Render Suggestions List
  function renderSuggestions() {
    suggestionsDropdown.innerHTML = '';
    suggestionFocusIndex = -1;

    if (currentSuggestions.length === 0) {
      hideSuggestions();
      return;
    }

    currentSuggestions.forEach((result, idx) => {
      const item = document.createElement('div');
      item.className = 'suggestion-item';
      item.setAttribute('role', 'option');
      item.setAttribute('tabindex', '-1');
      
      const stateName = result.admin1 ? `, ${result.admin1}` : '';
      const displayDetails = `${result.country}${stateName}`;
      
      item.innerHTML = `
        <span class="suggestion-city">${escapeHTML(result.name)}</span>
        <span class="suggestion-details">${escapeHTML(displayDetails)}</span>
      `;

      // Suggestions selection logic
      item.addEventListener('click', () => {
        selectSuggestion(result);
      });

      suggestionsDropdown.appendChild(item);
    });

    suggestionsDropdown.style.display = 'block';
  }

  // 14. Action on selecting a search suggestion
  function selectSuggestion(result) {
    const cityName = result.name;
    const stateName = result.admin1 ? `, ${result.admin1}` : '';
    cityInput.value = `${cityName}${stateName}, ${result.country}`;
    
    currentCity = {
      name: result.name,
      country: result.country,
      lat: result.latitude,
      lon: result.longitude,
      timezone: result.timezone
    };

    hideSuggestions();
    clearSearchBtn.style.display = 'flex';
    loadWeatherData(currentCity);
  }

  function hideSuggestions() {
    suggestionsDropdown.style.display = 'none';
    suggestionsDropdown.innerHTML = '';
    currentSuggestions = [];
    suggestionFocusIndex = -1;
  }

  // 15. Debounce helper to restrict API requests during typing
  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  // Keyboard navigation for suggestions
  function handleSuggestionsKeydown(e) {
    const items = suggestionsDropdown.querySelectorAll('.suggestion-item');
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      suggestionFocusIndex = (suggestionFocusIndex + 1) % items.length;
      updateSuggestionHighlight(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      suggestionFocusIndex = (suggestionFocusIndex - 1 + items.length) % items.length;
      updateSuggestionHighlight(items);
    } else if (e.key === 'Enter') {
      if (suggestionFocusIndex >= 0 && suggestionFocusIndex < items.length) {
        e.preventDefault();
        items[suggestionFocusIndex].click();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      hideSuggestions();
    }
  }

  // Highlight active option in suggestions
  function updateSuggestionHighlight(items) {
    items.forEach((item, idx) => {
      if (idx === suggestionFocusIndex) {
        item.classList.add('highlighted');
        item.setAttribute('aria-selected', 'true');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('highlighted');
        item.removeAttribute('aria-selected');
      }
    });
  }

  // 16. Asynchronous Weather Ingestion Flow
  async function loadWeatherData(city) {
    // Show Loading state skeletons
    contentWrapper.style.display = 'none';
    errorCard.style.display = 'none';
    loadingContainer.style.display = 'grid';

    try {
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,weather_code&timezone=${encodeURIComponent(city.timezone)}&forecast_days=5`;
      
      const response = await fetch(weatherUrl);
      if (!response.ok) throw new Error('Weather forecast API network failure');
      
      const weatherData = await response.json();
      
      // Save successfully loaded search to chip history
      saveRecentSearch(city);

      // Render data to DOM
      renderWeatherDashboard(city, weatherData);
      
      // Hide loading skeleton & show main dashboard grid
      loadingContainer.style.display = 'none';
      contentWrapper.style.display = 'grid';

      // Announce load complete to screen readers
      const liveRegion = document.getElementById('live-region');
      if (liveRegion) {
        liveRegion.textContent = `Weather report loaded successfully for ${city.name}.`;
      }

    } catch (err) {
      console.error('Failed to load weather data:', err);
      showErrorState(
        'Network Error',
        'Unable to connect to the weather server. Please check your internet connection or try again.'
      );
    }
  }

  // 17. Dynamically Render Retrieved Weather Data
  function renderWeatherDashboard(city, data) {
    const current = data.current;
    const daily = data.daily;
    const units = data.current_units;

    // A. Populate Main Info Card
    elCityName.textContent = city.name;
    elCountryName.textContent = city.country;
    elDateTime.textContent = formatLocalDateTime(city.timezone);
    
    // Rounded current temp
    const roundedTemp = Math.round(current.temperature_2m);
    elTemp.textContent = `${roundedTemp}${units.temperature_2m}`;
    
    // Daily Min & Max
    const roundedMax = Math.round(daily.temperature_2m_max[0]);
    const roundedMin = Math.round(daily.temperature_2m_min[0]);
    elTempMax.textContent = `${roundedMax}${units.temperature_2m}`;
    elTempMin.textContent = `${roundedMin}${units.temperature_2m}`;
    
    // Condition icon translation
    const condition = translateWMOCode(current.weather_code);
    elVisualIcon.textContent = condition.icon;
    elDescription.textContent = condition.desc;
    
    // Set appropriate aria label for condition icon
    elVisualIcon.setAttribute('aria-label', `Weather Condition: ${condition.desc}`);

    // B. Detailed Metrics
    elFeelsLike.textContent = `${Math.round(current.apparent_temperature)}${units.temperature_2m}`;
    elHumidity.textContent = `${current.relative_humidity_2m}${units.relative_humidity_2m}`;
    elHumidityProgress.style.width = `${current.relative_humidity_2m}%`;
    
    // Wind properties
    elWindSpeed.textContent = `${current.wind_speed_10m} ${units.wind_speed_10m}`;
    elWindDirection.style.transform = `rotate(${current.wind_direction_10m}deg)`;
    elWindDirText.textContent = getWindDirectionText(current.wind_direction_10m);
    elWindDirection.setAttribute('aria-label', `Wind Direction: ${current.wind_direction_10m} degrees`);
    
    // Precipitation
    elPrecipitation.textContent = `${current.precipitation} ${units.precipitation}`;

    // C. Sunrise and Sunset solar path calculations
    const sunriseStr = daily.sunrise[0];
    const sunsetStr = daily.sunset[0];
    elSunrise.textContent = formatTimeFromISO(sunriseStr);
    elSunset.textContent = formatTimeFromISO(sunsetStr);

    try {
      // Calculate sun position progress
      const sunriseTimePart = sunriseStr.split('T')[1];
      const sunsetTimePart = sunsetStr.split('T')[1];
      
      const [sunriseH, sunriseM] = sunriseTimePart.split(':').map(Number);
      const [sunsetH, sunsetM] = sunsetTimePart.split(':').map(Number);
      
      const sunriseMinTotal = sunriseH * 60 + sunriseM;
      const sunsetMinTotal = sunsetH * 60 + sunsetM;

      // Extract local hour and minutes from selected city timezone
      const localTimeStr = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: false,
        timeZone: city.timezone
      }).format(new Date());
      
      const [currH, currM] = localTimeStr.split(':').map(Number);
      const currentMinTotal = currH * 60 + currM;

      const isDay = currentMinTotal >= sunriseMinTotal && currentMinTotal <= sunsetMinTotal;
      let progress = 0;
      let sunEmoji = '☀️';

      if (isDay) {
        progress = (currentMinTotal - sunriseMinTotal) / (sunsetMinTotal - sunriseMinTotal);
        sunEmoji = '☀️';
        // Stroke dash offset ranges from 141.3 (empty) to 0 (completely filled)
        elSolarArcFill.style.strokeDashoffset = 141.3 - (progress * 141.3);
      } else {
        progress = 0;
        sunEmoji = '🌙';
        elSolarArcFill.style.strokeDashoffset = 141.3;
      }

      elSunNode.textContent = sunEmoji;
      
      if (isDay) {
        const angle = Math.PI - progress * Math.PI; // PI is left, 0 is right
        const x = 50 + 45 * Math.cos(angle);
        const y = 45 - 45 * Math.sin(angle);
        elSunNode.style.left = `${x}%`;
        elSunNode.style.top = `${y * 2}%`; // Scaled due to 100x50 SVG aspect ratio
      } else {
        // Night position resting at bottom center
        elSunNode.style.left = '50%';
        elSunNode.style.top = '90%';
      }
    } catch (solarErr) {
      console.error('Failed to compute sun arc coordinates:', solarErr);
      elSunNode.style.left = '50%';
      elSunNode.style.top = '90%';
      elSunNode.textContent = '☀️';
    }

    // D. 4-Day Daily Forecast Cards (Days 1 to 4)
    elForecastGrid.innerHTML = '';
    
    for (let i = 1; i <= 4; i++) {
      const forecastTime = daily.time[i];
      const maxT = Math.round(daily.temperature_2m_max[i]);
      const minT = Math.round(daily.temperature_2m_min[i]);
      const forecastCode = daily.weather_code[i];
      
      const dateObj = new Date(forecastTime);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      const dateText = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const forecastCond = translateWMOCode(forecastCode);

      const fCard = document.createElement('div');
      fCard.className = 'forecast-card';
      fCard.innerHTML = `
        <span class="forecast-day">${dayName}</span>
        <span class="forecast-date">${dateText}</span>
        <span class="forecast-icon" aria-hidden="true">${forecastCond.icon}</span>
        <div class="forecast-temp">
          <span class="forecast-temp-max">${maxT}°</span>
          <span class="forecast-temp-min">${minT}°</span>
        </div>
        <span class="forecast-desc">${forecastCond.desc}</span>
      `;
      elForecastGrid.appendChild(fCard);
    }
  }

  // 18. Error state rendering helper
  function showErrorState(title, message) {
    loadingContainer.style.display = 'none';
    contentWrapper.style.display = 'none';

    errorTitle.textContent = title;
    errorMessage.textContent = message;
    errorCard.style.display = 'block';

    const liveRegion = document.getElementById('live-region');
    if (liveRegion) {
      liveRegion.textContent = `Error loading weather: ${message}`;
    }
  }

  // 19. Initial City Geolocation & Bootstrapping flow
  async function searchCityDirectly(query) {
    if (!query || query.trim().length === 0) return;

    // Show loading skeleton immediately
    contentWrapper.style.display = 'none';
    errorCard.style.display = 'none';
    loadingContainer.style.display = 'grid';
    hideSuggestions();

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`
      );

      if (!response.ok) throw new Error('Geocoding response error');
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        showErrorState(
          'City Not Found',
          `We couldn't find a matching city for "${escapeHTML(query)}". Please verify spelling and try again.`
        );
        return;
      }

      const topResult = data.results[0];
      const stateName = topResult.admin1 ? `, ${topResult.admin1}` : '';
      cityInput.value = `${topResult.name}${stateName}, ${topResult.country}`;
      clearSearchBtn.style.display = 'flex';

      currentCity = {
        name: topResult.name,
        country: topResult.country,
        lat: topResult.latitude,
        lon: topResult.longitude,
        timezone: topResult.timezone
      };

      loadWeatherData(currentCity);

    } catch (e) {
      console.error('Direct search query failed:', e);
      showErrorState(
        'Search Error',
        'Failed to query the geocoding service. Please check your internet connection and try again.'
      );
    }
  }

  // Fallback default city bootstrap
  function bootstrapDefaultCity() {
    // Standard default fallback: Paris
    const defaultCity = {
      name: 'Paris',
      country: 'France',
      lat: 48.8566,
      lon: 2.3522,
      timezone: 'Europe/Paris'
    };
    cityInput.value = 'Paris, France';
    clearSearchBtn.style.display = 'flex';
    loadWeatherData(defaultCity);
  }

  // Attempt user geolocation, fallback to stored history or Paris
  function initializeDashboard() {
    loadRecentSearches();

    // Check if there is a previously loaded city in history to restore
    if (recentSearches.length > 0) {
      loadWeatherData(recentSearches[0]);
      return;
    }

    // Attempt geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const localCity = {
              name: 'Your Location',
              country: 'Nearby',
              lat: latitude,
              lon: longitude,
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
            };
            cityInput.value = 'Your Location';
            clearSearchBtn.style.display = 'flex';
            loadWeatherData(localCity);
          } catch (geoErr) {
            bootstrapDefaultCity();
          }
        },
        (error) => {
          // Geolocation rejected or failed
          bootstrapDefaultCity();
        },
        { timeout: 5000 }
      );
    } else {
      bootstrapDefaultCity();
    }
  }

  // 20. Event Bindings
  
  // Search Form Submit
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = cityInput.value.trim();
    if (query) {
      searchCityDirectly(query);
    }
  });

  // Typing search queries (debounced suggestions)
  const debouncedSuggest = debounce((val) => {
    fetchSuggestions(val);
  }, 300);

  cityInput.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    
    // Toggle clear search button
    clearSearchBtn.style.display = val.length > 0 ? 'flex' : 'none';

    if (val.length >= 3) {
      debouncedSuggest(val);
    } else {
      hideSuggestions();
    }
  });

  // Keyboard navigation on suggestions dropdown
  cityInput.addEventListener('keydown', handleSuggestionsKeydown);

  // Clear search input button
  clearSearchBtn.addEventListener('click', () => {
    cityInput.value = '';
    clearSearchBtn.style.display = 'none';
    hideSuggestions();
    cityInput.focus();
  });

  // Click outside suggestions dropdown to close
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.weather-search-container')) {
      hideSuggestions();
    }
  });

  // Retry Button on error card
  errorRetryBtn.addEventListener('click', () => {
    const query = cityInput.value.trim();
    if (query) {
      searchCityDirectly(query);
    } else if (currentCity) {
      loadWeatherData(currentCity);
    } else {
      initializeDashboard();
    }
  });

  // Utility to prevent HTML/XSS injection
  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Start the Application
  initializeDashboard();
});
