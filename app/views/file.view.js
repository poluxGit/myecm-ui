/**
 * FileView - based on React.Component
 *
 * Allow to update a file & launch action on it.
 * @used pubsub to catch open Event
 * @author poluxGit
 * @link https://facebook.github.io/react/docs/react-component.html
 */

// Importing libraries
import React  from 'react';
import pubsub from 'pubsub-js';
import { Form, FormGroup, ControlLabel, FormControl, Col, Button , Modal, InputGroup, ButtonToolbar, ProgressBar} from 'react-bootstrap';

const LocalData = require('./../application.storage');
const LocalDataSync = require('./../application.data-sync');
const _ = require('underscore');

// TierCreateView Class
class FileView extends React.Component {

  /*
   * Default Constructor
   */
  constructor(props) {
    super(props);

    // Creation Event
    this.handleSubmitFormEvent    = this.handleSubmitFormEvent.bind(this);
    this._cbSubmitFormEventUpdate = this._cbSubmitFormEventUpdate.bind(this);

    // OCR Analysis Management!
    this.handleClickOCRAnalysis   = this.handleClickOCRAnalysis.bind(this);
    this._cbOCRAnalysisCreation   = this._cbOCRAnalysisCreation.bind(this);
    this._cbOCRAnalysisResult     = this._cbOCRAnalysisResult.bind(this);


    this._cbSubmitFormEventCreate = this._cbSubmitFormEventCreate.bind(this);
    this.close                    = this.close.bind(this);
    this.open                     = this.open.bind(this);

    // Initial State definition
    this.state = {
      showModal:false,
      showProgress:false,
      progressCurrentStep:0,
      progressTotalStep:0,
      isNew:true,
      file_data :{
        file_id:'',
        file_originalname:'',
        file_size:'',
        file_mime:''
      },
      ocr_data:'',
      meta_file:''
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
    this.pubsub_token_openView = pubsub.subscribe('app-file-open', function(eventName,fileId) {
      console.log('AppMyDocsContainer - Event "'+eventName+'" on "'+fileId+'" received.');

      var lArrFileData = LocalData.getFileById(fileId);
      this._updateFieldValueInState(lArrFileData);
      this.setState({isNew:false});
      this.open();
    }.bind(this));
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    // React removed me from the DOM, I have to unsubscribe from the pubsub using my token
    pubsub.unsubscribe(this.pubsub_token_openView);
  }

  /*
   * Submit Form Event
   */
  handleClickOCRAnalysis(e) {
      LocalDataSync.createOCRAnalysisOnServer(this._cbOCRAnalysisCreation);
  }

  _cbOCRAnalysisCreation(taskId) {
    this.setState({showProgress:true});
    LocalDataSync.launchOCRAnalysisOnServer(taskId,this.state.file_data.file_id,this._cbOCRAnalysisResult);
  }

  _cbOCRAnalysisResult(OCRresult) {
    this.setState({ocr_data:OCRresult});
  }

  /*
   * OCR Analysis luanching ...
   */
  handleSubmitFormEvent(e) {
    if(this.state.isNew)
    {
      LocalDataSync.createTier(this.state.file_data,this._cbSubmitFormEventCreate);
    }
    else {
      LocalDataSync.updateTier(this.state.file_data,this._cbSubmitFormEventUpdate);
    }
  }

  /*
   * CallBack Submit Form Event - CREATE
   */
  _cbSubmitFormEventCreate(response) {

    if(response.status == 200)
    {
      pubsub.publish('app-message', {type:'success',message:'Tier (id:"'+response.data+'") crée avec succès.'});
      this.close();
    }
    else {
      pubsub.publish('app-message', {type:'error',message:'Error (Code:"'+response.status+'"|Message:"'+response.message+'"|Data:"'+JSON.stringify(response.data)+'").'});
    }
  }

  /*
   * CallBack Submit Form Event - UPDATE
   */
  _cbSubmitFormEventUpdate(response) {

    if(response.status == 200)
    {
      pubsub.publish('app-message', {type:'success',message:'Tier (id:"'+response.data+'") mis à jour avec succès.'});
      this.close();
    }
    else {
      pubsub.publish('app-message', {type:'error',message:'Error (Code:"'+response.status+'"|Message:"'+response.message+'"|Data:"'+JSON.stringify(response.data)+'").'});
    }
  }

  // Close Modal Action!
  close() {
    this.setState({ showModal: false, ocr_data:'' });
  }

  // Open Modal Action!
  open() {
    this.setState({ showModal: true });
  }


  // Merge Categorie attributes with param !
  _updateFieldValueInState(fieldValues)
  {
    var lArrayCatData = this.state.file_data;
    _.extend(lArrayCatData,fieldValues);
    this.setState({file_data:lArrayCatData});
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
            <Modal.Title>{this.state.isNew ? "Err New File":"File #"+this.state.file_data.file_id}
              <ProgressBar
                show={this.state.showProgress}
                now={this.state.progressTotalStep != 0 ? (this.state.progressCurrentStep*100)/this.state.progressTotalStep:0}
                label={`${this.state.progressTotalStep != 0 ? (this.state.progressCurrentStep*100)/this.state.progressTotalStep:0}%`} /></Modal.Title>
          </Modal.Header>
          <Form horizontal onSubmit={this.handleSubmitFormEvent}>
            <Modal.Body>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={2}>Int. #ID</Col>
                  <Col sm={10}>
                  <FormControl
                    readOnly={true}
                    type="text"
                    placeholder="File #ID - AUTO"
                    value={this.state.file_data.file_id}
                     />
                 </Col>
                </FormGroup>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={2}>Filename</Col>
                  <Col sm={10}>
                    <FormControl
                      type="text"
                      disabled={true}
                      value={this.state.file_data.file_originalname}
                       />
                  </Col>
                </FormGroup>

                <FormGroup>
                  <Col componentClass={ControlLabel} sm={2}>Filesize</Col>
                  <Col sm={10}>
                    <FormControl
                      disabled={true}
                      type="text"
                      value={this.state.file_data.file_size}
                      />
                      <InputGroup.Addon>kbytes</InputGroup.Addon>
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={2}>Mime type</Col>
                  <Col sm={10}>
                    <FormControl
                      disabled={true}
                      type="text"
                      value={this.state.file_data.file_mime}
                      />
                  </Col>
                </FormGroup>
                <FormGroup>
                  <Col componentClass={ControlLabel} sm={2}>File Link</Col>
                  <Col sm={10}>
                  <Button bsStyle="link" href={LocalData.getAppSetting('url-restapi')+'file/'+this.state.file_data.file_id+'/'} target="self">Download File</Button>
                  </Col>
                </FormGroup>
<FormGroup>
                <ButtonToolbar>
                  <Button bsStyle="info">Info</Button>
                  <Button bsStyle="info" onClick={this.handleClickOCRAnalysis}>OCR Analysis</Button>
                </ButtonToolbar>
  </FormGroup>
               <FormGroup>
                 <Col componentClass={ControlLabel} sm={2}>OCR Results</Col>
                 <Col sm={10}>
                   <FormControl
                     readOnly={true}
                     componentClass="textarea"
                     rows={10}
                     value={this.state.ocr_data}
                     />
                 </Col>
               </FormGroup>

            </Modal.Body>

            <Modal.Footer>
              <Button onClick={this.close}>Fermer</Button>
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

export default FileView
