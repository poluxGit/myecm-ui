import React  from 'react';
import pubsub from 'pubsub-js';
import { FormGroup, ControlLabel, FormControl, Button, ButtonGroup } from 'react-bootstrap';

class Toolbar extends React.Component {

  // Props is received via the constructor
  constructor(props) {
    //...and props is sent back to the parent Component
    //class using super()
    super(props);

    this.handleCreateDoc    = this.handleCreateDoc.bind(this);
    // Initial State of the component is defined
    // in the constructor also
    this.state = {
      value:''
    };
  }

  // Update state Value attribute
  handleCreateDoc(e) {
    console.log(`ToolBar - Event CreateDoc launched.`);
    pubsub.publish('open-doc-create-panel', null);
  }

  // ************************************************************************ //
  // Rendering Component !
  // ************************************************************************ //
  render() {
    return (
      <FormGroup controlId="formControls_ActionButton">
        <ControlLabel>Actions</ControlLabel>
          <ButtonGroup bsSize="xsmall">
            <Button onClick={this.handleCreateDoc}>+Document</Button>

          </ButtonGroup>
      </FormGroup>
    );
  }
}

Toolbar.propTypes = {
  searchDoc: React.PropTypes.func,
};

export default Toolbar
