/**
 * TierCreateView - based on React.Component
 *
 * Allow to create a new Tier
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

// TierCreateView Class
class TierCreateView extends React.Component {

  /*
   * Default Constructor
   */
  constructor(props) {
    super(props);

    // Creation Event
    this.handleSubmitFormEvent    = this.handleSubmitFormEvent.bind(this);
    this._handleTierCodeChanged   = this._handleTierCodeChanged.bind(this);
    this._handleTierDescChanged   = this._handleTierDescChanged.bind(this);
    this._handleTierTitleChanged  = this._handleTierTitleChanged.bind(this);
    this._cbSubmitFormEvent       = this._cbSubmitFormEvent.bind(this);
    this.close                    = this.close.bind(this);
    this.open                     = this.open.bind(this);

    // Initial State definition
    this.state = {
      showModal:false,
      tier_data :{
        tier_id:'',
        tier_code:'',
        tier_title:'',
        tier_desc:''
      }
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
    this.pubsub_token_createTier = pubsub.subscribe('app-tier-create', function(topic) {
      console.log('AppMyDocsContainer - Event "'+topic+'" received.');
      this.open();
    }.bind(this));
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    // React removed me from the DOM, I have to unsubscribe from the pubsub using my token
    pubsub.unsubscribe(this.pubsub_token_createTier);
  }

  /*
   * Submit Form Event
   */
  handleSubmitFormEvent(e) {
    LocalDataSync.createTier(this.state.tier_data,this._cbSubmitFormEvent);
  }

  /*
   * CallBack Submit Form Event
   */
  _cbSubmitFormEvent(response) {

    if(response.status == 200)
    {
      pubsub.publish('app-message', {type:'success',message:'Tier (id:"'+response.data+'") crée avec succès.'});
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
  _handleTierCodeChanged(e)
  {
    this._updateFieldValueInState({
      tier_code: e.target.value.toUpperCase(),
      tier_id: 'tie-'+e.target.value.toLowerCase()
    });
  }

  // Cat Title Changed Event Handler
  _handleTierTitleChanged(e)
  {
    this._updateFieldValueInState({ tier_title: e.target.value});
  }

  // Cat Desc Changed Event Handler
  _handleTierDescChanged(e)
  {
    this._updateFieldValueInState({ tier_desc: e.target.value});
  }

  // Merge Categorie attributes with param !
  _updateFieldValueInState(fieldValues)
  {
    var lArrayCatData = this.state.tier_data;
    _.extend(lArrayCatData,fieldValues);
    this.setState({tier_data:lArrayCatData});
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
            <Modal.Title>Nouveau Tier</Modal.Title>
          </Modal.Header>
          <Form horizontal onSubmit={this.handleSubmitFormEvent}>
            <Modal.Body>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={2}>Id</Col>
                    <Col sm={10}>
                  <FormControl
                    disabled={true}
                    type="text"
                    placeholder="Tier #ID - AUTO"
                    value={this.state.tier_data.tier_id}
                     />
                 </Col>
                </FormGroup>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={2}>Code</Col>
                  <Col sm={10}>
                    <FormControl
                      type="text"
                      placeholder="Code Tier"
                      value={this.state.tier_data.tier_code}
                      onChange={this._handleTierCodeChanged}
                       />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={2}>Titre</Col>
                  <Col sm={10}>
                    <FormControl
                      type="text"
                      placeholder="Titre"
                      value={this.state.tier_data.tier_title}
                      onChange={this._handleTierTitleChanged}
                       />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={2}>Description</Col>
                  <Col sm={10}>
                    <FormControl
                      componentClass="textarea"
                      placeholder="Description"
                      value={this.state.tier_data.tier_desc}
                      onChange={this._handleTierDescChanged}
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
/* TierCreateView Static Class properties
/* ************************************************************************** */
// TierCreateView Class Properties Definition
// TierCreateView.propTypes = {
//   searchDoc: React.PropTypes.func,
// };
// // TierCreateView Properties default values
// TierCreateView.defaultProps = {
//   searchDoc: '',
// };
// displayName ? Used for debugging by JSX ???

export default TierCreateView
