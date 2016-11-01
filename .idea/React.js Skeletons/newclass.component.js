/**
 * ${1:ComponentClassname} - based on React.Component
 *
 * ${3:Description}
 *
 * @author ${2:author_name}
 * @link https://facebook.github.io/react/docs/react-component.html
 */

// Importing libraries
import React  from 'react';
import pubsub from 'pubsub-js';


// ${1:ComponentClassname} Class
class $1 extends React.Component {

  /*
   * Default Constructor
   */
  constructor(props) {
    super(props);
    // Event handling example ...
    this.handleSearchEvent = this.handleSearchEvent.bind(this);
    // Initial State definition
    this.state = {
      value:''
    };
  }

  /**
   * componentWillMount
   *
   * Pre render() method
   *
   * @link https://facebook.github.io/react/docs/react-component.html#componentwillmount
   */
  componentWillMount() {

  }

  /**
   * componentDidMount
   *
   * Post render() method
   *
   * @link https://facebook.github.io/react/docs/react-component.html#componentdidmount
   */
  componentDidMount() {

  }

  /**
   * componentWillReceiveProps
   *
   * When props are updated...
   *
   * @link https://facebook.github.io/react/docs/react-component.html#componentWillReceiveProps
   */
  componentWillReceiveProps(){

  }

  /**
   * shouldComponentUpdate
   *
   * Determine if re-rendering is needed.
   *
   * @link https://facebook.github.io/react/docs/react-component.html#shouldComponentUpdate
   *
   * @return boolean Indicate if rendering is needed.
   */
  shouldComponentUpdate(){
    return true;
  }

  /**
   * componentWillUpdate
   *
   * Post render() method
   *
   * @link https://facebook.github.io/react/docs/react-component.html#componentWillUpdate
   */
  componentWillUpdate(){

  }

  /**
   * componentDidUpdate
   *
   * Post render() method
   *
   * @link https://facebook.github.io/react/docs/react-component.html#componentDidUpdate
   */
  componentDidUpdate(){

  }

  /*
   * An Event Example ...
   */
  handleSearchEvent(e) {
    console.log(`Search - Event Search launched with value : ${this.state.value}`);
    pubsub.publish('open-doc-edit-panel', this.state.value);
  }

  /**
   * render
   *
   * @link https://facebook.github.io/react/docs/react-component.html#render
   */
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

/* ************************************************************************** */
/* ${1:ComponentClassname} Static Class properties
/* ************************************************************************** */
// ${1} Class Properties Definition
${1:ComponentClassname}.propTypes = {
  searchDoc: React.PropTypes.func,
};
// ${1} Properties default values
${1:ComponentClassname}.defaultProps = {
  searchDoc: '',
};
// displayName ? Used for debugging by JSX ???

export default ${1:ComponentClassname}
