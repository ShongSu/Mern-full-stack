import React from 'react';
const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');
function jsonDateReviver(key, value) {
    if (dateRegex.test(value)) return new Date(value);
    return value;
}

export default class IssueDetail extends React.Component {
    constructor() {
        super();
        this.state = { issue: {} };
    }
    componentDidMount() {
        this.loadData();
    }
    componentDidUpdate(prevProps) {
        const { match: { params: { id: prevId } } } = prevProps;
        const { match: { params: { id } } } = this.props;
        if (prevId !== id) {
            this.loadData();
        }
    }

    async loadData() {
        const { match: { params: { id } } } = this.props;        
        try {
            const response = await fetch(`/api/issues/` + id);
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
        const { issue: { description } } = this.state;
        return (
            <div>
                <h3>Description</h3>
                <pre>{description}</pre>
            </div>
        );
    }
}