import React from 'react';

import IssueFilter from './IssueFilter.jsx';
import IssueTable from './IssueTable.jsx';
import IssueAdd from './IssueAdd.jsx';
import URLSearchParams from 'url-search-params';

const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');
function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

export default class IssueList extends React.Component {
  constructor() {
    super();
    this.state = { issues: [] };
    this.createIssue = this.createIssue.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps) {
    const { location: { search: prevSearch } } = prevProps;
    const { location: { search } } = this.props;
    if (prevSearch !== search) {
      this.loadData();
    }
  }

  async loadData() {
    const { location: { search } } = this.props;
    const params = new URLSearchParams(search);
    
    try {
      const response = await fetch(`/api/issues?` + params,);
      const body = await response.text();
      const result = JSON.parse(body, jsonDateReviver);
      this.setState({ issues: result });
    } catch (err) {
      console.log(err);
    };
  }

  async createIssue(newIssue) {
    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIssue),
      });
      const body = await response.text();
      const result = JSON.parse(body, jsonDateReviver);
      if (response.ok) {
        const newIssues = this.state.issues.concat(result);
        this.setState({ issues: newIssues });
      } else {
        alert("Failed to add issue: " + result.message)
      }
    } catch (e) {
      alert(`Error in sending data to server: ${e.message}`);
    }
  }

  render() {
    return (
      <React.Fragment>
        <h1>Issue Tracker V2</h1>
        <IssueFilter />
        <hr />
        <IssueTable issues={this.state.issues} />
        <hr />
        <IssueAdd createIssue={this.createIssue} />
      </React.Fragment>
    );
  }
}