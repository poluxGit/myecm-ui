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
const LocalDataSync = require('./../application.data-sync');
const _ = require('underscore');

// CategorieCreateView Class
class CategorieCreateView extends React.Component {

  /*
   * Default Constructor
   */
  constructor(props) {
    super(props);

    // Creation Event
    this.handleSubmitFormEvent  = this.handleSubmitFormEvent.bind(this);
    this._handleCatCodeChanged  = this._handleCatCodeChanged.bind(this);
    this._handleCatDescChanged  = this._handleCatDescChanged.bind(this);
    this._handleCatTitleChanged = this._handleCatTitleChanged.bind(this);
    this._cbSubmitFormEvent     = this._cbSubmitFormEvent.bind(this);
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

  /*
   * Submit Form Event
   */
  handleSubmitFormEvent(e) {
    alert('Submit event on Categorie.');

    LocalDataSync.createCategorie(this.state.cat_data,this._cbSubmitFormEvent);
    // console.log(`Search - Event Search launched with value : ${this.state.value}`);
    // pubsub.publish('open-doc-edit-panel', this.state.value);
  }

  /*
   * CallBack Submit Form Event
   */
  _cbSubmitFormEvent(response) {

    if(response.status == 200)
    {
      pubsub.publish('app-message', {type:'success',message:'Catégorie (id:"'+response.data+'") créée avec succès.'});
      this.close();
    }
    else {
      pubsub.publish('app-message', {type:'error',message:'Error (Code:"'+response.status+'"|Message:"'+response.message+'"|Data:"'+JSON.stringify(response.data)+'").'});
    }
  }

  // Close Modal Action!
  close() {
    this.setState({ showModal: false });
  }

  // Open Modal Action!
  open() {
    this.setState({ showModal: true });
  }

  // Cat Code Changed Event Handler
  _handleCatCodeChanged(e)
  {
    this._updateFieldValueInState({ cat_code: e.target.value.toUpperCase()});
    this._updateFieldValueInState({ cat_id: e.target.value.toLowerCase()});
  }

  // Cat Title Changed Event Handler
  _handleCatTitleChanged(e)
  {
    this._updateFieldValueInState({ cat_title: e.target.value});
  }

  // Cat Desc Changed Event Handler
  _handleCatDescChanged(e)
  {
    this._updateFieldValueInState({ cat_desc: e.target.value});
  }

  // Merge Categorie attributes with param !
  _updateFieldValueInState(fieldValues)
  {
    var lArrayCatData = this.state.cat_data;
    _.extend(lArrayCatData,fieldValues);
    this.setState({cat_data:lArrayCatData});
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
                      onChange={this._handleCatCodeChanged}
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
                      onChange={this._handleCatTitleChanged}
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
                      onChange={this._handleCatDescChanged}
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
