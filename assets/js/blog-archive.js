(() => {
  'use strict';
  const list = document.getElementById('blog-archive-list');
  const search = document.getElementById('blog-search');
  const category = document.getElementById('blog-category');
  const count = document.getElementById('blog-results-count');
  const prev = document.getElementById('blog-prev');
  const next = document.getElementById('blog-next');
  const label = document.getElementById('blog-page-label');
  const pagination = document.getElementById('blog-pagination');
  if (!list || !search || !category || !count || !prev || !next || !label) return;

  const cards = Array.from(list.querySelectorAll('.blog-archive-item'));
  const pageSize = 12;
  let page = 1;
  let filtered = cards;

  function render() {
    const query = search.value.trim().toLocaleLowerCase();
    const selected = category.value;
    filtered = cards.filter(card => {
      const title = card.dataset.search || card.textContent.toLocaleLowerCase();
      return (!selected || card.dataset.category === selected) && (!query || title.includes(query));
    });
    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
    page = Math.min(Math.max(1, page), pageCount);
    const start = (page - 1) * pageSize;
    const visible = new Set(filtered.slice(start, start + pageSize));
    cards.forEach(card => { card.hidden = !visible.has(card); });
    const from = filtered.length ? start + 1 : 0;
    const to = Math.min(start + pageSize, filtered.length);
    count.textContent = 'Showing ' + from + '–' + to + ' of ' + filtered.length + ' article(s).';
    label.textContent = 'Page ' + page + ' of ' + pageCount;
    prev.disabled = page <= 1;
    next.disabled = page >= pageCount;
    if (pagination) pagination.hidden = filtered.length <= pageSize;
  }

  search.addEventListener('input', () => { page = 1; render(); });
  category.addEventListener('change', () => { page = 1; render(); });
  prev.addEventListener('click', () => {
    page = Math.max(1, page - 1); render();
    list.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.GrapeCruxAnalytics?.track('blog_archive_page', { page_number: page });
  });
  next.addEventListener('click', () => {
    page += 1; render();
    list.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.GrapeCruxAnalytics?.track('blog_archive_page', { page_number: page });
  });
  render();
})();
