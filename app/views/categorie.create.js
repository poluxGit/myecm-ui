/**
 * CategorieCreateView - based on React.Component
 *
 * Allow to create a new Categorie
 * @used pubsub to catch open Event
 * @author poluxGit
 * @link https://facebook.github.io/react/docs/react-component.html
 */

// Importing libraries
import React  from 'react';
import pubsub from 'pubsub-js';
import { Form, FormGroup, ControlLabel, FormControl, Col, Button , Modal} from 'react-bootstrap';

const LocalData = require('./../application.storage');


// CategorieCreateView Class
class CategorieCreateView extends React.Component {

  /*
   * Default Constructor
   */
  constructor(props) {
    super(props);

    // Creation Event
    this.handleSubmitFormEvent  = this.handleSubmitFormEvent.bind(this);
    this.close                  = this.close.bind(this);
    this.open                   = this.open.bind(this);

    // Initial State definition
    this.state = {
      showModal:false,
      cat_data :{
        cat_id:'',
        cat_code:'',
        cat_title:'',
        cat_desc:''
      },
      _creationCallBack:undefined
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
    this.pubsub_token_createCat = pubsub.subscribe('app-cat-create', function(topic) {
      console.log('AppMyDocsContainer - Event "'+topic+'" received.');
      this.open();
    }.bind(this));
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    // React removed me from the DOM, I have to unsubscribe from the pubsub using my token
    pubsub.unsubscribe(this.pubsub_token_createCat);
  }

  // /**
  //  * componentDidMount
  //  *
  //  * Post render() method
  //  *
  //  * @link https://facebook.github.io/react/docs/react-component.html#componentdidmount
  //  */
  // componentDidMount() {
  //
  // }
  //
  // /**
  //  * componentWillReceiveProps
  //  *
  //  * When props are updated...
  //  *
  //  * @link https://facebook.github.io/react/docs/react-component.html#componentWillReceiveProps
  //  */
  // componentWillReceiveProps(){
  //
  // }

  // /**
  //  * componentWillUpdate
  //  *
  //  * Post render() method
  //  *
  //  * @link https://facebook.github.io/react/docs/react-component.html#componentWillUpdate
  //  */
  // componentWillUpdate(){
  //
  // }
  //
  // /**
  //  * componentDidUpdate
  //  *
  //  * Post render() method
  //  *
  //  * @link https://facebook.github.io/react/docs/react-component.html#componentDidUpdate
  //  */
  // componentDidUpdate(){
  //
  // }

  /*
   * Submit Form Event
   */
  handleSubmitFormEvent(e) {
    alert('Submit event on Categorie.');
    // console.log(`Search - Event Search launched with value : ${this.state.value}`);
    // pubsub.publish('open-doc-edit-panel', this.state.value);
  }

  // Close Modal Action!
  close() {
    this.setState({ showModal: false });
  }

  // Open Modal Action!
  open() {
    this.setState({ showModal: true });
  }

  /**
   * render
   *
   * @link https://facebook.github.io/react/docs/react-component.html#render
   */
  render() {

    return (
        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header>
            <Modal.Title>Nouvelle Catégorie</Modal.Title>
          </Modal.Header>
          <Form horizontal onSubmit={this.handleSubmitFormEvent}>
            <Modal.Body>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={2}>Id</Col>
                    <Col sm={10}>
                  <FormControl
                    disabled={true}
                    type="text"
                    placeholder="Catégorie #ID - AUTO"
                    value={this.state.cat_data.cat_id}
                     />
                 </Col>
                </FormGroup>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={2}>Code</Col>
                  <Col sm={10}>
                    <FormControl
                      type="text"
                      placeholder="Code Catégorie"
                      value={this.state.cat_data.cat_code}
                       />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={2}>Titre</Col>
                  <Col sm={10}>
                    <FormControl
                      type="text"
                      placeholder="Titre"
                      value={this.state.cat_data.cat_title}
                       />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={2}>Description</Col>
                  <Col sm={10}>
                    <FormControl
                      componentClass="textarea"
                      placeholder="Description"
                      value={this.state.cat_data.cat_desc}
                       />
                  </Col>
                </FormGroup>
            </Modal.Body>

            <Modal.Footer>
              <Button onClick={this.close}>Fermer</Button>
              <Button bsStyle="primary" onClick={this.handleSubmitFormEvent}>Créer</Button>
            </Modal.Footer>
            </Form>
        </Modal>

    );
  }
}

/* ************************************************************************** */
/* CategorieCreateView Static Class properties
/* ************************************************************************** */
// CategorieCreateView Class Properties Definition
// CategorieCreateView.propTypes = {
//   searchDoc: React.PropTypes.func,
// };
// // CategorieCreateView Properties default values
// CategorieCreateView.defaultProps = {
//   searchDoc: '',
// };
// displayName ? Used for debugging by JSX ???

export default CategorieCreateView
