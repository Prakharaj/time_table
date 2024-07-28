const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Serve the index.html file when accessing the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const timetableHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lecture Timetable for Monsoon 2024</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #000;
            text-align: center;
            padding: 8px;
        }
        th {
            background-color: #f2f2f2;
        }
        .title {
            font-size: 1.5em;
            text-align: center;
            margin: 20px 0;
        }
    </style>
</head>
<body>
<div class="title">Lecture timetable for the courses of Monsoon 2024</div>
<table>
    <thead>
        <tr>
            <th></th>
            <th>8:30-9:55AM</th>
            <th>10:05-11:30AM</th>
            <th>11:40-1:05PM</th>
            <th>2:00-3:25PM</th>
            <th>3:35-5:00PM</th>
            <th>5:10-6:40PM</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>Mon</th>
            <td></td>
            <td></td>
            <td>Behavioral Research &amp; Experimental Design <strong>( BRED )</strong></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <th>Tue</th>
            <td></td>
            <td></td>
            <td>Entropy and Information</td>
            <td>Design for Social Innovation</td>
            <td>Music Workshop</td>
            <td></td>
        </tr>
        <tr>
            <th>Wed</th>
            <td></td>
            <td>Probability and Statistics</td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <th>Thu</th>
            <td></td>
            <td></td>
            <td>Behavioral Research &amp; Experimental Design <strong>( BRED )</strong></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <th>Fri</th>
            <td></td>
            <td></td>
            <td>Entropy and Information</td>
            <td>Design for Social Innovation</td>
            <td>Music Workshop</td>
            <td></td>
        </tr>
        <tr>
            <th>Sat</th>
            <td></td>
            <td>Probability and Statistics</td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </tbody>
</table>
</body>
</html>
`;

app.post('/generate-timetable', (req, res) => {
    const { courses } = req.body;
    let filteredTimetable = timetableHTML;

    const { JSDOM } = require('jsdom');
    const dom = new JSDOM(filteredTimetable);
    const document = dom.window.document;

    const rows = document.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
            if (cell.textContent.trim() && !courses.includes(cell.textContent.trim())) {
                cell.textContent = '';
            }
        });
    });

    filteredTimetable = dom.serialize();

    res.json({ html: filteredTimetable });
});

app.get('/download-timetable', async (req, res) => {
    const { courses } = req.query;
    const coursesArray = courses.split(',');

    let filteredTimetable = timetableHTML;

    const { JSDOM } = require('jsdom');
    const dom = new JSDOM(filteredTimetable);
    const document = dom.window.document;

    const rows = document.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
            if (cell.textContent.trim() && !coursesArray.includes(cell.textContent.trim())) {
                cell.textContent = '';
            }
        });
    });

    filteredTimetable = dom.serialize();

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(filteredTimetable);
    const pdf = await page.pdf({ format: 'A4' });
    await browser.close();

    res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': pdf.length
    });
    res.send(pdf);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
