import React from 'react';
import { Link } from 'react-router-dom';
const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');
function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
}

export default class IssueEdit extends React.Component {
  constructor() {
    super();
    this.state = {
      issue: {},
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }
  componentDidUpdate(prevProps) {
    const { match: { params: { id: prevId } } } = prevProps;
    const { match: { params: { id } } } = this.props;
    if (id !== prevId) {
      this.loadData();
    }
  }
  onChange(event) {
    const { name, value } = event.target;
    this.setState(prevState => ({
      issue: { ...prevState.issue, [name]: value },
    }));
  }
  handleSubmit(e) {
    e.preventDefault();
    const { issue } = this.state;
    console.log(issue); // eslint-disable-line no-console
  }

  async loadData() {
    const { match: { params: { id } } } = this.props;
    try {
      const response = await fetch(`/api/issues/` + +id);
      const body = await response.text();
      const result = JSON.parse(body, jsonDateReviver);

      if (result) {
        this.setState({ issue: result });
      } else {
        this.setState({ issue: {} });
      }
    } catch (err) {
      console.log(err);
    };
  }

  render() {
    <h2> {`This is a placeholder for editing issue ${id}`}</h2 >
    const { issue: { id } } = this.state;
    const { match: { params: { id: propsId } } } = this.props;
    if (id == null) {
      if (propsId != null) {
        return <h3>{`Issue with ID ${propsId} not found.`}</h3>;
      }
      return null;
    }
    const { issue: { title, status } } = this.state;
    const { issue: { owner, effort, description } } = this.state;
    const { issue: { created, due } } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <h3>{`Editing issue: ${id}`}</h3>
        <table>
          <tbody>
            <tr>
              <td>Created:</td>
              <td>{created.toDateString()}</td>
            </tr>
            <tr>
              <td>Status:</td>
              <td>
                <select name="status" value={status} onChange={this.onChange}>
                  <option value="New">New</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Fixed">Fixed</option>
                  <option value="Closed">Closed</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Owner:</td>
              <td>
                <input
                  name="owner"
                  value={owner}
                  onChange={this.onChange}
                />
              </td>
            </tr>
            <tr>
              <td>Effort:</td>
              <td>
                <input
                  name="effort"
                  value={effort}
                  onChange={this.onChange}
                />
              </td>
            </tr>
            <tr>
              <td>Due:</td>
              <td>
                <input
                  name="due"
                  value={due}
                  onChange={this.onChange}
                />
              </td>
            </tr>
            <tr>
              <td>Title:</td>
              <td>
                <input
                  size={50}
                  name="title"
                  value={title}
                  onChange={this.onChange}
                />
              </td>
            </tr>
            <tr>
              <td>Description:</td>
              <td>
                <textarea
                  rows={8}
                  cols={50}
                  name="description"
                  value={description}
                  onChange={this.onChange}
                />
              </td>
            </tr>
            <tr>
              <td />
              <td><button type="submit">Submit</button></td>
            </tr>
          </tbody>
        </table>
        <Link to={`/edit/${id - 1}`}>Prev</Link>
        {' | '}
        <Link to={`/edit/${id + 1}`}>Next</Link>
      </form>
    );
  }
}