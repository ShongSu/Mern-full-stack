const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { connectToDb } = require('./db.js');
const issue = require('./issue.js');

app.use(bodyParser.json());

app.get('/hello', (req, res) => {
  res.send('Hello World');
});

app.get('/api/issues', (req, res) => {
  const filter = {};              
  if (req.query.status) filter.status = req.query.status;
  if (req.query.effortMin) filter.effortMin = req.query.effortMin;  
  if (req.query.effortMax) filter.effortMax = req.query.effortMax;  

  issue.issueList(filter).then(issues => {
    res.send(issues);
  })
});

app.get('/api/issues/:id', (req, res) => {
  const id = req.params.id;        
  issue.get(+id).then(issue => {  
    res.send(issue);
  })
});

app.post('/api/issues', (req, res) => {
  const newIssue = req.body;
  issue.issueAdd(newIssue).then((result) => {    
    if(result.message) {
      res.status(422).json(result);
      return;
    }
    res.send(result);
  });
});



(async function () {
  try {
    await connectToDb();
    app.listen(3000, function () {
      console.log('API server started on port 3000');
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
})();