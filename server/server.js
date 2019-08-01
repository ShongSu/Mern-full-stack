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
  issue.issueList(filter).then(issues => {
    res.send(issues);
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