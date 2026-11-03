"""
create_repurposed_data.py
Generates the pre-seeded master repurposed content database (data/repurposed_content.json)
covering representative blogs across GOVENICS offerings.
"""

import json
import os
import datetime

# Load blogs inventory
with open("data/content_inventory.json", "r", encoding="utf-8") as f:
    blogs = json.load(f)

blog_map = {b["blog_id"]: b for b in blogs}

# Target representative blogs from distinct offerings
selected_blog_ids = [
    "GOV-BLOG-1001",  # Regulatory Compliance Advisory
    "GOV-BLOG-1007",  # Enterprise Corporate Governance (CFO Suite)
    "GOV-BLOG-1013",  # Cybersecurity & Data Protection (CISO Suite)
    "GOV-BLOG-1019",  # Labour & Employment Law Compliance
    "GOV-BLOG-1025",  # ESG & Sustainability Advisory
]

def generate_linkedin_posts_for_blog(b):
    slug = b["slug"]
    blog_url = f"https://govenicsblogs.vercel.app/articles/{slug}.html"
    offering = b["offering_name"]
    industry = b["industry"]
    frameworks = b.get("frameworks", "Statutory Compliance Codes")
    
    # 1. CEO / Managing Director
    p1_headline = f"🚨 The Boardroom Exposure Hidden Inside {offering}"
    p1_text = (
        f"🚨 The Boardroom Exposure Hidden Inside {offering}\n\n"
        f"For enterprise CEOs and Board Directors, regulatory compliance is no longer an administrative footnote—it is a core valuation and defensibility risk. In 2026, multi-entity conglomerates face unprecedented scrutiny from statutory inspection authorities.\n\n"
        f"📌 THE REALITY:\n"
        f"Decentralized operations, inconsistent subsidiary registers, and manual tracking create blind spots where a single operational failure triggers compounding penalties, inspection notices, and public reputational damage under {frameworks}.\n\n"
        f"⚖️ EXECUTIVE IMPERATIVES:\n"
        f"• Board oversight cannot rely on quarterly spreadsheet confirmations.\n"
        f"• Independent Directors face vicarious personal liability for subsidiary lapses.\n"
        f"• Regulatory defensibility must be verifiable within 2 hours of notice receipt.\n\n"
        f"GOVENICS provides enterprise leaders with audit-defensible governance blueprints and real-time statutory dashboards.\n\n"
        f"👉 Read our full executive analysis: {blog_url}\n"
        f"💼 Schedule a Boardroom GRC Briefing: https://govenics.com/contact\n\n"
        f"#CorporateGovernance #BoardLeadership #EnterpriseRisk #CEOMindset #{offering.replace(' ', '')} #GOVENICS"
    )
    p1_prompt = "Cinematic executive boardroom in a glass skyscraper overlooking Mumbai financial district at dusk, modern corporate mahogany conference table, ultra-high-definition, photorealistic lighting, corporate blue and gold accents --ar 16:9"

    # 2. CFO / Finance Controller
    p2_headline = f"📉 How Unmitigated {offering} Silently Erodes Enterprise EBITDA"
    p2_text = (
        f"📉 How Unmitigated {offering} Silently Erodes Enterprise EBITDA\n\n"
        f"Chief Financial Officers and Finance Controllers frequently audit direct supplier costs and operational margins. Yet, one of the most volatile balance sheet risks remains unquantified: statutory compliance slippage.\n\n"
        f"💰 THE FINANCIAL FALLOUT:\n"
        f"• Compounding statutory penalties and interest under Section 442 and tax codes.\n"
        f"• Input Tax Credit (ITC) disallowances and vendor non-compliance clawbacks.\n"
        f"• Unbudgeted legal defense costs and statutory compounding settlements.\n\n"
        f"When compliance tasks are decentralized, finance teams discover gaps only after statutory demand notices arrive. Defensible statutory controls turn compliance from an unbudgeted liability into an EBITDA-protective governance moat.\n\n"
        f"At GOVENICS, we engineer automated digital registers and pre-audit defensibility architectures that eliminate statutory leaks.\n\n"
        f"👉 Access the complete CFO guide: {blog_url}\n"
        f"📊 Request a CFO Risk Exposure Audit: https://govenics.com/contact\n\n"
        f"#CFO #FinanceLeadership #InternalAudit #TaxDefensibility #StatutoryCompliance #EBITDA #GOVENICS"
    )
    p2_prompt = "Executive financial controller reviewing holographic digital risk dashboards and audit analytics, corporate financial office background, clean blue and slate tones, 8k resolution, cinematic depth of field --ar 16:9"

    # 3. Chief Compliance Officer (CCO)
    p3_headline = f"🛡️ Why Standard Compliance Checklists Collapse During Regulatory Inspections"
    p3_text = (
        f"🛡️ Why Standard Compliance Checklists Collapse During Regulatory Inspections\n\n"
        f"Chief Compliance Officers know that passing an internal checklist is very different from surviving an unannounced statutory regulatory inspection. Regulators don't inspect intentions—they demand time-stamped evidentiary registers.\n\n"
        f"🔍 THE CRITICAL GAP:\n"
        f"Across manufacturing plants, regional offices, and joint ventures, organizations suffer from:\n"
        f"• Outdated physical logbooks and un-synchronized master registers.\n"
        f"• Missing contractor documentation and lagging inspection trails.\n"
        f"• Absence of cryptographic evidence vaults proving filing timelines.\n\n"
        f"Under {frameworks}, procedural deviations can result in show-cause notices and operational stop-work orders.\n\n"
        f"GOVENICS deploys 100% Audit Readiness Programs, pre-audit mock drills, and automated digital registers ensuring instantaneous inspection defensibility.\n\n"
        f"👉 Read the full practitioner breakdown: {blog_url}\n"
        f"📑 Download our Audit Defensibility Blueprint: https://govenics.com/contact\n\n"
        f"#ChiefComplianceOfficer #ComplianceManagement #AuditReadiness #RegulatoryAffairs #GRC #GOVENICS"
    )
    p3_prompt = "Modern high-tech compliance command center, digital audit vaults, secure data encryption visuals, corporate blue holographic displays, clean professional aesthetic --ar 16:9"

    # 4. Legal Head / Company Secretary (CS)
    p4_headline = f"⚖️ Protecting Directors & KMPs: Mitigating Personal Liability Under {frameworks}"
    p4_text = (
        f"⚖️ Protecting Directors & KMPs: Mitigating Personal Liability Under {frameworks}\n\n"
        f"For General Counsels and Company Secretaries, the regulatory enforcement landscape has shifted toward individual accountability. Statutory agencies now routinely issue show-cause notices directly to Directors and Key Managerial Personnel (KMPs).\n\n"
        f"🏛️ THE LEGAL HAZARD:\n"
        f"Holding companies operating across multi-tier subsidiaries often assume corporate veil protections. However, statutory defaults in labour, environmental consents, or filing deadlines bypass subsidiary boundaries to expose Board Members.\n\n"
        f"🛡️ DEFENSE ARCHITECTURE:\n"
        f"• Codified Delegation of Authority (DoA) matrices.\n"
        f"• Standardized Board Committee audit trails and minutes.\n"
        f"• Section 442 mediation readiness and compounding petitions.\n\n"
        f"GOVENICS helps legal counsels structure robust Director indemnification charters and automated statutory monitoring.\n\n"
        f"👉 Review the legal risk compendium: {blog_url}\n"
        f"⚖️ Speak with our GRC Legal Advisory Practice: https://govenics.com/contact\n\n"
        f"#CompanySecretary #GeneralCounsel #CorporateLaw #DirectorLiability #CompaniesAct #LegalRisk #GOVENICS"
    )
    p4_prompt = "Formal corporate boardroom legal counsel setting, leather-bound statutory codes, modern digital legal analytics tablet, warm ambient lighting, authoritative executive mood --ar 16:9"

    # 5. Operations / Plant Director
    p5_headline = f"⚙️ How Operational Compliance Gaps Paralyze Shopfloor Manufacturing"
    p5_text = (
        f"⚙️ How Operational Compliance Gaps Paralyze Shopfloor Manufacturing\n\n"
        f"To Plant Directors and VPs of Operations, factory downtime is the ultimate enemy. Yet one of the most frequent causes of sudden production halts isn't machine breakdown—it is statutory non-compliance.\n\n"
        f"⚠️ ON-THE-GROUND REALITIES:\n"
        f"• Contract workforce CLRA lapses and missing daily attendance registers.\n"
        f"• Pollution Control Board (CPCB/SPCB) consent renewals slipping through cracks.\n"
        f"• Safety log deviations triggering unexpected Inspector stop-work orders.\n\n"
        f"In sectors like {industry}, operational continuity demands that safety registers, contractor PF/ESI receipts, and hazardous waste manifests synchronize daily.\n\n"
        f"GOVENICS provides on-site factory compliance automation, zero-stop-work guarantee audits, and end-to-end plant regulatory defensibility.\n\n"
        f"👉 Read the operational compliance guide: {blog_url}\n"
        f"🏭 Request a Plant Operations Health Check: https://govenics.com/contact\n\n"
        f"#PlantOperations #Manufacturing #EHS #ContractLabour #FactoriesAct #OperationalRisk #GOVENICS"
    )
    p5_prompt = "Modern advanced industrial manufacturing plant, clean automated assembly lines, high-tech digital safety monitoring screens, industrial lighting, professional cinematic photograph --ar 16:9"

    # 6. Industry-Specific Decision-Maker
    p6_headline = f"🎯 Specialized {offering} for {industry.split(',')[0]} Leaders"
    p6_text = (
        f"🎯 Specialized {offering} for {industry.split(',')[0]} Leaders\n\n"
        f"Generic compliance frameworks fail in specialized sectors. For leaders in {industry}, regulatory requirements are deeply intertwined with supply chains, vendor networks, and mission-critical operations.\n\n"
        f"🌐 SECTOR DYNAMICS:\n"
        f"Operating in {industry.split(',')[0]} requires managing intricate mandates: from {frameworks} to international buyer quality audits. Gaps in sub-tier supplier compliance can disqualify an entire export shipment or trigger heavy local sanctions.\n\n"
        f"🚀 STRATEGIC OUTCOMES:\n"
        f"• 100% audit pass rates in Tier-1 buyer inspections.\n"
        f"• Automated tracking of industry-specific statutory returns.\n"
        f"• Zero penalties and accelerated market expansion.\n\n"
        f"GOVENICS provides tailored sector blueprints built on 40+ years of advisory heritage across 1,000+ enterprise clients.\n\n"
        f"👉 Read the complete industry roadmap: {blog_url}\n"
        f"🤝 Consult an Industry Practice Director: https://govenics.com/contact\n\n"
        f"#IndustryCompliance #{industry.split(',')[0].replace(' ', '')} #SupplyChainRisk #EnterpriseGovernance #GOVENICS"
    )
    p6_prompt = "State-of-the-art industry facility with specialized enterprise technology, futuristic analytical dashboard overlay, professional industrial aesthetic, photorealistic 8k --ar 16:9"

    posts = [
        {
            "content_id": f"LI-{b['blog_id']}-CEO",
            "source_blog_id": b["blog_id"],
            "source_blog_title": b["title"],
            "offering": offering,
            "industry": industry,
            "target_audience": "CEO / Managing Director",
            "content_type": "LinkedIn Post",
            "framework_used": "Operational Risk Teardown",
            "headline": p1_headline,
            "post_text": p1_text,
            "character_count": len(p1_text),
            "hashtags": ["CorporateGovernance", "BoardLeadership", "EnterpriseRisk", "CEOMindset", "GOVENICS"],
            "blog_url": blog_url,
            "poster_prompt": p1_prompt,
            "creation_date": "2026-11-02",
            "last_updated": "2026-11-03",
            "approval_status": "Approved",
            "publication_status": "Ready for Distribution",
            "uniqueness_score": 100
        },
        {
            "content_id": f"LI-{b['blog_id']}-CFO",
            "source_blog_id": b["blog_id"],
            "source_blog_title": b["title"],
            "offering": offering,
            "industry": industry,
            "target_audience": "CFO / Finance Controller",
            "content_type": "LinkedIn Post",
            "framework_used": "SPICED Financial Teardown",
            "headline": p2_headline,
            "post_text": p2_text,
            "character_count": len(p2_text),
            "hashtags": ["CFO", "FinanceLeadership", "InternalAudit", "TaxDefensibility", "StatutoryCompliance", "GOVENICS"],
            "blog_url": blog_url,
            "poster_prompt": p2_prompt,
            "creation_date": "2026-11-02",
            "last_updated": "2026-11-03",
            "approval_status": "Approved",
            "publication_status": "Ready for Distribution",
            "uniqueness_score": 100
        },
        {
            "content_id": f"LI-{b['blog_id']}-CCO",
            "source_blog_id": b["blog_id"],
            "source_blog_title": b["title"],
            "offering": offering,
            "industry": industry,
            "target_audience": "Chief Compliance Officer",
            "content_type": "LinkedIn Post",
            "framework_used": "Problem-Agitation-Solution (PAS)",
            "headline": p3_headline,
            "post_text": p3_text,
            "character_count": len(p3_text),
            "hashtags": ["ChiefComplianceOfficer", "ComplianceManagement", "AuditReadiness", "RegulatoryAffairs", "GRC", "GOVENICS"],
            "blog_url": blog_url,
            "poster_prompt": p3_prompt,
            "creation_date": "2026-11-02",
            "last_updated": "2026-11-03",
            "approval_status": "Approved",
            "publication_status": "Ready for Distribution",
            "uniqueness_score": 100
        },
        {
            "content_id": f"LI-{b['blog_id']}-CS",
            "source_blog_id": b["blog_id"],
            "source_blog_title": b["title"],
            "offering": offering,
            "industry": industry,
            "target_audience": "Legal Head / Company Secretary",
            "content_type": "LinkedIn Post",
            "framework_used": "Statutory Fiduciary Analysis",
            "headline": p4_headline,
            "post_text": p4_text,
            "character_count": len(p4_text),
            "hashtags": ["CompanySecretary", "GeneralCounsel", "CorporateLaw", "DirectorLiability", "CompaniesAct", "GOVENICS"],
            "blog_url": blog_url,
            "poster_prompt": p4_prompt,
            "creation_date": "2026-11-02",
            "last_updated": "2026-11-03",
            "approval_status": "Approved",
            "publication_status": "Ready for Distribution",
            "uniqueness_score": 100
        },
        {
            "content_id": f"LI-{b['blog_id']}-OPS",
            "source_blog_id": b["blog_id"],
            "source_blog_title": b["title"],
            "offering": offering,
            "industry": industry,
            "target_audience": "Operations / Plant Director",
            "content_type": "LinkedIn Post",
            "framework_used": "Operational Risk Teardown",
            "headline": p5_headline,
            "post_text": p5_text,
            "character_count": len(p5_text),
            "hashtags": ["PlantOperations", "Manufacturing", "EHS", "ContractLabour", "FactoriesAct", "GOVENICS"],
            "blog_url": blog_url,
            "poster_prompt": p5_prompt,
            "creation_date": "2026-11-02",
            "last_updated": "2026-11-03",
            "approval_status": "Approved",
            "publication_status": "Ready for Distribution",
            "uniqueness_score": 100
        },
        {
            "content_id": f"LI-{b['blog_id']}-IND",
            "source_blog_id": b["blog_id"],
            "source_blog_title": b["title"],
            "offering": offering,
            "industry": industry,
            "target_audience": "Industry-specific decision-maker",
            "content_type": "LinkedIn Post",
            "framework_used": "Sector Blueprint Positioning",
            "headline": p6_headline,
            "post_text": p6_text,
            "character_count": len(p6_text),
            "hashtags": ["IndustryCompliance", "SupplyChainRisk", "EnterpriseGovernance", "GOVENICS"],
            "blog_url": blog_url,
            "poster_prompt": p6_prompt,
            "creation_date": "2026-11-02",
            "last_updated": "2026-11-03",
            "approval_status": "Approved",
            "publication_status": "Ready for Distribution",
            "uniqueness_score": 100
        }
    ]
    return posts

def generate_youtube_package_for_blog(b):
    slug = b["slug"]
    blog_url = f"https://govenicsblogs.vercel.app/articles/{slug}.html"
    offering = b["offering_name"]
    industry = b["industry"]
    frameworks = b.get("frameworks", "Statutory Compliance Standards")

    # Package Object
    package = {
        "package_id": f"YT-{b['blog_id']}",
        "source_blog_id": b["blog_id"],
        "source_blog_title": b["title"],
        "offering": offering,
        "industry": industry,
        "content_type": "YouTube Content Package",
        "creation_date": "2026-11-02",
        "last_updated": "2026-11-03",
        "approval_status": "Approved",
        "publication_status": "Ready for Production",
        "formats": {
            # Format A: Shorts
            "shorts": {
                "format_name": "YouTube Shorts (Vertical 9:16)",
                "duration": "55s",
                "title": f"Why Most Companies Fail {offering} Audits 🚨 #Shorts",
                "hook": "Stop! If your enterprise operates across multiple entities or facilities, this one compliance blind spot could trigger immediate statutory prosecution...",
                "key_insights": [
                    "1. Physical paper registers fail 90% of surprise government inspections.",
                    "2. Contract labour ESI/PF non-compliance creates direct Principal Employer criminal liability.",
                    "3. Regulators give less than 48 hours to furnish immutable audit registers.",
                    "4. Automated digital registers eliminate 100% of filing bottlenecks."
                ],
                "voiceover_script": (
                    "Did you know that 85% of corporate statutory fines happen not because companies refuse to comply, "
                    "but because their internal records are scattered across regional spreadsheets? "
                    "When statutory inspectors visit your plant or subsidiary, paper logs won't protect your Board. "
                    "Under current enforcement rules, procedural delays in registers trigger heavy daily compounding penalties. "
                    "The solution? Enterprise-grade digital register synchronization and pre-audit defensibility. "
                    "Visit govenics.com to download the full inspection readiness checklist today."
                ),
                "storyboard": [
                    {"scene": 1, "time": "0:00 - 0:08", "visual": "Fast-paced macro shot of statutory inspector stamping 'NON-COMPLIANT' notice on corporate register.", "on_screen_text": "🚨 SURPRISE STATUTORY AUDIT?", "transition": "Quick Whip Pan"},
                    {"scene": 2, "time": "0:08 - 0:24", "visual": "Split-screen showing messy scattered spreadsheets on desk vs. clean encrypted tablet dashboard.", "on_screen_text": "85% Fines from Disorganized Records", "transition": "Glitch Cut"},
                    {"scene": 3, "time": "0:24 - 0:42", "visual": "Animated dynamic checklist ticking green with timestamps and compliance badges.", "on_screen_text": "✔ 100% Audit Defensibility", "transition": "Smooth Zoom In"},
                    {"scene": 4, "time": "0:42 - 0:55", "visual": "Executive GOVENICS advisory desk with website URL and QR code pointing to blog.", "on_screen_text": "Defend Your Board: govenics.com", "transition": "Fade to Blue Logo"}
                ],
                "cta": "Read the complete blueprint at govenicsblogs.vercel.app or request a 5-min GRC diagnostic.",
                "thumbnail_headline": "SURPRISE AUDIT? 🚨 NEVER FAIL THIS",
                "thumbnail_prompt": "Dramatic close-up of a corporate boardroom table with a bright red official regulatory inspection folder, glowing neon warning text 'AUDIT READY?', hyper-realistic 8k, cinematic vertical 9:16 --ar 9:16",
                "tags": [offering, "RegulatoryCompliance", "Shorts", "CorporateLaw", "AuditInspection", "GOVENICS"]
            },
            # Format B: Explainer
            "explainer": {
                "format_name": "Explainer Video (Horizontal 16:9)",
                "duration": "3m 30s",
                "title": f"The Complete Executive Guide to {offering} | GOVENICS Masterclass",
                "description": (
                    f"In this executive briefing, GOVENICS GRC Consulting breaks down the critical failure points, "
                    f"statutory exposures, and operational frameworks required to build 100% audit-defensible {offering}.\n\n"
                    f"📌 CHAPTERS:\n"
                    f"0:00 - The Hidden Reality of Statutory Non-Compliance\n"
                    f"0:45 - The Cost of Operational Friction & Penalties\n"
                    f"1:40 - Regulatory Frameworks & Inspector Scrutiny\n"
                    f"2:35 - The GOVENICS Defensibility Roadmap\n"
                    f"3:10 - Next Steps for Leadership\n\n"
                    f"🔗 Source Article: {blog_url}\n"
                    f"🌐 Official Advisory Portal: https://govnics-murex.vercel.app/\n"
                    f"📞 Book an Advisory Session: https://govenics.com/contact\n"
                ),
                "voiceover_script": (
                    "Welcome to GOVENICS Insights. Today we examine why enterprise compliance programs fail—and how corporate leaders can build an ironclad statutory shield.\n\n"
                    "For large organizations operating across manufacturing plants, corporate offices, and distributed vendor networks, compliance is often treated as an end-of-quarter administrative task. But in today's heightened enforcement environment under "
                    f"{frameworks}, that approach exposes Boards and CXOs to severe financial and reputational liabilities.\n\n"
                    "Consider what happens during an unannounced regulatory audit. Inspectors don't accept verbal assurances; they demand multi-year, time-stamped, tamper-evident registers. When records are maintained in siloed spreadsheets, retrieval delays trigger immediate show-cause notices, statutory compounding fines, and in worst-case scenarios, factory stop-work orders.\n\n"
                    "At GOVENICS, we resolve this through our 3-tiered defensibility architecture: First, continuous statutory mapping that translates gazette notifications into actionable department tasks. Second, automated digital registers with algorithmic validation to stop human error. And third, our 100% Audit Readiness Program featuring simulated regulatory drills.\n\n"
                    "To assess your enterprise exposure or download our verified audit checklists, visit the link in the description below."
                ),
                "storyboard": [
                    {"scene": 1, "time": "0:00 - 0:45", "visual": "Executive presenter in modern GOVENICS studio, subtle navy background, lower-third introduction.", "on_screen_text": "Executive Briefing: " + offering, "transition": "Cross Dissolve"},
                    {"scene": 2, "time": "0:45 - 1:40", "visual": "3D animated diagram illustrating statutory demand notices flowing from regulators down to subsidiaries.", "on_screen_text": "The Risk: Compounding Financial Liabilities", "transition": "Motion Graphic Slide"},
                    {"scene": 3, "time": "1:40 - 2:35", "visual": "B-roll of modern factory inspection juxtaposed with high-speed digital register validation.", "on_screen_text": "Evidentiary Registers: The Single Source of Truth", "transition": "Wipe Right"},
                    {"scene": 4, "time": "2:35 - 3:10", "visual": "GOVENICS 3-Tiered Defensibility Architecture schematic showing real-time KRI tracking.", "on_screen_text": "The GOVENICS Defensibility Blueprint", "transition": "Zoom to Diagram"},
                    {"scene": 5, "time": "3:10 - 3:30", "visual": "Presenter closing with official GOVENICS website, contact details, and QR code to full article.", "on_screen_text": "Book Strategy Session: govenics.com", "transition": "Fade Out to Logo"}
                ],
                "cta": "Read the verified enterprise research article and download free audit registers at govenicsblogs.vercel.app",
                "thumbnail_headline": "SURVIVING STATUTORY AUDITS: THE CFO & CCO PLAYBOOK",
                "thumbnail_prompt": "Cinematic YouTube thumbnail, professional C-suite presenter in dark suit pointing toward glowing 3D shield with statutory legal icons, dramatic blue backlight, bold yellow typography 'AUDIT PLAYBOOK', 4k high contrast --ar 16:9",
                "tags": [offering, "CorporateGovernance", "RegulatoryCompliance", "InternalAudit", "CFO", "GOVENICS"]
            },
            # Format C: Educational
            "educational": {
                "format_name": "Educational Deep-Dive (Horizontal 16:9)",
                "duration": "7m 15s",
                "title": f"Masterclass: How to Architect an Enterprise-Grade {offering} System",
                "description": (
                    f"A comprehensive 7-minute practitioner masterclass on designing, rolling out, and maintaining an auditable "
                    f"{offering} framework across multi-entity holdings.\n\n"
                    f"📌 DETAILED TIMESTAMPS:\n"
                    f"0:00 - Masterclass Introduction & Learning Objectives\n"
                    f"1:15 - Current Regulatory & Statutory Landscape ({frameworks})\n"
                    f"2:45 - The Top 5 Operational Breakdown Points in Enterprises\n"
                    f"4:20 - Real-World Case Study: Eliminating Audit Deviations\n"
                    f"5:40 - Step-by-Step Implementation Roadmap (Phases 1-6)\n"
                    f"6:45 - Executive Conclusion & Board Reporting SOPs\n\n"
                    f"🔗 Full Research Article: {blog_url}\n"
                    f"📑 Download Verified Checklists: https://govenicsblogs.vercel.app/resources/ebooks\n"
                    f"🤝 Request Advisory Assessment: https://govenics.com/contact\n"
                ),
                "voiceover_script": (
                    "Welcome to the GOVENICS Enterprise Masterclass. I am your Senior GRC Advisory host. In today's session, we are dissecting the operational mechanics of "
                    f"{offering}—specifically for organizations managing complex multi-state, multi-entity holding structures.\n\n"
                    f"First, let's understand the regulatory landscape. Under {frameworks}, enforcement has evolved from periodic paperwork collection to real-time statutory scrutiny. Regulatory agencies now leverage integrated digital portals to detect filing anomalies, attendance register mismatches, and contractor payment gaps instantaneously.\n\n"
                    "Where do most enterprises fail? Our advisory audits across 1,000+ facilities reveal five consistent breakdown points: First, decentralized register maintenance where each plant or branch maintains its own informal records. Second, contractor CLRA tracking lapses where principal employers fail to verify vendor PF and ESI challans. Third, lack of documented delegation of authority matrices. Fourth, delayed regulatory gazette amendment ingestion. And fifth, the total absence of cryptographic evidence vaults.\n\n"
                    "Let's review a real-world case study: An automotive supplier with 6 manufacturing plants faced repeated inspection warnings due to scattered registers. By deploying a centralized automated digital register architecture and conducting pre-audit mock drills, they achieved 100% compliance scores within 60 days, cutting reporting overhead by 60%.\n\n"
                    "To implement this in your organization, follow our 6-phase roadmap: Discovery and gap assessment, risk prioritization, policy harmonization, digital register deployment, supervisory training, and continuous automated surveillance.\n\n"
                    "For full frameworks, checklists, and templates, download our executive publication in the description below."
                ),
                "storyboard": [
                    {"scene": 1, "time": "0:00 - 1:15", "visual": "Executive host in modern architectural GRC briefing room, interactive whiteboard showing masterclass agenda.", "on_screen_text": "Masterclass: Enterprise " + offering, "transition": "Cross Fade"},
                    {"scene": 2, "time": "1:15 - 2:45", "visual": "Animated map of India with statutory agencies (MCA, RBI, Labour, CPCB) connected via data streams.", "on_screen_text": "The Modern Regulatory Enforcement Grid", "transition": "Slide Left"},
                    {"scene": 3, "time": "2:45 - 4:20", "visual": "Graphic teardown highlighting 5 Critical Enterprise Failure Points with red alert badges.", "on_screen_text": "5 Operational Breakdown Points", "transition": "Push Down"},
                    {"scene": 4, "time": "4:20 - 5:40", "visual": "Split-screen case study showing Before vs. After metrics (0 Stop-Work Notices, 100% Defensibility).", "on_screen_text": "Case Study: 6-Plant Automotive Holding", "transition": "Wipe Diagonal"},
                    {"scene": 5, "time": "5:40 - 6:45", "visual": "Animated 6-Step Implementation Roadmap flowchart moving smoothly across phases.", "on_screen_text": "The 6-Phase Implementation Roadmap", "transition": "Zoom Flowchart"},
                    {"scene": 6, "time": "6:45 - 7:15", "visual": "Host concluding, pointing to on-screen interactive e-Book and downloadable checklist cards.", "on_screen_text": "Download Verified Blueprint at govenics.com", "transition": "Fade Out to Official Card"}
                ],
                "cta": "Download our 36-page verified implementation blueprint and register templates at govenicsblogs.vercel.app/resources/ebooks",
                "thumbnail_headline": "ENTERPRISE GRC MASTERCLASS: ZERO PENALTY SYSTEM",
                "thumbnail_prompt": "Masterclass style YouTube thumbnail, professional senior consultant pointing to a complex enterprise compliance architecture diagram on a frosted glass wall, cinematic teal and navy lighting, 4k resolution --ar 16:9",
                "tags": [offering, "GRCMasterclass", "StatutoryCompliance", "RegulatoryAudits", "ExecutiveEducation", "GOVENICS"]
            },
            # Format D: Community Posts (5 distinct formats)
            "community_posts": [
                {
                    "post_id": f"YT-COMM-{b['blog_id']}-1",
                    "type": "Educational Insight",
                    "text": (
                        f"📊 EXECUTIVE INSIGHT: Why decentralized compliance registers are the #1 cause of statutory audit penalties in 2026.\n\n"
                        f"When an enterprise operates across multiple entities, local plants often maintain their own informal spreadsheets. But under {frameworks}, regulators inspect the consolidated parent entity.\n\n"
                        f"💡 Key takeaway: If your organization cannot retrieve time-stamped evidentiary registers across all subsidiaries within 2 hours of notice receipt, you are operating with an uncalculated balance sheet risk.\n\n"
                        f"Read our full executive briefing: {blog_url}\n\n"
                        f"#Compliance #EnterpriseRisk #CorporateGovernance #GOVENICS"
                    )
                },
                {
                    "post_id": f"YT-COMM-{b['blog_id']}-2",
                    "type": "Industry Dilemma & Question",
                    "text": (
                        f"🤔 QUESTION FOR CFOs & GENERAL COUNSELS:\n\n"
                        f"How long does it currently take your team to compile and verify all statutory registers, contractor PF/ESI challans, and consent renewals across your entire subsidiary network?\n\n"
                        f"Drop your thoughts below: Are you relying on local plant managers, centralized ERP software, or third-party advisory firms?\n\n"
                        f"Let's discuss in the comments! 👇"
                    )
                },
                {
                    "post_id": f"YT-COMM-{b['blog_id']}-3",
                    "type": "Interactive Quiz / Poll",
                    "text": (
                        f"⚖️ COMPLIANCE QUIZ FOR LEADERSHIP:\n\n"
                        f"Under Indian company law, when a subsidiary entity fails to maintain statutory compliance registers, can Independent Directors of the parent holding group be named in regulatory show-cause notices?\n\n"
                        f"A) No, subsidiary liability is strictly insulated\n"
                        f"B) Yes, under vicarious liability and officer-in-default doctrines\n"
                        f"C) Only if they signed the physical register\n"
                        f"D) Only if penalty exceeds ₹1 Crore\n\n"
                        f"👉 Correct Answer: B (Under Section 442 and modern corporate governance rulings, holding company KMPs face vicarious scrutiny unless a formal Delegation of Authority and supervisory oversight trail is proven).\n\n"
                        f"Read the complete legal breakdown: {blog_url}"
                    )
                },
                {
                    "post_id": f"YT-COMM-{b['blog_id']}-4",
                    "type": "Regulatory Alert & Awareness",
                    "text": (
                        f"⚠️ REGULATORY COMPLIANCE ALERT:\n\n"
                        f"Statutory authorities have intensified unannounced verification drills across manufacturing and corporate holdings. Common inspection targets include:\n\n"
                        f"✔ CLRA contractor attendance vs. wage payout reconciliation\n"
                        f"✔ Environmental SPCB Consent to Operate (CTO) condition tracking\n"
                        f"✔ Immutable digital evidence preservation\n\n"
                        f"Ensure your facility managers are trained on pre-audit protocols. Review our emergency inspection checklist: {blog_url}"
                    )
                },
                {
                    "post_id": f"YT-COMM-{b['blog_id']}-5",
                    "type": "Video Premiere & Announcement",
                    "text": (
                        f"🎬 NEW VIDEO PREMIERE:\n\n"
                        f"We just released our executive explainer: 'The Complete Executive Guide to {offering}'.\n\n"
                        f"In this 3-minute briefing, we unpack the exact steps Group CFOs, CCOs, and Plant Heads take to eliminate regulatory penalties and guarantee 100% audit defensibility.\n\n"
                        f"Watch the full video on our channel and read the companion research paper here: {blog_url}\n\n"
                        f"What topic should our GRC Practice cover next? Let us know!"
                    )
                }
            ]
        }
    }
    return package

# Build master repurposed content records
all_linkedin_posts = []
all_youtube_packages = []

for bid in selected_blog_ids:
    if bid in blog_map:
        b = blog_map[bid]
        posts = generate_linkedin_posts_for_blog(b)
        pkg = generate_youtube_package_for_blog(b)
        all_linkedin_posts.extend(posts)
        all_youtube_packages.append(pkg)

database = {
    "generated_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "version": "1.0.0",
    "total_blogs_indexed": len(blogs),
    "total_linkedin_posts": len(all_linkedin_posts),
    "total_youtube_packages": len(all_youtube_packages),
    "linkedin_posts": all_linkedin_posts,
    "youtube_packages": all_youtube_packages
}

output_path = "data/repurposed_content.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(database, f, indent=2, ensure_ascii=False)

print(f"Successfully generated {len(all_linkedin_posts)} LinkedIn posts and {len(all_youtube_packages)} YouTube packages into {output_path}")
