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
            <td>Blockchain and Web3 Development, Data Analytics I, Earthquake Resistant Design of Masonry Structures, Probability and Random Processes, Thinking and Knowing in the Human Sciences – III, CMOS References and Regulators</td>
            <td>Introduction to Biology, Introduction to Quantum Field Theory, Operating Systems and Networks, Signal Processing, Structural Dynamics, Topics in Nanosciences, Retrofit of Existing Infrastructure(H2), Software Systems Development</td>
            <td>Advanced Computer Architecture, Behavioral Research & Experimental Design, Digital Image Processing, Distributed Systems, Environmental Science & Technology, Language and Society, Theory of Elasticity, Science 1, Quantum Mechanics, Hydrological modelling and Software Development</td>
            <td>Learning and Memory, Structural Engineering Design Studio, Topics in Applied Optimization, Quantum Information Theory, Open Quantum Systems and Quantum Thermodynamics</td>
            <td>Advanced Computer Networks, Automata Theory (H1), Bioinformatics (H1), Data and Applications (H2), Information Theory, Introduction to Remote Sensing MCS 1-Probability and Statistics (H1), MCS 2 - Linear Algebra (H2), Structural Safety of Built Infrastructure, Systems Biology (H2), Principles of Semiconductor Devices, Information Retrieval & Extraction, Wireless Communications</td>
            <td>Introduction to Economics, Introduction to Film Studies, Intro to Psychology</td>
        </tr>
        <tr>
            <th>Tue</th>
            <td>Advanced Operating Systems, Chemistry Topics for Engineers, Computer Problem Solving, Physics of Early Universe, Software Quality Engineering</td>
            <td>Advanced Design of Steel Structures, Algorithm Analysis and Design, Chemical Kinetics and Reaction Dynamics (H2), Computational Linguistics II, Design for Testability, Fairness, Privacy and Ethics in AI, Foundations for Signal Processing and Communication, Modern Complexity Theory, Spectroscopy(H1), Spatial Informatics</td>
            <td>Applied Ethics, Biomolecular Structure Interaction & Dynamics, Data Structures & Algorithms for Problem Solving, Entropy and Information, Finite Element Methods, Thinking and Knowing in the Human Sciences – II, Geospatial Technology for Disaster Risk Modelling</td>
            <td>Algorithms and Operating Systems, IoT Workshop, Intro to Cognitive Science, Introduction to Neural and Cognitive Modeling, Mobile Robotics, Signal Detection and Estimation Theory, Systems Thinking, Design for Social Innovation, Speech Analysis and Linguistics</td>
            <td>Basics of Ethics (H1), Gender and Society, Introduction to Philosophy, Research in Information Security, Music Workshop, Introduction to Politics</td>
            <td>Statistical Methods in AI</td>
        </tr>
        <tr>
            <th>Wed</th>
            <td>Basics of Ethics (H2), Introduction to History, Work, Entrepreneurship and Technology in Contemporary Societies, Readings from Hindi Literature, Design Thinking - Research to Define (H1), Design Thinking - Idea to Evaluate (H2)</td>
            <td>Advanced NLP, Digital VLSI Design, Modern Coding Theory, Probability and Statistics, VLSI Design, Principles of Programming Languages, Robotics: Dynamics and Control, Product Management 101 (H1), User Research Methods (H2), Product Marketing</td>
            <td>Human Computer Interaction (H2)</td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
        <tr>
            <th>Thu</th>
            <td>Blockchain and Web3 Development, Data Analytics I, Earthquake Resistant Design of Masonry Structures, Probability and Random Processes, Thinking and Knowing in the Human Sciences – III, CMOS References and Regulators</td>
            <td>Introduction to Biology, Introduction to Quantum Field Theory, Operating Systems and Networks, Signal Processing, Structural Dynamics, Topics in Nanosciences, Retrofit of Existing Infrastructure(H2), Software Systems Development</td>
            <td>Advanced Computer Architecture, Behavioral Research & Experimental Design, Digital Image Processing, Distributed Systems, Environmental Science & Technology, Language and Society, Theory of Elasticity, Science 1, Quantum Mechanics, Hydrological modelling and Software Development</td>
            <td>Learning and Memory, Structural Engineering Design Studio, Topics in Applied Optimization, Quantum Information Theory, Open Quantum Systems and Quantum Thermodynamics</td>
            <td>Advanced Computer Networks, Automata Theory (H1), Bioinformatics (H1), Data and Applications (H2), Information Theory, Introduction to Remote Sensing MCS 1-Probability and Statistics (H1), MCS 2 - Linear Algebra (H2), Structural Safety of Built Infrastructure, Systems Biology (H2), Principles of Semiconductor Devices, Information Retrieval & Extraction, Wireless Communications</td>
            <td>Introduction to Economics, Introduction to Film Studies, Intro to Psychology</td>
        </tr>
        <tr>
            <th>Fri</th>
            <td>Advanced Operating Systems, Chemistry Topics for Engineers, Computer Problem Solving, Physics of Early Universe, Software Quality Engineering</td>
            <td>Advanced Design of Steel Structures, Algorithm Analysis and Design, Chemical Kinetics and Reaction Dynamics (H2), Computational Linguistics II, Design for Testability, Fairness, Privacy and Ethics in AI, Foundations for Signal Processing and Communication, Modern Complexity Theory, Spectroscopy(H1), Spatial Informatics</td>
            <td>Applied Ethics, Biomolecular Structure Interaction & Dynamics, Data Structures & Algorithms for Problem Solving, Entropy and Information, Finite Element Methods, Thinking and Knowing in the Human Sciences – II, Geospatial Technology for Disaster Risk Modelling</td>
            <td>Algorithms and Operating Systems, IoT Workshop, Intro to Cognitive Science, Introduction to Neural and Cognitive Modeling, Mobile Robotics, Research in Information Security, Signal Detection and Estimation Theory, Systems Thinking, Design for Social Innovation, Speech Analysis and Linguistics</td>
            <td>Basics of Ethics (H1), Gender and Society, Introduction to Philosophy, Research in Information Security, Music Workshop, Introduction to Politics, CASE Seminar</td>
            <td>Statistical Methods in AI</td>
        </tr>
        <tr>
            <th>Sat</th>
            <td>Basics of Ethics (H2), Introduction to History, Work, Entrepreneurship and Technology in Contemporary Societies, Readings from Hindi Literature, Design Thinking - Research to Define (H1), Design Thinking - Idea to Evaluate (H2)</td>
            <td>Advanced NLP, Digital VLSI Design, Modern Coding Theory, Probability and Statistics, VLSI Design, Principles of Programming Languages, Robotics: Dynamics and Control, Product Management 101 (H1), User Research Methods (H2), Product Marketing</td>
            <td>Human Computer Interaction (H2)</td>
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
            if (cell.textContent.trim()) {
                const cellCourses = cell.textContent.split(',').map(course => course.trim());
                const matchingCourses = cellCourses.filter(course => courses.includes(course));
                cell.textContent = matchingCourses.join(', ');
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
            if (cell.textContent.trim()) {
                const cellCourses = cell.textContent.split(',').map(course => course.trim());
                const matchingCourses = cellCourses.filter(course => coursesArray.includes(course));
                cell.textContent = matchingCourses.join(', ');
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