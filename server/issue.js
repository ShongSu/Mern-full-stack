const { getDb, getNextSequence } = require('./db.js');


async function get(id) {
    const db = getDb();        
    const issue = await db.collection('issues').findOne({ id: id });        
    return issue;
}

async function issueList({ status, effortMin, effortMax }) {
    const db = getDb();
    const filter = {};
    if (status) filter.status = status;
    if (effortMin !== undefined || effortMax !== undefined) {
        filter.effort = {};
        if (effortMin !== undefined) filter.effort.$gte = +effortMin;
        if (effortMax !== undefined) filter.effort.$lte = +effortMax;
    }    
    const issues = await db.collection('issues').find(filter).toArray();
    return issues;
}

function validateIssueV2(issue) {
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

async function issueAdd(issue) {
    const db = getDb();
    issue.created = new Date();
    if (!issue.status)
        issue.status = 'New';
    const err = validateIssueV2(issue)
    if (err) {
        return { message: `Invalid requrest: ${err}` };
    }
    issue.id = await getNextSequence('issues');

    const result = await db.collection('issues').insertOne(issue);
    const savedIssue = await db.collection('issues')
        .findOne({ _id: result.insertedId });

    return savedIssue;
}

module.exports = { issueList, issueAdd, get };