(() => {
"use strict";
const PAGE_SIZE=9, params=new URLSearchParams(location.search);
const requestedYear=params.get("year"), requestedSlug=params.get("slug");
const isPostPage=/post\.html$/.test(location.pathname);
let POSTS=[];
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const yearOf=p=>{const m=typeof p.date==="string"&&p.date.match(/^(\d{4})-\d{2}-\d{2}$/);return m?m[1]:null};
const sorted=a=>[...a].sort((x,y)=>(Date.parse(y.date||"")||0)-(Date.parse(x.date||"")||0));
async function loadPosts(){
 const r=await fetch("./posts/index.json"); if(!r.ok) throw Error("Could not load posts/index.json ("+r.status+")");
 const paths=await r.json(); if(!Array.isArray(paths)) throw Error("posts/index.json must be an array of post file paths.");
 const list=await Promise.all(paths.map(async path=>{const q=await fetch(path);if(!q.ok)throw Error("Could not load "+path+" ("+q.status+")");const p=await q.json();if(!p.slug||!p.title)throw Error(path+" needs slug and title.");return p;}));
 const slugs=new Set(); for(const p of list){if(slugs.has(p.slug))throw Error("Duplicate post slug: "+p.slug);slugs.add(p.slug);} return list;
}
function renderHeader(){
 const nav=document.getElementById("year-nav");if(!nav)return;
 nav.innerHTML=[...new Set(POSTS.map(yearOf).filter(Boolean))].sort((a,b)=>+b-+a).map(y=>`<a href="./index.html?year=${encodeURIComponent(y)}"${!isPostPage&&requestedYear===y?' aria-current="page"':""}>${esc(y)}</a>`).join("");
}
function renderHome(){
 const main=document.getElementById("home-content");if(!main)return;
 const filtered=sorted(POSTS).filter(p=>!requestedYear||yearOf(p)===requestedYear);
 const total=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE)),page=Math.min(Math.max(1,parseInt(params.get("page")||"1",10)||1),total);
 const cards=filtered.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE).map(p=>`<article class="post-card"><a class="post-card-link" href="./post.html?slug=${encodeURIComponent(p.slug)}" aria-label="Read ${esc(p.title)}"><img class="post-card-image" src="${esc(p.image||"")}" alt="${esc(p.imageAlt||p.title)}" loading="lazy"><h2 class="post-card-title">${esc(p.title)}</h2>${p.dateLabel?`<p class="post-date">${esc(p.dateLabel)}</p>`:""}</a></article>`).join("");
 const yq=requestedYear?"&year="+encodeURIComponent(requestedYear):"";
 main.innerHTML=filtered.length?`<section class="post-grid" aria-label="Recent blog posts">${cards}</section><nav class="pagination" aria-label="Post pages">${page>1?`<a class="pagination-button" href="./index.html?page=${page-1}${yq}">Previous</a>`:'<span class="pagination-button is-disabled">Previous</span>'}<span class="pagination-status">Page ${page} of ${total}</span>${page<total?`<a class="pagination-button" href="./index.html?page=${page+1}${yq}">Next</a>`:'<span class="pagination-button is-disabled">Next</span>'}</nav>`:`<section class="empty-state"><p>No posts found.</p><a href="./index.html">View all posts</a></section>`;
}
function renderPost(){
 const main=document.getElementById("post-content");if(!main)return;
 const p=POSTS.find(x=>x.slug===requestedSlug);
 if(!p){main.innerHTML='<section class="empty-state"><h1>Post not found</h1><a href="./index.html">Back to all posts</a></section>';return;}
 document.title=p.title+" | Stripey Kitten";
 const paras=Array.isArray(p.paragraphs)?p.paragraphs.map(t=>`<p>${esc(t)}</p>`).join(""):"";
 const gallery=Array.isArray(p.gallery)?p.gallery.map(i=>{const src=typeof i==="string"?i:i.src,alt=typeof i==="string"?"":(i.alt||"");return src?`<figure class="article-figure"><img class="article-content-image" src="${esc(src)}" alt="${esc(alt)}" loading="lazy"></figure>`:"";}).join(""):"";
 main.innerHTML=`<article class="article"><header class="article-header"><h1 class="article-title">${esc(p.title)}</h1>${p.dateLabel?`<p class="article-date">${esc(p.dateLabel)}</p>`:""}</header>${p.image?`<img class="article-image" src="${esc(p.image)}" alt="${esc(p.imageAlt||p.title)}">`:""}<div class="article-content">${paras}${gallery}</div><p class="article-back"><a href="./index.html">← Back to all posts</a></p></article>`;
}
async function start(){try{POSTS=await loadPosts();renderHeader();isPostPage?renderPost():renderHome();}catch(e){console.error(e);const el=document.getElementById(isPostPage?"post-content":"home-content");if(el)el.innerHTML=`<section class="empty-state"><h1>Posts could not be loaded</h1><p>Check posts/index.json and the individual post files.</p><p>${esc(e.message)}</p></section>`;}}
start();
})();