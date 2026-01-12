# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Twitter-like application (twimodo) - a single-user social media platform. The project specifications are defined in `仕様書.md` (Japanese specification document).

### Core Requirements (from 仕様書.md)
- Single-user Twitter-like application
- Posts stored locally using Node.js + SQLite
- Command execution generates HTML files saved to `public/` directory
- No likes or retweets functionality, but URL sharing is supported

## Project Structure

```
twimodo/
├── 仕様書.md           # Project specifications (Japanese)
├── index.js            # Main CLI application
├── package.json        # Node.js dependencies and scripts
├── src/
│   ├── database.js     # SQLite database operations
│   └── htmlGenerator.js # HTML file generation
├── database/           # SQLite database files
└── public/             # Generated HTML files for hosting
    ├── index.html      # Main timeline page
    └── post-*.html     # Individual post pages
```

## Common Commands

### Web Server
- `npm start` or `npm run server` - Start web server for posting (http://localhost:3000)
- `node index.js server -p 8080` - Start server on custom port

### Post Management (CLI)
- `node index.js post "投稿内容"` - Create a new post via CLI
- `node index.js list` - List all posts
- `node index.js generate` - Regenerate all HTML files

### Development
- `npm install` - Install dependencies
- `npm run dev` - Start development server

## Architecture

### Database (src/database.js)
- SQLite database with posts table (id, content, images, created_at)
- Supports image attachments stored as JSON array
- Provides methods for adding posts and retrieving post data
- Database file stored in `database/twimodo.db`

### Web Server (src/server.js)
- Express.js server with web-based posting interface
- File upload handling with multer (max 4 images, 5MB each)
- Routes: `/` (posting form), `/timeline` (generated HTML), `/uploads/*` (images)
- Automatically regenerates HTML files after posting

### HTML Generation (src/htmlGenerator.js)
- Generates responsive HTML pages with Japanese styling
- Creates timeline view (index.html) and individual post pages
- Displays uploaded images in responsive grid layout
- Includes URL sharing functionality for each post
- Uses clean CSS styling with mobile-responsive design

### CLI Interface (index.js)
- Command-line interface using commander.js
- Commands: post, list, generate, server
- Supports both CLI posting and web server modes

## Key Implementation Notes

- All posts are stored locally in SQLite database with image support
- HTML files are generated for static hosting
- Each post gets its own shareable URL (post-{id}.html)
- Images are stored in `uploads/` directory and served via web server
- Supports up to 4 images per post (JPEG/PNG, max 5MB each)
- Web-based posting interface with drag-and-drop file upload
- Japanese text is properly handled in both database and HTML output
- The system is designed for single-user usage with no authentication
- Images are displayed in responsive grid layout in generated HTML