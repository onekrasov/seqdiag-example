const wsd = require('websequencediagrams');
const fs = require('fs');
const path = require('path');
const { ROOT_DIR = './diagrams' } = process.env;

function fromDir(startPath, filter, cb) {
    const files = fs.readdirSync(startPath);

    files.forEach(file => {
        const filename = path.join(startPath, file);
        const stat = fs.lstatSync(filename);

        if (stat.isDirectory()) {
            fromDir(filename, filter, cb);
        } else if (filename.indexOf(filter) >= 0) {
            cb(filename);
        };
    });
};

fromDir(ROOT_DIR, '.seqdiag', fn => {
    const text = fs.readFileSync(fn);
    const fpath = fn.replace('.seqdiag', '.png');
    wsd.diagram(text, 'qsd', 'png', (err, buf) => {
        if (err) throw err;

        fs.writeFile(fpath, buf, () => console.log(`Generated file: ${fpath}`));
    });
});