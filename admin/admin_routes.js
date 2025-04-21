const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const pdf = require('html-pdf-node');

const submissions = [];

function logSubmission(entry) {
  submissions.push({ ...entry, timestamp: new Date().toISOString() });
}

function exportCSV(req, res) {
  try {
    const parser = new Parser();
    const csv = parser.parse(submissions);
    res.header('Content-Type', 'text/csv');
    res.attachment('submissions.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

function exportPDF(req, res) {
  const html = `<h1>Submission Log</h1>
    <ul>${submissions.map(s => `<li>${s.timestamp} — ${s.cid}</li>`).join('')}</ul>`;
  const file = { content: html };
  pdf.generatePdf(file, { format: 'A4' }).then(output => {
    res.header('Content-Type', 'application/pdf');
    res.attachment('submissions.pdf');
    res.send(output);
  }).catch(err => res.status(500).json({ error: err.message }));
}

module.exports = {
  exportCSV,
  exportPDF,
  logSubmission
};
