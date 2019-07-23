const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

app.use(express.static('public'));
app.use(bodyParser.json());


const url = 'mongodb://localhost/issuetracker';
let db;

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

async function issueAdd(res, issue) {
  issue.created = new Date();
  if (!issue.status)
    issue.status = 'New';
  const err = validateIssueV2(issue)
  if (err) {    
    res.status(422).json({ message: `Invalid requrest: ${err}` });
    return;
  }
  issue.id = await getNextSequence('issues');

  const result = await db.collection('issues').insertOne(issue);
  const savedIssue = await db.collection('issues')
    .findOne({ _id: result.insertedId });

  res.json(savedIssue);
}

async function issueList() {
  const issues = await db.collection('issues').find({}).toArray();
  return issues;
}

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

app.get('/hello', (req, res) => {
  res.send('Hello World');
});

app.get('/api/issues', (req, res) => {
  issueList().then(issues => {
    res.send(issues);
  })
});

app.post('/api/issues', (req, res, next) => {
  const newIssue = req.body;
  issueAdd(res, newIssue);
});

function validateIssueV2(issue ) {  
  const errors = [];
  if (issue.title.length < 3) {
    errors.push('Field "title" must be at least 3 characters long.')
  }
  if (issue.status == 'Assigned' && !issue.owner) {
    errors.push('Field "owner" is required when status is "Assigned"');
  }
  if (errors.length > 0) {
    return errors;
  }
}

(async function () {
  try {
    await connectToDb();
    app.listen(3000, function () {
      console.log('App started on port 3000');
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
})();