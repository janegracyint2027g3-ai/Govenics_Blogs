// GOVENICS Blog Search & Multi-Filter Engine
document.addEventListener("DOMContentLoaded", function () {
  let allBlogs = [];
  const gridContainer = document.getElementById("blogsGrid");
  const searchInput = document.getElementById("searchInput");
  const offeringSelect = document.getElementById("offeringFilter");
  const angleSelect = document.getElementById("angleFilter");
  const countBadge = document.getElementById("resultsCount");

  // Load Inventory
  fetch("data/content_inventory.json")
    .then(res => res.json())
    .then(data => {
      allBlogs = data;
      renderBlogs(allBlogs);
    })
    .catch(err => {
      console.warn("Failed to load inventory via fetch, using inline fallback if present.", err);
    });

  function renderBlogs(items) {
    if (!gridContainer) return;
    if (items.length === 0) {
      gridContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: #F8FAFC; border-radius: 12px; border: 1px dashed #CBD5E1;">
          <h3 style="font-size: 18px; color: #0B1B3D; margin-bottom: 8px;">No matching articles found</h3>
          <p style="color: #64748B; font-size: 14px;">Try clearing search keywords or selecting all categories.</p>
        </div>`;
      if (countBadge) countBadge.textContent = "0 articles";
      return;
    }

    if (countBadge) countBadge.textContent = `${items.length} articles published`;

    gridContainer.innerHTML = items.map(blog => `
      <article class="blog-card">
        <div class="card-header-bar" style="background: ${blog.color || '#1D4ED8'};"></div>
        <div class="card-body">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;"><span class="article-type-pill pill-blog">📝 Practice Blog</span></div>
          <span class="card-category-pill" style="border-color: ${blog.color || '#BFDBFE'}; color: ${blog.color || '#1D4ED8'};">
            ${blog.offering_name}
          </span>
          <h3 class="card-title">
            <a href="articles/${blog.slug}.html">${blog.title}</a>
          </h3>
          <p class="card-excerpt">${blog.meta_description}</p>
          <div class="card-meta">
            <span>By ${blog.author}</span>
            <span>${blog.reading_time}</span>
          </div>
        </div>
      </article>
    `).join("");
  }

  function applyFilters() {
    const q = (searchInput ? searchInput.value : "").toLowerCase().trim();
    const off = offeringSelect ? offeringSelect.value : "";
    const ang = angleSelect ? angleSelect.value : "";

    const filtered = allBlogs.filter(blog => {
      const matchesQ = !q || blog.title.toLowerCase().includes(q) || blog.meta_description.toLowerCase().includes(q) || blog.offering_name.toLowerCase().includes(q);
      const matchesOff = !off || blog.offering_id === off;
      const matchesAng = !ang || blog.angle_id === ang;
      return matchesQ && matchesOff && matchesAng;
    });

    renderBlogs(filtered);
  }

  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (offeringSelect) offeringSelect.addEventListener("change", applyFilters);
  if (angleSelect) angleSelect.addEventListener("change", applyFilters);
});
