const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = file.fieldname + '-' + Date.now() + '-' + path.basename(file.originalname, ext) + ext;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

module.exports = {
    upload
};