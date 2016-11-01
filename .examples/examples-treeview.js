
// http://jsfiddle.net/infiniteluke/908earbh/9/



var teams = [
  {name: 'Team 1', projects: [
    {name: 'project 1', designs: [
      {name: 'test 1', size: '123 MB'},
      {name: 'wow 2', size: '23 MB'},
      {name: 'wow 3', size: '153 MB'},
      {name: 'hmmm 3', size: '3 MB'}
    ]},
    {name: 'project 2', designs: [
      {name: 'test a', size: '123 MB'},
      {name: 'test b', size: '432 MB'},
    ]},
  ]},
  {name: 'Team 2', projects: [
    {name: 'project a', designs: [
      {name: 'hello test xyz', size: '55 MB'},
      {name: 'test 5 xyz', size: '15 MB'},
      {name: 'hmmm 6 xyz', size: '23 MB'}
    ]},
    {name: 'project b', designs: []},
  ]},
  {name: 'Team 3', projects: []}
];



var Design = React.createClass({
  render: function () {
    return (
      <tr>
        <td>{this.props.design.name}</td>
        <td>{this.props.design.size}</td>
      </tr>
    );
  }
});

var Project = React.createClass({
  render: function () {
    var filterText = this.props.filterText
    var designs = this.props.designs
    .filter(function (element) {
      return element.name.indexOf(filterText) > -1
    })
    .map(function (design) {
      return <Design key={design.name} design={design} />
    });

    if (designs.length > 0) {
      return (
        <li>
          <h5>{this.props.project.name}</h5>
          <table className="table">
            <tbody>
            <tr>
              <th>Design</th>
              <th>Size</th>
            </tr>
            {designs}
            </tbody>
          </table>
        </li>
      );
    }
    else {
      return (
        <div></div>
      )
    }
  }
});

var Team = React.createClass({
  render: function () {
    var filterText = this.props.filterText
    var projects = this.props.projects.map(function (project) {
      if (project.designs.length > 0) {
        return <Project
          key={project.name}
          project={project}
          designs={project.designs}
          filterText={filterText}
        />
      }
    });

    if (projects.length > 0) {
      return (
        <div>
          <h4>{this.props.team.name}</h4>
          <ul>
            {projects}
          </ul>
        </div>
      );
    }
    else {
      return (
        <div>
          No results found for {this.props.team.name}
        </div>
      );
    }
  }
});

var TeamTree = React.createClass({
  render: function () {
    var filterText = this.props.filterText
    var teams = this.props.teams.map(function (team) {
      if (team.projects.length > 0) {
        return <Team
          key={team.name}
          filterText={filterText}
          team={team}
          projects={team.projects}
        />
      }
    });

    return (
      <div>
        {teams}
      </div>
    );
  }
});

var SearchBar = React.createClass({
  handleChange: function() {
    this.props.onUserInput(this.refs.filterTextInput.getDOMNode().value);
  },
  render: function() {
    return (
      <form>
        <input className="form-control" type="text" ref="filterTextInput" onChange={this.handleChange} placeholder="Filter by Design..." value={this.props.filterText} />
      </form>
    );
  }
});

var TreeSearch = React.createClass({
  getInitialState: function() {
    return {
      filterText: ''
    };
  },
  handleUserInput: function(filterText) {
    this.setState({
        filterText: filterText,
    });
  },
  render: function () {
    var divStyle = {
      width: "300px"
    };
    return (
      <div style={divStyle}>
        <SearchBar
          filterText={this.state.filterText}
          onUserInput={this.handleUserInput}
        />
        <TeamTree
          filterText={this.state.filterText}
          teams={this.props.teams}
        />
      </div>
    );
  }
});

React.render(<TreeSearch teams={teams} />, document.body);
