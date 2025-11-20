const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

const pdfPath = path.join(__dirname, '../app/example/Resume(Eric Shin)-Google.pdf');

if (!fs.existsSync(pdfPath)) {
    console.error('PDF file not found at:', pdfPath);
    process.exit(1);
}

const dataBuffer = fs.readFileSync(pdfPath);

pdf(dataBuffer).then(function(data) {
    console.log(data.text);
}).catch(function(error) {
    console.error('Error parsing PDF:', error);
});
