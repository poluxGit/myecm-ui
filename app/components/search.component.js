import React  from 'react';
import pubsub from 'pubsub-js';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';

class Search extends React.Component {

  // Props is received via the constructor
  constructor(props) {
    //...and props is sent back to the parent Component
    //class using super()
    super(props);

    this.handleSearchEvent = this.handleSearchEvent.bind(this);
    // Initial State of the component is defined
    // in the constructor also
    this.state = {
      value:''
    };
  }

  // Update state Value attribute
  handleChange(e) {
    this.setState({value: e.target.value});
  }

  // Search Event
  handleSearchEvent(e) {
    console.log(`Search - Event Search launched with value : ${this.state.value}`);
    pubsub.publish('open-doc-edit-panel', this.state.value);
  //  this.props.searchDoc(this.state.value);
  }

  render() {
    return (
      <FormGroup controlId="formControls_Search">
        <ControlLabel>Rechercher</ControlLabel>
        <FormControl
          type="text"
          bsSize="xsmall"
          placeholder="Que voulez-vous rechercher ?"
          value={this.state.value}
          onChange={this.handleChange.bind(this)}
           />
        <Button
          onClick={this.handleSearchEvent}
          bsSize="small"
          >
          Rechercher
        </Button>
      </FormGroup>
    );
  }
}

Search.propTypes = {
  searchDoc: React.PropTypes.func,
};

export default Search
