(() => {
  "use strict";

  const POSTS = Array.isArray(window.BLOG_POSTS) ? window.BLOG_POSTS : [];
  const PAGE_SIZE = 9;
  const params = new URLSearchParams(window.location.search);
  const requestedYear = params.get("year");
  const requestedSlug = params.get("slug");
  const isPostPage = window.location.pathname.endsWith("/post.html") || window.location.pathname.endsWith("post.html");

  function getYear(post) {
    const match = typeof post.date === "string" && post.date.match(/^(\d{4})-\d{2}-\d{2}$/);
    return match ? match[1] : null;
  }

  function sortPosts(posts) {
    return [...posts].sort((a, b) => {
      const dateA = Date.parse(a.date || "") || 0;
      const dateB = Date.parse(b.date || "") || 0;
      return dateB - dateA;
    });
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[character]));
  }

  function renderHeader() {
    const nav = document.getElementById("year-nav");
    if (!nav) return;

    const years = [...new Set(POSTS.map(getYear).filter(Boolean))]
      .sort((a, b) => Number(b) - Number(a));

    const yearLinks = years.map((year) => {
      const current = !isPostPage && requestedYear === year;
      return `<a href="./index.html?year=${encodeURIComponent(year)}"${current ? ' aria-current="page"' : ""}>${escapeHtml(year)}</a>`;
    }).join("");

    nav.innerHTML = yearLinks;
  }

  function renderCard(post) {
    const date = post.dateLabel
      ? `<p class="post-date">${escapeHtml(post.dateLabel)}</p>`
      : "";

    return `
      <article class="post-card">
        <a class="post-card-link" href="./post.html?slug=${encodeURIComponent(post.slug)}" aria-label="Read ${escapeHtml(post.title)}">
          <img class="post-card-image" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.imageAlt || post.title)}" loading="lazy">
          <h2 class="post-card-title">${escapeHtml(post.title)}</h2>
          ${date}
        </a>
      </article>`;
  }

  function renderHome() {
    const main = document.getElementById("home-content");
    if (!main) return;

    const pageFromUrl = Math.max(1, Number.parseInt(params.get("page") || "1", 10) || 1);
    const filteredPosts = sortPosts(POSTS).filter((post) => !requestedYear || getYear(post) === requestedYear);
    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
    const page = Math.min(pageFromUrl, totalPages);
    const start = (page - 1) * PAGE_SIZE;
    const pagePosts = filteredPosts.slice(start, start + PAGE_SIZE);
    const heading = requestedYear ? `<h1 class="visually-hidden">Posts from ${escapeHtml(requestedYear)}</h1>` : "";

    if (requestedYear && !filteredPosts.length) {
      main.innerHTML = `${heading}<section class="empty-state"><p>No posts found for ${escapeHtml(requestedYear)}.</p><a href="./index.html">View all posts</a></section>`;
      return;
    }

    const cards = pagePosts.map(renderCard).join("");
    const previousPage = Math.max(1, page - 1);
    const nextPage = Math.min(totalPages, page + 1);
    const yearQuery = requestedYear ? `&year=${encodeURIComponent(requestedYear)}` : "";
    const pagination = totalPages > 1 ? `
      <nav class="pagination" aria-label="Post pages">
        ${page > 1
          ? `<a class="pagination-button" href="./index.html?page=${previousPage}${yearQuery}" rel="prev">Previous</a>`
          : '<span class="pagination-button is-disabled" aria-disabled="true">Previous</span>'}
        <span class="pagination-status">Page ${page} of ${totalPages}</span>
        ${page < totalPages
          ? `<a class="pagination-button" href="./index.html?page=${nextPage}${yearQuery}" rel="next">Next</a>`
          : '<span class="pagination-button is-disabled" aria-disabled="true">Next</span>'}
      </nav>` : `
      <nav class="pagination" aria-label="Post pages">
        <span class="pagination-button is-disabled" aria-disabled="true">Previous</span>
        <span class="pagination-button is-disabled" aria-disabled="true">Next</span>
      </nav>`;

    main.innerHTML = `${heading}<section class="post-grid" aria-label="Recent blog posts">${cards}</section>${pagination}`;
  }

  function renderPost() {
    const main = document.getElementById("post-content");
    if (!main) return;

    const post = POSTS.find((item) => item.slug === requestedSlug);
    if (!post) {
      document.title = "Post not found | Stripey Kitten";
      main.innerHTML = `
        <section class="empty-state">
          <h1>Post not found</h1>
          <p>This post may have been moved or removed.</p>
          <a href="./index.html">Back to all posts</a>
        </section>`;
      return;
    }

    document.title = `${post.title} | Stripey Kitten`;
    const date = post.dateLabel ? `<p class="article-date">${escapeHtml(post.dateLabel)}</p>` : "";
    const paragraphs = Array.isArray(post.content)
      ? post.content.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")
      : "";

    main.innerHTML = `
      <article class="article">
        <header class="article-header">
          <h1 class="article-title">${escapeHtml(post.title)}</h1>
          ${date}
        </header>
        <img class="article-image" src="${escapeHtml(post.image)}" alt="${escapeHtml(post.imageAlt || post.title)}">
        <div class="article-content">${paragraphs}</div>
        <p class="article-back"><a href="./index.html">← Back to all posts</a></p>
      </article>`;
  }

  renderHeader();
  if (isPostPage) {
    renderPost();
  } else {
    renderHome();
  }
})();
