const { resolve } = require('path');
const { readdir, readFile } = require('fs').promises;

async function validateJSON(path) {
    const file = await readFile(path, 'utf-8')
    try {
        JSON.parse(file)
        return path
    } catch (err) {
        return
    }
}

async function getFiles(dir) {
    const dirents = await readdir(dir, { withFileTypes: true });
    const promises = dirents.map((dirent) => {
        const path = resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(path) : validateJSON(path);
    })
    
    const files = await Promise.all(promises);

    return [].concat(...files).filter(Boolean);
}

getFiles('main-folder')
    .then(files => console.log(files))
    .catch(err => console.error(err))