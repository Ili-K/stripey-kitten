# Stripey Kitten

A lightweight, responsive blog inspired by the screenshot supplied for the project. It uses plain HTML, CSS, and JavaScript, so there is no build step and no package installation required. It is ready to publish with GitHub Pages.

## What's included

- `index.html` — homepage with a four-column desktop grid, up to nine newest posts per page, year filters, and Previous/Next pagination.
- `post.html` — individual post page; the header is shared visually with the homepage.
- `js/posts.js` — the post list and the place to add/edit your content.
- `js/app.js` — automatically builds the header years, sorts and filters posts, handles pagination, and renders post pages.
- `css/styles.css` — layout and responsive styling.
- `assets/images/` — local sample images cropped from your reference screenshot. Replace these with your own image files for the live site.

## Add or edit a post

Open `js/posts.js` and add an object to `window.BLOG_POSTS`. For example:

```js
{
  slug: "a-new-post",
  title: "A New Post",
  date: "2026-10-19",
  dateLabel: "Oct 19, 2026",
  image: "./assets/images/a-new-post.jpg",
  imageAlt: "A short description of the image",
  content: [
    "This is the first paragraph.",
    "This is the second paragraph."
  ]
}
```

Then follow these steps:

1. Add the image file to `assets/images/` and set the `image` path to match its filename.
2. Give each post a unique `slug`; it is used in the post URL.
3. Set `date` in `YYYY-MM-DD` format. This date controls sorting and which year appears in the header.
4. Set `dateLabel` to the text readers should see below the title. It is optional, so it can be an empty string.
5. Write one paragraph per item in `content`.

Posts are sorted newest-first. The homepage shows at most nine posts per page; Previous and Next appear when there are more than nine posts in the selected view. The year links are generated only for years represented in the post data, and selecting a year filters the homepage to posts from that year. The homepage without a year selected shows posts from all years.

The first and third sample posts use illustrative sorting dates because dates were not visible for them in the screenshot. Replace these with the correct dates before publishing, or leave the date blank if the post should not be assigned a year.

## Publish with GitHub Pages

1. Create a GitHub repository for the site.
2. Upload the contents of this folder to the repository's root (so `index.html` is at the root, not inside another nested folder).
3. On GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Choose the branch you want to publish (usually `main`) and the `/ (root)` folder, then save.
6. Wait for GitHub Pages to provide the site URL.

When you change posts or images, commit and push the changed files to the same branch. GitHub Pages will publish the update automatically.

## Preview locally

Because the site loads its post data from a local JavaScript file, you can simply open `index.html` in a browser. For the most consistent preview, you can also run a small local server from this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
