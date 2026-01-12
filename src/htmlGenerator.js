const fs = require('fs-extra');
const path = require('path');
const mustache = require('mustache');

const TEMPLATE_DIR = path.join(__dirname, '../templates');
const PUBLIC_DIR = path.join(__dirname, '../public');
const UPLOADS_DIR = path.join(__dirname, '../uploads');
const PUBLIC_IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

async function loadTemplate(name) {
    try {
        return await fs.readFile(path.join(TEMPLATE_DIR, name), 'utf8');
    } catch (e) {
        console.warn(`Template ${name} not found.`);
        return '';
    }
}

async function copyImages() {
    await fs.ensureDir(PUBLIC_IMAGES_DIR);
    if (await fs.pathExists(UPLOADS_DIR)) {
        await fs.copy(UPLOADS_DIR, PUBLIC_IMAGES_DIR);
    }
}

async function generateAll(posts) {
    await fs.ensureDir(PUBLIC_DIR);

    // Copy images first
    await copyImages();

    const baseTemplate = await loadTemplate('base.html');
    const timelineTemplate = await loadTemplate('timeline.html');
    const postTemplate = await loadTemplate('post.html');

    // Prepare view data
    const viewData = {
        posts: posts.map(p => ({
            ...p,
            images: p.images ? JSON.parse(p.images) : [],
            formattedDate: new Date(p.created_at).toLocaleString(),
            postUrl: `post-${p.id}.html`
        }))
    };

    // Generate Timeline
    const timelineContent = mustache.render(timelineTemplate, viewData);
    const timelineHtml = mustache.render(baseTemplate, {
        title: 'Timeline',
        content: timelineContent
    });
    await fs.outputFile(path.join(PUBLIC_DIR, 'index.html'), timelineHtml);

    // Generate Individual Post Pages
    for (const post of viewData.posts) {
        const postContent = mustache.render(postTemplate, { post });
        const postHtml = mustache.render(baseTemplate, {
            title: `Post ${post.id}`,
            content: postContent
        });
        await fs.outputFile(path.join(PUBLIC_DIR, post.postUrl), postHtml);
    }

    console.log('HTML generation complete.');
}

module.exports = { generateAll };
