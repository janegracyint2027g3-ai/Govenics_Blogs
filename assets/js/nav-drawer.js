// GOVENICS Global Navigation & Side Panel Controller
function initGlobalNav() {
  if (!document.getElementById('sideDrawer')) {
    const isBlogActive = !window.location.pathname.includes('/ebooks') && !window.location.pathname.includes('/resources/ebooks');
    const isEbookActive = window.location.pathname.includes('/ebooks') || window.location.pathname.includes('/resources/ebooks');

    const drawerHtml = `
      <div id="sideDrawerOverlay" class="side-panel-overlay" onclick="toggleSideDrawer(false)"></div>
      <div id="sideDrawer" class="side-panel-drawer">
        <div class="side-panel-header">
          <div>
            <div class="side-panel-title">Knowledge Center Navigator</div>
            <div style="font-size: 11px; color: #94A3B8; margin-top: 2px;">GOVENICS Enterprise GRC</div>
          </div>
          <button class="side-panel-close" onclick="toggleSideDrawer(false)" aria-label="Close Navigator">&times;</button>
        </div>
        <div class="side-panel-body">
          <div class="side-panel-section-title">Primary Knowledge Formats</div>
          
          <a href="/" class="side-nav-card ${isBlogActive ? 'active' : ''}">
            <div class="side-nav-card-head">
              <span class="side-nav-card-title">📝 Practice Blogs & Articles</span>
              <span class="side-nav-badge badge-blog">78 Articles</span>
            </div>
            <p class="side-nav-desc">In-depth practice publications, statutory inspection breakdowns, and implementation guides across 13 offerings.</p>
          </a>

          <a href="/resources/ebooks" class="side-nav-card ${isEbookActive ? 'active' : ''}">
            <div class="side-nav-card-head">
              <span class="side-nav-card-title">📚 Executive E-Books</span>
              <span class="side-nav-badge badge-ebook">13 Editions</span>
            </div>
            <p class="side-nav-desc">30+ page research handbooks, downloadable defensibility roadmaps, and statutory checklists for C-suite leaders.</p>
          </a>

          <div class="side-panel-section-title" style="margin-top: 24px;">Core Practice Areas (13 Offerings)</div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <a href="/offerings/regulatory-compliance.html" style="font-size: 13px; color: #334155; padding: 6px 8px; border-radius: 4px; text-decoration: none; display: flex; justify-content: space-between;">
              <span>Regulatory Compliance</span> <span style="color:#94A3B8; font-size:11px;">6 Blogs • 1 E-book</span>
            </a>
            <a href="/offerings/enterprise-governance.html" style="font-size: 13px; color: #334155; padding: 6px 8px; border-radius: 4px; text-decoration: none; display: flex; justify-content: space-between;">
              <span>Enterprise Governance (CFO)</span> <span style="color:#94A3B8; font-size:11px;">6 Blogs • 1 E-book</span>
            </a>
            <a href="/offerings/cybersecurity-data.html" style="font-size: 13px; color: #334155; padding: 6px 8px; border-radius: 4px; text-decoration: none; display: flex; justify-content: space-between;">
              <span>Cybersecurity & Data (CISO)</span> <span style="color:#94A3B8; font-size:11px;">6 Blogs • 1 E-book</span>
            </a>
            <a href="/offerings/labour-employment.html" style="font-size: 13px; color: #334155; padding: 6px 8px; border-radius: 4px; text-decoration: none; display: flex; justify-content: space-between;">
              <span>Labour & Employment</span> <span style="color:#94A3B8; font-size:11px;">6 Blogs • 1 E-book</span>
            </a>
            <a href="/offerings/esg-sustainability.html" style="font-size: 13px; color: #334155; padding: 6px 8px; border-radius: 4px; text-decoration: none; display: flex; justify-content: space-between;">
              <span>ESG & Sustainability</span> <span style="color:#94A3B8; font-size:11px;">6 Blogs • 1 E-book</span>
            </a>
            <a href="/offerings/taxation-trade.html" style="font-size: 13px; color: #334155; padding: 6px 8px; border-radius: 4px; text-decoration: none; display: flex; justify-content: space-between;">
              <span>Taxation & Trade Advisory</span> <span style="color:#94A3B8; font-size:11px;">6 Blogs • 1 E-book</span>
            </a>
            <a href="/offerings/risk-management.html" style="font-size: 13px; color: #334155; padding: 6px 8px; border-radius: 4px; text-decoration: none; display: flex; justify-content: space-between;">
              <span>Enterprise Risk (CRO)</span> <span style="color:#94A3B8; font-size:11px;">6 Blogs • 1 E-book</span>
            </a>
          </div>

          <div style="margin-top: 28px; padding: 14px; background: #F8FAFC; border-radius: 8px; border: 1px solid #E2E8F0;">
            <div style="font-size: 12px; font-weight: 700; color: #0B1B3D; margin-bottom: 4px;">Corporate Diagnostic Portal</div>
            <p style="font-size: 11.5px; color: #64748B; margin-bottom: 10px;">Visit the official GOVENICS platform for diagnostics, service matrices, and advisory engagements.</p>
            <a href="https://govnics-murex.vercel.app/" target="_blank" style="display: block; text-align: center; font-size: 11.5px; font-weight: 700; background: #0B1B3D; color: #FFF; padding: 7px; border-radius: 4px; text-decoration: none;">Visit govenics.com &rarr;</a>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', drawerHtml);
  }
}

function toggleSideDrawer(open) {
  const drawer = document.getElementById('sideDrawer');
  const overlay = document.getElementById('sideDrawerOverlay');
  if (!drawer || !overlay) return;

  if (open) {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  } else {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

window.toggleSideDrawer = toggleSideDrawer;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobalNav);
} else {
  initGlobalNav();
}
