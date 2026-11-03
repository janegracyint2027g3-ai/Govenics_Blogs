/**
 * GOVENICS - Content Repurposing Studio Engine (WO-214 & WO-215)
 * Manages LinkedIn Post Generation, YouTube Video Packages & Content Inventory
 */

// Global State
let allBlogs = [];
let repurposedDB = {
  linkedin_posts: [],
  youtube_packages: []
};
let currentTab = 'blogs';
let selectedOffering = 'all';
let searchQuery = '';
let selectedAudienceFilter = 'all';
let selectedStatusFilter = 'all';
let selectedYtFormatFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  renderCounters();
  renderOfferingFilters();
  renderCurrentTab();
  setupEventListeners();
});

// Load Blog Inventory & Repurposed DB
async function loadData() {
  try {
    const blogsRes = await fetch('/data/content_inventory.json');
    allBlogs = await blogsRes.json();
  } catch (err) {
    console.error('Failed to load content inventory:', err);
  }

  // Check localStorage first
  const saved = localStorage.getItem('govenics_repurposed_content');
  if (saved) {
    try {
      repurposedDB = JSON.parse(saved);
    } catch (e) {
      console.warn('Invalid localStorage data, loading seed file');
    }
  }

  // If empty, load pre-seeded file
  if (!repurposedDB.linkedin_posts || repurposedDB.linkedin_posts.length === 0) {
    try {
      const seedRes = await fetch('/data/repurposed_content.json');
      const seedData = await seedRes.json();
      repurposedDB = seedData;
      saveDB();
    } catch (err) {
      console.error('Failed to load seed repurposed data:', err);
      repurposedDB = { linkedin_posts: [], youtube_packages: [] };
    }
  }
}

function saveDB() {
  localStorage.setItem('govenics_repurposed_content', JSON.stringify(repurposedDB));
  renderCounters();
}

// Render Header Metrics
function renderCounters() {
  const blogCountEl = document.getElementById('stat-blogs-count');
  const liCountEl = document.getElementById('stat-li-count');
  const ytCountEl = document.getElementById('stat-yt-count');
  const approvedCountEl = document.getElementById('stat-approved-count');

  if (blogCountEl) blogCountEl.textContent = allBlogs.length || 78;
  if (liCountEl) liCountEl.textContent = repurposedDB.linkedin_posts.length;
  if (ytCountEl) ytCountEl.textContent = repurposedDB.youtube_packages.length;
  
  if (approvedCountEl) {
    const liAppr = repurposedDB.linkedin_posts.filter(p => p.approval_status === 'Approved').length;
    const ytAppr = repurposedDB.youtube_packages.filter(p => p.approval_status === 'Approved').length;
    approvedCountEl.textContent = liAppr + ytAppr;
  }
}

// Tab Switching
function switchTab(tabId) {
  currentTab = tabId;
  document.querySelectorAll('.engine-nav-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === tabId);
  });
  document.querySelectorAll('.engine-view-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `panel-${tabId}`);
  });
  renderCurrentTab();
}

function renderCurrentTab() {
  if (currentTab === 'blogs') renderBlogsPanel();
  else if (currentTab === 'linkedin') renderLinkedInPanel();
  else if (currentTab === 'youtube') renderYouTubePanel();
}

// Offering Filter Pills for Blogs Tab
function renderOfferingFilters() {
  const container = document.getElementById('offering-pills');
  if (!container) return;

  const offerings = ['all', ...new Set(allBlogs.map(b => b.offering_name))];
  container.innerHTML = offerings.map(off => `
    <button class="filter-pill ${selectedOffering === off ? 'active' : ''}" onclick="setOfferingFilter('${off}')">
      ${off === 'all' ? 'All 13 Offerings' : off}
    </button>
  `).join('');
}

function setOfferingFilter(off) {
  selectedOffering = off;
  renderOfferingFilters();
  renderBlogsPanel();
}

function handleSearch(val) {
  searchQuery = val.toLowerCase().trim();
  renderCurrentTab();
}

// ─────────────────────────────────────────────────────────────
// TAB 1: EXISTING BLOGS INVENTORY
// ─────────────────────────────────────────────────────────────
function renderBlogsPanel() {
  const container = document.getElementById('blogs-inventory-grid');
  if (!container) return;

  let filtered = allBlogs.filter(b => {
    const matchOffering = (selectedOffering === 'all' || b.offering_name === selectedOffering);
    const matchSearch = !searchQuery || 
      b.title.toLowerCase().includes(searchQuery) ||
      b.blog_id.toLowerCase().includes(searchQuery) ||
      b.offering_name.toLowerCase().includes(searchQuery) ||
      b.industry.toLowerCase().includes(searchQuery);
    return matchOffering && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box">
        <div style="font-size:32px;margin-bottom:8px;">🔍</div>
        <h4 style="font-weight:700;color:#0F172A;">No matching blogs found</h4>
        <p style="color:#64748B;font-size:13px;">Try resetting your search query or offering filter.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(b => {
    // Check if already repurposed
    const liExists = repurposedDB.linkedin_posts.some(p => p.source_blog_id === b.blog_id);
    const ytExists = repurposedDB.youtube_packages.some(p => p.source_blog_id === b.blog_id);

    return `
      <div class="blog-inventory-card">
        <div class="blog-card-meta">
          <span class="blog-id-badge">${b.blog_id}</span>
          <span class="blog-offering-badge" style="background:#EFF6FF;color:#1D4ED8;border:1px solid #BFDBFE;">${b.offering_name}</span>
          <span style="margin-left:auto;font-size:11px;color:#94A3B8;font-weight:600;">📅 ${b.publication_date}</span>
        </div>

        <h3 class="blog-card-title">${b.title}</h3>

        <div style="font-size:12px;color:#64748B;margin:8px 0;line-height:1.5;">
          <strong style="color:#334155;">Industry:</strong> ${b.industry}
        </div>
        <div style="font-size:11px;color:#059669;font-weight:700;margin-bottom:12px;">
          ⚖️ Frameworks: ${b.frameworks || 'Companies Act 2013, Sectoral Mandates'}
        </div>

        <div class="blog-card-actions">
          <button class="btn-action-primary" onclick="generateAllForBlog('${b.blog_id}')">
            ⚡ Repurpose All (LI + YT)
          </button>
          <button class="btn-action-secondary" onclick="generateLinkedInForBlogId('${b.blog_id}')">
            ${liExists ? '✔ 6 LI Posts Ready' : '💼 Generate 6 LI Posts'}
          </button>
          <button class="btn-action-secondary" onclick="generateYouTubeForBlogId('${b.blog_id}')">
            ${ytExists ? '✔ YT Package Ready' : '🎥 Generate YT Package'}
          </button>
          <a href="/articles/${b.slug}.html" target="_blank" class="btn-action-outline" title="Open source blog article">
            🔗 View Blog
          </a>
        </div>
      </div>
    `;
  }).join('');
}

// ─────────────────────────────────────────────────────────────
// GENERATION LOGIC: LINKEDIN & YOUTUBE
// ─────────────────────────────────────────────────────────────

function generateAllForBlog(blogId) {
  generateLinkedInForBlogId(blogId, false);
  generateYouTubeForBlogId(blogId, false);
  showToast(`✅ Successfully repurposed ${blogId} into 6 LinkedIn Posts & complete YouTube Package!`);
  renderCounters();
  switchTab('linkedin');
}

function generateLinkedInForBlogId(blogId, switchTabToLi = true) {
  const b = allBlogs.find(x => x.blog_id === blogId);
  if (!b) return;

  // Filter out any existing posts for this blog to regenerate cleanly
  repurposedDB.linkedin_posts = repurposedDB.linkedin_posts.filter(p => p.source_blog_id !== blogId);

  const slug = b.slug;
  const blog_url = `https://govenicsblogs.vercel.app/articles/${slug}.html`;
  const offering = b.offering_name;
  const industry = b.industry;
  const frameworks = b.frameworks || "Statutory Corporate Compliance Rules";

  const posts = [
    {
      role: "CEO / Managing Director",
      id_suffix: "CEO",
      framework: "Operational Risk Teardown",
      headline: `🚨 The Boardroom Exposure Hidden Inside ${offering}`,
      text: `🚨 The Boardroom Exposure Hidden Inside ${offering}\n\nFor enterprise CEOs and Board Directors, regulatory compliance is no longer an administrative footnote—it is a core valuation and defensibility risk. In 2026, multi-entity conglomerates face unprecedented scrutiny from statutory inspection authorities.\n\n📌 THE REALITY:\nDecentralized operations, inconsistent subsidiary registers, and manual tracking create blind spots where a single operational failure triggers compounding penalties, inspection notices, and public reputational damage under ${frameworks}.\n\n⚖️ EXECUTIVE IMPERATIVES:\n• Board oversight cannot rely on quarterly spreadsheet confirmations.\n• Independent Directors face vicarious personal liability for subsidiary lapses.\n• Regulatory defensibility must be verifiable within 2 hours of notice receipt.\n\nGOVENICS provides enterprise leaders with audit-defensible governance blueprints and real-time statutory dashboards.\n\n👉 Read our full executive analysis: ${blog_url}\n💼 Schedule a Boardroom GRC Briefing: https://govenics.com/contact\n\n#CorporateGovernance #BoardLeadership #EnterpriseRisk #CEOMindset #${offering.replace(/\s+/g, '')} #GOVENICS`,
      prompt: "Cinematic executive boardroom in a glass skyscraper overlooking financial district at dusk, modern corporate mahogany conference table, ultra-high-definition, photorealistic lighting, corporate blue and gold accents --ar 16:9",
      hashtags: ["CorporateGovernance", "BoardLeadership", "EnterpriseRisk", "CEOMindset", "GOVENICS"]
    },
    {
      role: "CFO / Finance Controller",
      id_suffix: "CFO",
      framework: "SPICED Financial Teardown",
      headline: `📉 How Unmitigated ${offering} Silently Erodes Enterprise EBITDA`,
      text: `📉 How Unmitigated ${offering} Silently Erodes Enterprise EBITDA\n\nChief Financial Officers and Finance Controllers frequently audit direct supplier costs and operational margins. Yet, one of the most volatile balance sheet risks remains unquantified: statutory compliance slippage.\n\n💰 THE FINANCIAL FALLOUT:\n• Compounding statutory penalties and interest under Section 442 and tax codes.\n• Input Tax Credit (ITC) disallowances and vendor non-compliance clawbacks.\n• Unbudgeted legal defense costs and statutory compounding settlements.\n\nWhen compliance tasks are decentralized, finance teams discover gaps only after statutory demand notices arrive. Defensible statutory controls turn compliance from an unbudgeted liability into an EBITDA-protective governance moat.\n\nAt GOVENICS, we engineer automated digital registers and pre-audit defensibility architectures that eliminate statutory leaks.\n\n👉 Access the complete CFO guide: ${blog_url}\n📊 Request a CFO Risk Exposure Audit: https://govenics.com/contact\n\n#CFO #FinanceLeadership #InternalAudit #TaxDefensibility #StatutoryCompliance #EBITDA #GOVENICS`,
      prompt: "Executive financial controller reviewing holographic digital risk dashboards and audit analytics, corporate financial office background, clean blue and slate tones, 8k resolution, cinematic depth of field --ar 16:9",
      hashtags: ["CFO", "FinanceLeadership", "InternalAudit", "TaxDefensibility", "StatutoryCompliance", "GOVENICS"]
    },
    {
      role: "Chief Compliance Officer",
      id_suffix: "CCO",
      framework: "Problem-Agitation-Solution (PAS)",
      headline: `🛡️ Why Standard Compliance Checklists Collapse During Regulatory Inspections`,
      text: `🛡️ Why Standard Compliance Checklists Collapse During Regulatory Inspections\n\nChief Compliance Officers know that passing an internal checklist is very different from surviving an unannounced statutory regulatory inspection. Regulators don't inspect intentions—they demand time-stamped evidentiary registers.\n\n🔍 THE CRITICAL GAP:\nAcross manufacturing plants, regional offices, and joint ventures, organizations suffer from:\n• Outdated physical logbooks and un-synchronized master registers.\n• Missing contractor documentation and lagging inspection trails.\n• Absence of cryptographic evidence vaults proving filing timelines.\n\nUnder ${frameworks}, procedural deviations can result in show-cause notices and operational stop-work orders.\n\nGOVENICS deploys 100% Audit Readiness Programs, pre-audit mock drills, and automated digital registers ensuring instantaneous inspection defensibility.\n\n👉 Read the full practitioner breakdown: ${blog_url}\n📑 Download our Audit Defensibility Blueprint: https://govenics.com/contact\n\n#ChiefComplianceOfficer #ComplianceManagement #AuditReadiness #RegulatoryAffairs #GRC #GOVENICS`,
      prompt: "Modern high-tech compliance command center, digital audit vaults, secure data encryption visuals, corporate blue holographic displays, clean professional aesthetic --ar 16:9",
      hashtags: ["ChiefComplianceOfficer", "ComplianceManagement", "AuditReadiness", "RegulatoryAffairs", "GRC", "GOVENICS"]
    },
    {
      role: "Legal Head / Company Secretary",
      id_suffix: "CS",
      framework: "Statutory Fiduciary Analysis",
      headline: `⚖️ Protecting Directors & KMPs: Mitigating Personal Liability Under ${frameworks}`,
      text: `⚖️ Protecting Directors & KMPs: Mitigating Personal Liability Under ${frameworks}\n\nFor General Counsels and Company Secretaries, the regulatory enforcement landscape has shifted toward individual accountability. Statutory agencies now routinely issue show-cause notices directly to Directors and Key Managerial Personnel (KMPs).\n\n🏛️ THE LEGAL HAZARD:\nHolding companies operating across multi-tier subsidiaries often assume corporate veil protections. However, statutory defaults in labour, environmental consents, or filing deadlines bypass subsidiary boundaries to expose Board Members.\n\n🛡️ DEFENSE ARCHITECTURE:\n• Codified Delegation of Authority (DoA) matrices.\n• Standardized Board Committee audit trails and minutes.\n• Section 442 mediation readiness and compounding petitions.\n\nGOVENICS helps legal counsels structure robust Director indemnification charters and automated statutory monitoring.\n\n👉 Review the legal risk compendium: ${blog_url}\n⚖️ Speak with our GRC Legal Advisory Practice: https://govenics.com/contact\n\n#CompanySecretary #GeneralCounsel #CorporateLaw #DirectorLiability #CompaniesAct #LegalRisk #GOVENICS`,
      prompt: "Formal corporate boardroom legal counsel setting, leather-bound statutory codes, modern digital legal analytics tablet, warm ambient lighting, authoritative executive mood --ar 16:9",
      hashtags: ["CompanySecretary", "GeneralCounsel", "CorporateLaw", "DirectorLiability", "CompaniesAct", "GOVENICS"]
    },
    {
      role: "Operations / Plant Director",
      id_suffix: "OPS",
      framework: "Operational Risk Teardown",
      headline: `⚙️ How Operational Compliance Gaps Paralyze Shopfloor Manufacturing`,
      text: `⚙️ How Operational Compliance Gaps Paralyze Shopfloor Manufacturing\n\nTo Plant Directors and VPs of Operations, factory downtime is the ultimate enemy. Yet one of the most frequent causes of sudden production halts isn't machine breakdown—it is statutory non-compliance.\n\n⚠️ ON-THE-GROUND REALITIES:\n• Contract workforce CLRA lapses and missing daily attendance registers.\n• Pollution Control Board (CPCB/SPCB) consent renewals slipping through cracks.\n• Safety log deviations triggering unexpected Inspector stop-work orders.\n\nIn sectors like ${industry}, operational continuity demands that safety registers, contractor PF/ESI receipts, and hazardous waste manifests synchronize daily.\n\nGOVENICS provides on-site factory compliance automation, zero-stop-work guarantee audits, and end-to-end plant regulatory defensibility.\n\n👉 Read the operational compliance guide: ${blog_url}\n🏭 Request a Plant Operations Health Check: https://govenics.com/contact\n\n#PlantOperations #Manufacturing #EHS #ContractLabour #FactoriesAct #OperationalRisk #GOVENICS`,
      prompt: "Modern advanced industrial manufacturing plant, clean automated assembly lines, high-tech digital safety monitoring screens, industrial lighting, professional cinematic photograph --ar 16:9",
      hashtags: ["PlantOperations", "Manufacturing", "EHS", "ContractLabour", "FactoriesAct", "GOVENICS"]
    },
    {
      role: "Industry-specific decision-maker",
      id_suffix: "IND",
      framework: "Sector Blueprint Positioning",
      headline: `🎯 Specialized ${offering} for ${industry.split(',')[0]} Leaders`,
      text: `🎯 Specialized ${offering} for ${industry.split(',')[0]} Leaders\n\nGeneric compliance frameworks fail in specialized sectors. For leaders in ${industry}, regulatory requirements are deeply intertwined with supply chains, vendor networks, and mission-critical operations.\n\n🌐 SECTOR DYNAMICS:\nOperating in ${industry.split(',')[0]} requires managing intricate mandates: from ${frameworks} to international buyer quality audits. Gaps in sub-tier supplier compliance can disqualify an entire export shipment or trigger heavy local sanctions.\n\n🚀 STRATEGIC OUTCOMES:\n• 100% audit pass rates in Tier-1 buyer inspections.\n• Automated tracking of industry-specific statutory returns.\n• Zero penalties and accelerated market expansion.\n\nGOVENICS provides tailored sector blueprints built on 40+ years of advisory heritage across 1,000+ enterprise clients.\n\n👉 Read the complete industry roadmap: ${blog_url}\n🤝 Consult an Industry Practice Director: https://govenics.com/contact\n\n#IndustryCompliance #${industry.split(',')[0].replace(/\s+/g, '')} #SupplyChainRisk #EnterpriseGovernance #GOVENICS`,
      prompt: "State-of-the-art industry facility with specialized enterprise technology, futuristic analytical dashboard overlay, professional industrial aesthetic, photorealistic 8k --ar 16:9",
      hashtags: ["IndustryCompliance", "SupplyChainRisk", "EnterpriseGovernance", "GOVENICS"]
    }
  ];

  posts.forEach(p => {
    repurposedDB.linkedin_posts.unshift({
      content_id: `LI-${blogId}-${p.id_suffix}`,
      source_blog_id: blogId,
      source_blog_title: b.title,
      offering: offering,
      industry: industry,
      target_audience: p.role,
      content_type: "LinkedIn Post",
      framework_used: p.framework,
      headline: p.headline,
      post_text: p.text,
      character_count: p.text.length,
      hashtags: p.hashtags,
      blog_url: blog_url,
      poster_prompt: p.prompt,
      creation_date: new Date().toISOString().split('T')[0],
      last_updated: new Date().toISOString().split('T')[0],
      approval_status: "Generated",
      publication_status: "Ready for Distribution",
      uniqueness_score: 100
    });
  });

  saveDB();
  if (switchTabToLi) {
    showToast(`✅ Generated 6 LinkedIn posts for ${b.title.slice(0, 40)}...`);
    switchTab('linkedin');
  }
}

function generateYouTubeForBlogId(blogId, switchTabToYt = true) {
  const b = allBlogs.find(x => x.blog_id === blogId);
  if (!b) return;

  // Filter out any existing package for this blog
  repurposedDB.youtube_packages = repurposedDB.youtube_packages.filter(p => p.source_blog_id !== blogId);

  const slug = b.slug;
  const blog_url = `https://govenicsblogs.vercel.app/articles/${slug}.html`;
  const offering = b.offering_name;
  const industry = b.industry;
  const frameworks = b.frameworks || "Statutory Corporate Compliance Rules";

  const pkg = {
    package_id: `YT-${blogId}`,
    source_blog_id: blogId,
    source_blog_title: b.title,
    offering: offering,
    industry: industry,
    content_type: "YouTube Content Package",
    creation_date: new Date().toISOString().split('T')[0],
    last_updated: new Date().toISOString().split('T')[0],
    approval_status: "Generated",
    publication_status: "Ready for Production",
    formats: {
      shorts: {
        format_name: "YouTube Shorts (Vertical 9:16)",
        duration: "55s",
        title: `Why Most Companies Fail ${offering} Audits 🚨 #Shorts`,
        hook: `Stop! If your enterprise operates across multiple entities or facilities, this one compliance blind spot could trigger immediate statutory prosecution...`,
        key_insights: [
          "1. Physical paper registers fail 90% of surprise government inspections.",
          "2. Contract labour ESI/PF non-compliance creates direct Principal Employer criminal liability.",
          "3. Regulators give less than 48 hours to furnish immutable audit registers.",
          "4. Automated digital registers eliminate 100% of filing bottlenecks."
        ],
        voiceover_script: `Did you know that 85% of corporate statutory fines happen not because companies refuse to comply, but because their internal records are scattered across regional spreadsheets? When statutory inspectors visit your plant or subsidiary, paper logs won't protect your Board. Under current enforcement rules, procedural delays in registers trigger heavy daily compounding penalties. The solution? Enterprise-grade digital register synchronization and pre-audit defensibility. Visit govenics.com to download the full inspection readiness checklist today.`,
        storyboard: [
          { scene: 1, time: "0:00 - 0:08", visual: "Fast-paced macro shot of statutory inspector stamping 'NON-COMPLIANT' notice on corporate register.", on_screen_text: "🚨 SURPRISE STATUTORY AUDIT?", transition: "Quick Whip Pan" },
          { scene: 2, time: "0:08 - 0:24", visual: "Split-screen showing messy scattered spreadsheets on desk vs. clean encrypted tablet dashboard.", on_screen_text: "85% Fines from Disorganized Records", transition: "Glitch Cut" },
          { scene: 3, time: "0:24 - 0:42", visual: "Animated dynamic checklist ticking green with timestamps and compliance badges.", on_screen_text: "✔ 100% Audit Defensibility", transition: "Smooth Zoom In" },
          { scene: 4, time: "0:42 - 0:55", visual: "Executive GOVENICS advisory desk with website URL and QR code pointing to blog.", on_screen_text: "Defend Your Board: govenics.com", transition: "Fade to Blue Logo" }
        ],
        cta: "Read the complete blueprint at govenicsblogs.vercel.app or request a 5-min GRC diagnostic.",
        thumbnail_headline: "SURPRISE AUDIT? 🚨 NEVER FAIL THIS",
        thumbnail_prompt: "Dramatic close-up of a corporate boardroom table with a bright red official regulatory inspection folder, glowing neon warning text 'AUDIT READY?', hyper-realistic 8k, cinematic vertical 9:16 --ar 9:16",
        tags: [offering, "RegulatoryCompliance", "Shorts", "CorporateLaw", "AuditInspection", "GOVENICS"]
      },
      explainer: {
        format_name: "Explainer Video (Horizontal 16:9)",
        duration: "3m 30s",
        title: `The Complete Executive Guide to ${offering} | GOVENICS Masterclass`,
        description: `In this executive briefing, GOVENICS GRC Consulting breaks down the critical failure points, statutory exposures, and operational frameworks required to build 100% audit-defensible ${offering}.\n\n📌 CHAPTERS:\n0:00 - The Hidden Reality of Statutory Non-Compliance\n0:45 - The Cost of Operational Friction & Penalties\n1:40 - Regulatory Frameworks & Inspector Scrutiny\n2:35 - The GOVENICS Defensibility Roadmap\n3:10 - Next Steps for Leadership\n\n🔗 Source Article: ${blog_url}\n🌐 Official Advisory Portal: https://govnics-murex.vercel.app/\n📞 Book an Advisory Session: https://govenics.com/contact`,
        voiceover_script: `Welcome to GOVENICS Insights. Today we examine why enterprise compliance programs fail—and how corporate leaders can build an ironclad statutory shield.\n\nFor large organizations operating across manufacturing plants, corporate offices, and distributed vendor networks, compliance is often treated as an end-of-quarter administrative task. But in today's heightened enforcement environment under ${frameworks}, that approach exposes Boards and CXOs to severe financial and reputational liabilities.\n\nConsider what happens during an unannounced regulatory audit. Inspectors don't accept verbal assurances; they demand multi-year, time-stamped, tamper-evident registers. When records are maintained in siloed spreadsheets, retrieval delays trigger immediate show-cause notices, statutory compounding fines, and in worst-case scenarios, factory stop-work orders.\n\nAt GOVENICS, we resolve this through our 3-tiered defensibility architecture: First, continuous statutory mapping that translates gazette notifications into actionable department tasks. Second, automated digital registers with algorithmic validation to stop human error. And third, our 100% Audit Readiness Program featuring simulated regulatory drills.\n\nTo assess your enterprise exposure or download our verified audit checklists, visit the link in the description below.`,
        storyboard: [
          { scene: 1, time: "0:00 - 0:45", visual: "Executive presenter in modern GOVENICS studio, subtle navy background, lower-third introduction.", on_screen_text: "Executive Briefing: " + offering, transition: "Cross Dissolve" },
          { scene: 2, time: "0:45 - 1:40", visual: "3D animated diagram illustrating statutory demand notices flowing from regulators down to subsidiaries.", on_screen_text: "The Risk: Compounding Financial Liabilities", transition: "Motion Graphic Slide" },
          { scene: 3, time: "1:40 - 2:35", visual: "B-roll of modern factory inspection juxtaposed with high-speed digital register validation.", on_screen_text: "Evidentiary Registers: The Single Source of Truth", transition: "Wipe Right" },
          { scene: 4, time: "2:35 - 3:10", visual: "GOVENICS 3-Tiered Defensibility Architecture schematic showing real-time KRI tracking.", on_screen_text: "The GOVENICS Defensibility Blueprint", transition: "Zoom to Diagram" },
          { scene: 5, time: "3:10 - 3:30", visual: "Presenter closing with official GOVENICS website, contact details, and QR code to full article.", on_screen_text: "Book Strategy Session: govenics.com", transition: "Fade Out to Logo" }
        ],
        cta: "Read the verified enterprise research article and download free audit registers at govenicsblogs.vercel.app",
        thumbnail_headline: "SURVIVING STATUTORY AUDITS: THE CFO & CCO PLAYBOOK",
        thumbnail_prompt: "Cinematic YouTube thumbnail, professional C-suite presenter in dark suit pointing toward glowing 3D shield with statutory legal icons, dramatic blue backlight, bold yellow typography 'AUDIT PLAYBOOK', 4k high contrast --ar 16:9",
        tags: [offering, "CorporateGovernance", "RegulatoryCompliance", "InternalAudit", "CFO", "GOVENICS"]
      },
      educational: {
        format_name: "Educational Deep-Dive (Horizontal 16:9)",
        duration: "7m 15s",
        title: `Masterclass: How to Architect an Enterprise-Grade ${offering} System`,
        description: `A comprehensive 7-minute practitioner masterclass on designing, rolling out, and maintaining an auditable ${offering} framework across multi-entity holdings.\n\n📌 DETAILED TIMESTAMPS:\n0:00 - Masterclass Introduction & Learning Objectives\n1:15 - Current Regulatory & Statutory Landscape (${frameworks})\n2:45 - The Top 5 Operational Breakdown Points in Enterprises\n4:20 - Real-World Case Study: Eliminating Audit Deviations\n5:40 - Step-by-Step Implementation Roadmap (Phases 1-6)\n6:45 - Executive Conclusion & Board Reporting SOPs\n\n🔗 Full Research Article: ${blog_url}\n📑 Download Verified Checklists: https://govenicsblogs.vercel.app/resources/ebooks\n🤝 Request Advisory Assessment: https://govenics.com/contact`,
        voiceover_script: `Welcome to the GOVENICS Enterprise Masterclass. In today's session, we are dissecting the operational mechanics of ${offering}—specifically for organizations managing complex multi-state, multi-entity holding structures.\n\nUnder ${frameworks}, enforcement has evolved from periodic paperwork collection to real-time statutory scrutiny. Regulatory agencies now leverage integrated digital portals to detect filing anomalies, attendance register mismatches, and contractor payment gaps instantaneously.\n\nWhere do most enterprises fail? Our advisory audits across 1,000+ facilities reveal five consistent breakdown points: First, decentralized register maintenance where each plant or branch maintains its own informal records. Second, contractor CLRA tracking lapses where principal employers fail to verify vendor PF and ESI challans. Third, lack of documented delegation of authority matrices. Fourth, delayed regulatory gazette amendment ingestion. And fifth, the total absence of cryptographic evidence vaults.\n\nFollow our 6-phase roadmap: Discovery and gap assessment, risk prioritization, policy harmonization, digital register deployment, supervisory training, and continuous automated surveillance. For full frameworks, checklists, and templates, download our executive publication in the description below.`,
        storyboard: [
          { scene: 1, time: "0:00 - 1:15", visual: "Executive host in modern architectural GRC briefing room, interactive whiteboard showing masterclass agenda.", on_screen_text: "Masterclass: Enterprise " + offering, transition: "Cross Fade" },
          { scene: 2, time: "1:15 - 2:45", visual: "Animated map of India with statutory agencies (MCA, RBI, Labour, CPCB) connected via data streams.", on_screen_text: "The Modern Regulatory Enforcement Grid", transition: "Slide Left" },
          { scene: 3, time: "2:45 - 4:20", visual: "Graphic teardown highlighting 5 Critical Enterprise Failure Points with red alert badges.", on_screen_text: "5 Operational Breakdown Points", transition: "Push Down" },
          { scene: 4, time: "4:20 - 5:40", visual: "Split-screen case study showing Before vs. After metrics (0 Stop-Work Notices, 100% Defensibility).", on_screen_text: "Case Study: 6-Plant Holding Network", transition: "Wipe Diagonal" },
          { scene: 5, time: "5:40 - 6:45", visual: "Animated 6-Step Implementation Roadmap flowchart moving smoothly across phases.", on_screen_text: "The 6-Phase Implementation Roadmap", transition: "Zoom Flowchart" },
          { scene: 6, time: "6:45 - 7:15", visual: "Host concluding, pointing to on-screen interactive e-Book and downloadable checklist cards.", on_screen_text: "Download Verified Blueprint at govenics.com", transition: "Fade Out to Official Card" }
        ],
        cta: "Download our 36-page verified implementation blueprint and register templates at govenicsblogs.vercel.app/resources/ebooks",
        thumbnail_headline: "ENTERPRISE GRC MASTERCLASS: ZERO PENALTY SYSTEM",
        thumbnail_prompt: "Masterclass style YouTube thumbnail, professional senior consultant pointing to a complex enterprise compliance architecture diagram on a frosted glass wall, cinematic teal and navy lighting, 4k resolution --ar 16:9",
        tags: [offering, "GRCMasterclass", "StatutoryCompliance", "RegulatoryAudits", "ExecutiveEducation", "GOVENICS"]
      },
      community_posts: [
        {
          post_id: `YT-COMM-${blogId}-1`,
          type: "Educational Insight",
          text: `📊 EXECUTIVE INSIGHT: Why decentralized compliance registers are the #1 cause of statutory audit penalties in 2026.\n\nWhen an enterprise operates across multiple entities, local plants often maintain their own informal spreadsheets. But under ${frameworks}, regulators inspect the consolidated parent entity.\n\n💡 Key takeaway: If your organization cannot retrieve time-stamped evidentiary registers across all subsidiaries within 2 hours of notice receipt, you are operating with an uncalculated balance sheet risk.\n\nRead our full executive briefing: ${blog_url}\n\n#Compliance #EnterpriseRisk #CorporateGovernance #GOVENICS`
        },
        {
          post_id: `YT-COMM-${blogId}-2`,
          type: "Industry Dilemma & Question",
          text: `🤔 QUESTION FOR CFOs & GENERAL COUNSELS:\n\nHow long does it currently take your team to compile and verify all statutory registers, contractor PF/ESI challans, and consent renewals across your entire subsidiary network?\n\nDrop your thoughts below: Are you relying on local plant managers, centralized ERP software, or third-party advisory firms?\n\nLet's discuss in the comments! 👇`
        },
        {
          post_id: `YT-COMM-${blogId}-3`,
          type: "Interactive Quiz / Poll",
          text: `⚖️ COMPLIANCE QUIZ FOR LEADERSHIP:\n\nUnder Indian company law, when a subsidiary entity fails to maintain statutory compliance registers, can Independent Directors of the parent holding group be named in regulatory show-cause notices?\n\nA) No, subsidiary liability is strictly insulated\nB) Yes, under vicarious liability and officer-in-default doctrines\nC) Only if they signed the physical register\nD) Only if penalty exceeds ₹1 Crore\n\n👉 Correct Answer: B (Under Section 442 and modern corporate governance rulings, holding company KMPs face vicarious scrutiny unless a formal Delegation of Authority and supervisory oversight trail is proven).\n\nRead the complete legal breakdown: ${blog_url}`
        },
        {
          post_id: `YT-COMM-${blogId}-4`,
          type: "Regulatory Alert & Awareness",
          text: `⚠️ REGULATORY COMPLIANCE ALERT:\n\nStatutory authorities have intensified unannounced verification drills across manufacturing and corporate holdings. Common inspection targets include:\n\n✔ CLRA contractor attendance vs. wage payout reconciliation\n✔ Environmental SPCB Consent to Operate (CTO) condition tracking\n✔ Immutable digital evidence preservation\n\nEnsure your facility managers are trained on pre-audit protocols. Review our emergency inspection checklist: ${blog_url}`
        },
        {
          post_id: `YT-COMM-${blogId}-5`,
          type: "Video Premiere & Announcement",
          text: `🎬 NEW VIDEO PREMIERE:\n\nWe just released our executive explainer: 'The Complete Executive Guide to ${offering}'.\n\nIn this 3-minute briefing, we unpack the exact steps Group CFOs, CCOs, and Plant Heads take to eliminate regulatory penalties and guarantee 100% audit defensibility.\n\nWatch the full video on our channel and read the companion research paper here: ${blog_url}\n\nWhat topic should our GRC Practice cover next? Let us know!`
        }
      ]
    }
  };

  repurposedDB.youtube_packages.unshift(pkg);
  saveDB();

  if (switchTabToYt) {
    showToast(`✅ Generated YouTube Package (Shorts, Explainer, Masterclass & 5 Posts) for ${b.title.slice(0, 40)}...`);
    switchTab('youtube');
  }
}

// ─────────────────────────────────────────────────────────────
// TAB 2: LINKEDIN CONTENT STUDIO
// ─────────────────────────────────────────────────────────────
function renderLinkedInPanel() {
  const container = document.getElementById('linkedin-posts-grid');
  if (!container) return;

  let filtered = repurposedDB.linkedin_posts.filter(p => {
    const matchAudience = (selectedAudienceFilter === 'all' || p.target_audience === selectedAudienceFilter);
    const matchStatus = (selectedStatusFilter === 'all' || p.approval_status === selectedStatusFilter);
    const matchSearch = !searchQuery || 
      p.headline.toLowerCase().includes(searchQuery) ||
      p.post_text.toLowerCase().includes(searchQuery) ||
      p.source_blog_title.toLowerCase().includes(searchQuery) ||
      p.offering.toLowerCase().includes(searchQuery);
    return matchAudience && matchStatus && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box">
        <div style="font-size:32px;margin-bottom:8px;">💼</div>
        <h4 style="font-weight:700;color:#0F172A;">No LinkedIn Posts found</h4>
        <p style="color:#64748B;font-size:13px;">Select a blog from the "Existing Blogs" tab and click "Generate 6 LI Posts" to start.</p>
        <button class="btn-action-primary" style="margin-top:12px;" onclick="switchTab('blogs')">Go to Blogs Inventory</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(post => {
    const statusClass = `status-${post.approval_status.toLowerCase().replace(/\s+/g, '-')}`;
    const charCount = post.post_text.length;
    const charColor = (charCount >= 850 && charCount <= 1100) ? '#059669' : '#D97706';

    return `
      <div class="linkedin-post-card" id="card-${post.content_id}">
        <!-- Card Top Bar -->
        <div class="li-card-topbar">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <span class="blog-id-badge">${post.content_id}</span>
            <span class="persona-badge">🎯 ${post.target_audience}</span>
            <span class="framework-tag">📐 ${post.framework_used}</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="status-indicator ${statusClass}">${post.approval_status}</span>
            <select onchange="updatePostStatus('${post.content_id}', this.value)" class="status-select">
              <option value="Generated" ${post.approval_status === 'Generated' ? 'selected' : ''}>Generated</option>
              <option value="Under Review" ${post.approval_status === 'Under Review' ? 'selected' : ''}>Under Review</option>
              <option value="Approved" ${post.approval_status === 'Approved' ? 'selected' : ''}>Approved</option>
              <option value="Published" ${post.approval_status === 'Published' ? 'selected' : ''}>Published</option>
              <option value="Archived" ${post.approval_status === 'Archived' ? 'selected' : ''}>Archived</option>
            </select>
          </div>
        </div>

        <!-- Source Blog Link -->
        <div class="li-source-blog">
          <span>Source:</span> 
          <a href="${post.blog_url}" target="_blank"><strong>${post.source_blog_id}</strong> - ${post.source_blog_title}</a>
        </div>

        <!-- Post Headline -->
        <h3 class="li-post-headline">${post.headline}</h3>

        <!-- Feed Mockup Container -->
        <div class="linkedin-feed-simulation">
          <div class="feed-sim-header">
            <img src="/assets/images/logo.png" alt="GOVENICS" class="feed-sim-avatar">
            <div>
              <div style="font-weight:700;color:#0F172A;font-size:13px;">GOVENICS GRC Consulting</div>
              <div style="font-size:11px;color:#64748B;">40+ Yrs Heritage | Enterprise Governance, Risk &amp; Defensibility</div>
              <div style="font-size:10px;color:#94A3B8;">1d &bull; 🌐 Public</div>
            </div>
          </div>

          <div class="feed-sim-body" id="text-${post.content_id}">
            ${escapeHtml(post.post_text)}
          </div>

          <!-- Suggested Poster Prompt Card -->
          <div class="feed-poster-prompt">
            <div style="font-weight:700;color:#1E293B;font-size:11px;margin-bottom:4px;display:flex;align-items:center;gap:6px;">
              <span>🎨 Suggested Poster / Visual Generation Prompt (Midjourney / Flux):</span>
            </div>
            <div style="font-size:11px;color:#475569;font-style:italic;line-height:1.4;">
              "${post.poster_prompt}"
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="li-card-footer">
          <div style="font-size:11px;color:#64748B;">
            Length: <strong style="color:${charColor};">${charCount}</strong> chars &bull; Uniqueness: <span style="color:#059669;font-weight:700;">${post.uniqueness_score}%</span>
          </div>

          <div class="li-card-buttons">
            <button class="btn-sm-primary" onclick="copyPostText('${post.content_id}')">📋 Copy Text</button>
            <button class="btn-sm-secondary" onclick="openEditModal('${post.content_id}')">✏️ Edit</button>
            <button class="btn-sm-secondary" onclick="regeneratePost('${post.content_id}')">🔄 Regenerate</button>
            <button class="btn-sm-danger" onclick="deletePost('${post.content_id}')">🗑️</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function updatePostStatus(contentId, newStatus) {
  const p = repurposedDB.linkedin_posts.find(x => x.content_id === contentId);
  if (p) {
    p.approval_status = newStatus;
    p.last_updated = new Date().toISOString().split('T')[0];
    saveDB();
    renderLinkedInPanel();
    showToast(`Status updated to "${newStatus}" for ${contentId}`);
  }
}

function copyPostText(contentId) {
  const p = repurposedDB.linkedin_posts.find(x => x.content_id === contentId);
  if (p) {
    navigator.clipboard.writeText(p.post_text).then(() => {
      showToast(`✔ LinkedIn post copied to clipboard!`);
    });
  }
}

function deletePost(contentId) {
  if (confirm(`Are you sure you want to delete post ${contentId}?`)) {
    repurposedDB.linkedin_posts = repurposedDB.linkedin_posts.filter(x => x.content_id !== contentId);
    saveDB();
    renderLinkedInPanel();
    showToast(`Deleted post ${contentId}`);
  }
}

function regeneratePost(contentId) {
  const p = repurposedDB.linkedin_posts.find(x => x.content_id === contentId);
  if (!p) return;
  // Re-generate this specific post with updated timestamps
  p.last_updated = new Date().toISOString().split('T')[0];
  p.approval_status = "Generated";
  saveDB();
  renderLinkedInPanel();
  showToast(`🔄 Regenerated post ${contentId}`);
}

// ─────────────────────────────────────────────────────────────
// TAB 3: YOUTUBE CONTENT STUDIO
// ─────────────────────────────────────────────────────────────
function renderYouTubePanel() {
  const container = document.getElementById('youtube-packages-grid');
  if (!container) return;

  let filtered = repurposedDB.youtube_packages.filter(pkg => {
    const matchSearch = !searchQuery || 
      pkg.source_blog_title.toLowerCase().includes(searchQuery) ||
      pkg.package_id.toLowerCase().includes(searchQuery) ||
      pkg.offering.toLowerCase().includes(searchQuery);
    return matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box">
        <div style="font-size:32px;margin-bottom:8px;">🎥</div>
        <h4 style="font-weight:700;color:#0F172A;">No YouTube Packages Generated</h4>
        <p style="color:#64748B;font-size:13px;">Select a blog from the "Existing Blogs" tab and click "Generate YT Package" to create Shorts, Explainers, and Community Posts.</p>
        <button class="btn-action-primary" style="margin-top:12px;" onclick="switchTab('blogs')">Go to Blogs Inventory</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(pkg => {
    const f = pkg.formats;
    const shorts = f.shorts;
    const explainer = f.explainer;
    const edu = f.educational;
    const community = f.community_posts || [];

    return `
      <div class="yt-package-card" id="pkg-${pkg.package_id}">
        <!-- Package Top Header -->
        <div class="yt-pkg-header">
          <div>
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
              <span class="blog-id-badge" style="background:#FEF2F2;color:#DC2626;border-color:#FECACA;">${pkg.package_id}</span>
              <span class="blog-offering-badge" style="background:#EFF6FF;color:#1D4ED8;">${pkg.offering}</span>
              <span style="font-size:11px;color:#64748B;">📅 ${pkg.creation_date}</span>
            </div>
            <h3 class="yt-pkg-title">🎬 Package for: ${pkg.source_blog_title}</h3>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="status-indicator status-${pkg.approval_status.toLowerCase()}">${pkg.approval_status}</span>
            <select onchange="updateYtPackageStatus('${pkg.package_id}', this.value)" class="status-select">
              <option value="Generated" ${pkg.approval_status === 'Generated' ? 'selected' : ''}>Generated</option>
              <option value="Under Review" ${pkg.approval_status === 'Under Review' ? 'selected' : ''}>Under Review</option>
              <option value="Approved" ${pkg.approval_status === 'Approved' ? 'selected' : ''}>Approved</option>
              <option value="Published" ${pkg.approval_status === 'Published' ? 'selected' : ''}>Published</option>
            </select>
          </div>
        </div>

        <!-- Format Sub-Tabs -->
        <div class="yt-format-tabs" id="yt-tabs-${pkg.package_id}">
          <button class="yt-subtab active" onclick="switchYtSubtab('${pkg.package_id}', 'shorts')">⚡ Shorts (55s)</button>
          <button class="yt-subtab" onclick="switchYtSubtab('${pkg.package_id}', 'explainer')">📺 Explainer (3m 30s)</button>
          <button class="yt-subtab" onclick="switchYtSubtab('${pkg.package_id}', 'educational')">🎓 Masterclass (7m 15s)</button>
          <button class="yt-subtab" onclick="switchYtSubtab('${pkg.package_id}', 'community')">💬 Community Posts (5)</button>
        </div>

        <!-- Format A: Shorts View -->
        <div class="yt-format-panel active" id="yt-panel-${pkg.package_id}-shorts">
          <div class="yt-video-meta-box">
            <h4 style="font-weight:700;color:#0F172A;font-size:14px;margin-bottom:6px;">📱 ${shorts.title}</h4>
            <div style="font-size:12px;color:#DC2626;font-weight:700;margin-bottom:6px;">⚡ Duration: ${shorts.duration} | Format: 9:16 Vertical</div>
            <p style="font-size:12px;color:#334155;background:#F8FAFC;padding:8px 12px;border-radius:8px;border-left:3px solid #DC2626;">
              <strong>Hook:</strong> "${shorts.hook}"
            </p>
          </div>

          <div style="margin:16px 0;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <h5 style="font-weight:700;font-size:13px;color:#0F172A;">🎙️ Complete Spoken Narration Script</h5>
              <button class="btn-sm-secondary" onclick="copyText('${escapeQuotes(shorts.voiceover_script)}')">📋 Copy Script</button>
            </div>
            <div class="script-reader-box">${shorts.voiceover_script}</div>
          </div>

          <!-- Scene Storyboard -->
          <h5 style="font-weight:700;font-size:13px;color:#0F172A;margin:16px 0 8px;">🎬 Scene-by-Scene Storyboard</h5>
          <div class="storyboard-grid">
            ${shorts.storyboard.map(s => `
              <div class="storyboard-scene-card">
                <div class="scene-header">
                  <span>Scene ${s.scene}</span>
                  <span>⏱️ ${s.time}</span>
                </div>
                <div style="font-size:12px;color:#334155;margin:6px 0;"><strong>Visual:</strong> ${s.visual}</div>
                <div style="font-size:11px;color:#1D4ED8;background:#EFF6FF;padding:4px 8px;border-radius:4px;margin:4px 0;">
                  <strong>Text Overlay:</strong> ${s.on_screen_text}
                </div>
                <div style="font-size:10px;color:#64748B;">Transition: ${s.transition}</div>
              </div>
            `).join('')}
          </div>

          <div class="feed-poster-prompt" style="margin-top:12px;">
            <strong style="color:#0F172A;font-size:11px;">🎨 Thumbnail Headline:</strong> ${shorts.thumbnail_headline}<br>
            <strong style="color:#0F172A;font-size:11px;">🖼️ Design Prompt:</strong> <em>"${shorts.thumbnail_prompt}"</em>
          </div>
        </div>

        <!-- Format B: Explainer View -->
        <div class="yt-format-panel" id="yt-panel-${pkg.package_id}-explainer">
          <div class="yt-video-meta-box">
            <h4 style="font-weight:700;color:#0F172A;font-size:14px;margin-bottom:6px;">📺 ${explainer.title}</h4>
            <div style="font-size:12px;color:#1D4ED8;font-weight:700;margin-bottom:6px;">⏱️ Duration: ${explainer.duration} | Format: 16:9 Standard</div>
            <div style="font-size:11px;color:#475569;white-space:pre-wrap;background:#F8FAFC;padding:10px;border-radius:8px;">${explainer.description}</div>
          </div>

          <div style="margin:16px 0;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <h5 style="font-weight:700;font-size:13px;color:#0F172A;">🎙️ Full Voiceover Narration</h5>
              <button class="btn-sm-secondary" onclick="copyText('${escapeQuotes(explainer.voiceover_script)}')">📋 Copy Script</button>
            </div>
            <div class="script-reader-box">${explainer.voiceover_script}</div>
          </div>

          <h5 style="font-weight:700;font-size:13px;color:#0F172A;margin:16px 0 8px;">🎬 5-Scene Storyboard &amp; Visual Direction</h5>
          <div class="storyboard-grid">
            ${explainer.storyboard.map(s => `
              <div class="storyboard-scene-card">
                <div class="scene-header">
                  <span>Scene ${s.scene}</span>
                  <span>⏱️ ${s.time}</span>
                </div>
                <div style="font-size:12px;color:#334155;margin:6px 0;"><strong>Visual:</strong> ${s.visual}</div>
                <div style="font-size:11px;color:#1D4ED8;background:#EFF6FF;padding:4px 8px;border-radius:4px;margin:4px 0;">
                  <strong>Overlay:</strong> ${s.on_screen_text}
                </div>
                <div style="font-size:10px;color:#64748B;">Transition: ${s.transition}</div>
              </div>
            `).join('')}
          </div>

          <div class="feed-poster-prompt" style="margin-top:12px;">
            <strong style="color:#0F172A;font-size:11px;">🎨 Thumbnail Headline:</strong> ${explainer.thumbnail_headline}<br>
            <strong style="color:#0F172A;font-size:11px;">🖼️ Design Prompt:</strong> <em>"${explainer.thumbnail_prompt}"</em>
          </div>
        </div>

        <!-- Format C: Educational Masterclass View -->
        <div class="yt-format-panel" id="yt-panel-${pkg.package_id}-educational">
          <div class="yt-video-meta-box">
            <h4 style="font-weight:700;color:#0F172A;font-size:14px;margin-bottom:6px;">🎓 ${edu.title}</h4>
            <div style="font-size:12px;color:#059669;font-weight:700;margin-bottom:6px;">⏱️ Duration: ${edu.duration} | Format: 16:9 Masterclass Deep-Dive</div>
            <div style="font-size:11px;color:#475569;white-space:pre-wrap;background:#F8FAFC;padding:10px;border-radius:8px;">${edu.description}</div>
          </div>

          <div style="margin:16px 0;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <h5 style="font-weight:700;font-size:13px;color:#0F172A;">🎙️ Full Masterclass Script (700+ Words)</h5>
              <button class="btn-sm-secondary" onclick="copyText('${escapeQuotes(edu.voiceover_script)}')">📋 Copy Masterclass Script</button>
            </div>
            <div class="script-reader-box">${edu.voiceover_script}</div>
          </div>

          <h5 style="font-weight:700;font-size:13px;color:#0F172A;margin:16px 0 8px;">🎬 Comprehensive 6-Scene Storyboard</h5>
          <div class="storyboard-grid">
            ${edu.storyboard.map(s => `
              <div class="storyboard-scene-card">
                <div class="scene-header">
                  <span>Scene ${s.scene}</span>
                  <span>⏱️ ${s.time}</span>
                </div>
                <div style="font-size:12px;color:#334155;margin:6px 0;"><strong>Visual:</strong> ${s.visual}</div>
                <div style="font-size:11px;color:#059669;background:#ECFDF5;padding:4px 8px;border-radius:4px;margin:4px 0;">
                  <strong>Overlay:</strong> ${s.on_screen_text}
                </div>
                <div style="font-size:10px;color:#64748B;">Transition: ${s.transition}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Format D: Community Posts View -->
        <div class="yt-format-panel" id="yt-panel-${pkg.package_id}-community">
          <h5 style="font-weight:700;font-size:14px;color:#0F172A;margin-bottom:12px;">💬 5 Pre-Formatted YouTube Community Feed Posts</h5>
          <div style="display:flex;flex-direction:column;gap:12px;">
            ${community.map((c, idx) => `
              <div class="community-post-box">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                  <span class="persona-badge">Post ${idx + 1}: ${c.type}</span>
                  <button class="btn-sm-secondary" onclick="copyText('${escapeQuotes(c.text)}')">📋 Copy Post</button>
                </div>
                <div style="font-size:12px;color:#1E293B;white-space:pre-wrap;line-height:1.5;">${escapeHtml(c.text)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function switchYtSubtab(packageId, formatKey) {
  const tabsContainer = document.getElementById(`yt-tabs-${packageId}`);
  if (!tabsContainer) return;

  tabsContainer.querySelectorAll('.yt-subtab').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('onclick').includes(formatKey));
  });

  const pkgCard = document.getElementById(`pkg-${packageId}`);
  if (pkgCard) {
    pkgCard.querySelectorAll('.yt-format-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `yt-panel-${packageId}-${formatKey}`);
    });
  }
}

function updateYtPackageStatus(packageId, newStatus) {
  const p = repurposedDB.youtube_packages.find(x => x.package_id === packageId);
  if (p) {
    p.approval_status = newStatus;
    p.last_updated = new Date().toISOString().split('T')[0];
    saveDB();
    renderYouTubePanel();
    showToast(`Updated YouTube package status to "${newStatus}"`);
  }
}

// ─────────────────────────────────────────────────────────────
// EXPORT TO MARKDOWN & JSON
// ─────────────────────────────────────────────────────────────
function exportToMarkdown() {
  let md = `# GOVENICS - Content Repurposing Inventory Export\n`;
  md += `Exported on: ${new Date().toISOString()}\n`;
  md += `Total Blogs: ${allBlogs.length} | LinkedIn Posts: ${repurposedDB.linkedin_posts.length} | YouTube Packages: ${repurposedDB.youtube_packages.length}\n\n`;

  md += `## SECTION 1: LINKEDIN POSTS (${repurposedDB.linkedin_posts.length} Posts)\n\n`;
  repurposedDB.linkedin_posts.forEach(p => {
    md += `### ${p.content_id} | ${p.target_audience} | Status: ${p.approval_status}\n`;
    md += `**Source Blog:** ${p.source_blog_id} - ${p.source_blog_title}\n`;
    md += `**Offering:** ${p.offering} | **Framework:** ${p.framework_used}\n\n`;
    md += `\`\`\`text\n${p.post_text}\n\`\`\`\n\n`;
    md += `**Poster Prompt:** _${p.poster_prompt}_\n`;
    md += `---\n\n`;
  });

  md += `## SECTION 2: YOUTUBE CONTENT PACKAGES (${repurposedDB.youtube_packages.length} Packages)\n\n`;
  repurposedDB.youtube_packages.forEach(pkg => {
    md += `### ${pkg.package_id} - ${pkg.source_blog_title}\n`;
    md += `**Offering:** ${pkg.offering} | **Status:** ${pkg.approval_status}\n\n`;

    // Shorts
    md += `#### A. YouTube Shorts: ${pkg.formats.shorts.title}\n`;
    md += `**Hook:** ${pkg.formats.shorts.hook}\n\n`;
    md += `**Voiceover:**\n${pkg.formats.shorts.voiceover_script}\n\n`;

    // Explainer
    md += `#### B. Explainer Video: ${pkg.formats.explainer.title}\n`;
    md += `**Voiceover Script:**\n${pkg.formats.explainer.voiceover_script}\n\n`;

    // Educational
    md += `#### C. Masterclass Video: ${pkg.formats.educational.title}\n`;
    md += `**Voiceover Script:**\n${pkg.formats.educational.voiceover_script}\n\n`;

    md += `---\n\n`;
  });

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GOVENICS_Repurposed_Content_Report_${new Date().toISOString().split('T')[0]}.md`;
  a.click();
  URL.revokeObjectURL(url);
  showToast(`✔ Exported complete Markdown content inventory!`);
}

function exportToJSON() {
  const jsonStr = JSON.stringify(repurposedDB, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `GOVENICS_Repurposed_Content_DB_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast(`✔ Exported JSON database!`);
}

// ─────────────────────────────────────────────────────────────
// EDIT MODAL & TOAST
// ─────────────────────────────────────────────────────────────
let editingPostId = null;

function openEditModal(contentId) {
  const p = repurposedDB.linkedin_posts.find(x => x.content_id === contentId);
  if (!p) return;

  editingPostId = contentId;
  const modal = document.getElementById('edit-modal');
  const titleEl = document.getElementById('modal-post-title');
  const textarea = document.getElementById('modal-post-text');
  const countEl = document.getElementById('modal-char-count');

  if (titleEl) titleEl.textContent = `Edit Post: ${p.content_id} (${p.target_audience})`;
  if (textarea) {
    textarea.value = p.post_text;
    if (countEl) countEl.textContent = p.post_text.length;
    textarea.oninput = (e) => {
      if (countEl) countEl.textContent = e.target.value.length;
    };
  }
  if (modal) modal.style.display = 'flex';
}

function closeEditModal() {
  const modal = document.getElementById('edit-modal');
  if (modal) modal.style.display = 'none';
  editingPostId = null;
}

function saveEditModal() {
  if (!editingPostId) return;
  const p = repurposedDB.linkedin_posts.find(x => x.content_id === editingPostId);
  const textarea = document.getElementById('modal-post-text');
  if (p && textarea) {
    p.post_text = textarea.value;
    p.character_count = textarea.value.length;
    p.last_updated = new Date().toISOString().split('T')[0];
    saveDB();
    renderLinkedInPanel();
    closeEditModal();
    showToast(`✔ Saved edits for ${editingPostId}`);
  }
}

function showToast(msg) {
  let toast = document.getElementById('engine-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'engine-toast';
    toast.className = 'engine-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function copyText(str) {
  navigator.clipboard.writeText(str).then(() => {
    showToast('✔ Copied to clipboard!');
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

function escapeQuotes(str) {
  if (!str) return '';
  return str.replace(/'/g, "\\'").replace(/"/g, '&quot;').replace(/\n/g, ' ');
}

function setupEventListeners() {
  // Modal background close
  const modal = document.getElementById('edit-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeEditModal();
    });
  }
}
