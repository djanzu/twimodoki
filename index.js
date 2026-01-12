const db = require('./src/database');
const htmlGenerator = require('./src/htmlGenerator');
const path = require('path');

const command = process.argv[2];

async function main() {
    try {
        if (command === 'server') {
            require('./src/server');
        } else if (command === 'post') {
            const content = process.argv[3];
            if (!content) {
                console.error('Usage: node index.js post "content"');
                process.exit(1);
            }
            // For CLI posts, no images attached by default in this simple command
            await db.run('INSERT INTO posts (content, images) VALUES (?, ?)', [content, JSON.stringify([])]);
            console.log('Post created.');
            const posts = await db.all('SELECT * FROM posts ORDER BY created_at DESC');
            await htmlGenerator.generateAll(posts);
        } else if (command === 'list') {
            const posts = await db.all('SELECT * FROM posts ORDER BY created_at DESC');
            console.log(posts);
        } else if (command === 'generate') {
            const posts = await db.all('SELECT * FROM posts ORDER BY created_at DESC');
            await htmlGenerator.generateAll(posts);
        } else {
            console.log('Usage: node index.js [server|post|list|generate]');
        }
    } catch (e) {
        console.error(e);
    } finally {
        if (command !== 'server') {
            // Give some time for async ops if any (though we await everything)
            // db.close() isn't strictly necessary for short lived CLI scripts but good practice.
            // However, htmlGenerator might have pending file ops? We awaited them.
            // db.close(); // Not exporting close yet properly or instance management issues?
            // Actually src/database.js exports close.
            // db.close();
            // But lets keep it simple. Node exits when event loop is empty.
        }
    }
}

if (require.main === module) {
    main();
}
