import React  from 'react';
import Axios from 'axios';
import pubsub from 'pubsub-js';
import { Form, FormGroup, ControlLabel, FormControl, Col, Button, Modal } from 'react-bootstrap';

const LocalData = require('./../application.storage');
const LocalDataSync = require('./../application.data-sync');
const _ = require('underscore');

/**
 * DocumentView : Document Renderer components
 */
class DocumentModal extends React.Component {

  // Props is received via the constructor
  constructor(props) {
    //...and props is sent back to the parent Component
    //class using super()
    super(props);

    // Event Handlers
    this.open                                         = this.open.bind(this);
    this.close                                        = this.close.bind(this);
    this.handlerTitleChanged                          = this.onTitleChanged.bind(this);
    this.handlerDescChanged                           = this.onDescriptionChanged.bind(this);
    this.handlerTypeDocChanged                        = this.onTypeDocChanged.bind(this);
    this.handlerCategorieChanged                      = this.onCategorieChanged.bind(this);
    this.handlerTierChanged                           = this.onTierChanged.bind(this);
    this.handlerDateChanged                           = this.onDateChanged.bind(this);
    this._cancelUpdate                                = this._cancelUpdate.bind(this);
    this._deleteDoc                                   = this._deleteDoc.bind(this);
    this.handleSubmitFormEvent                        = this.handleSubmitFormEvent.bind(this);

    this._cbSubmitFormEventCallBackDocumentCreated    = this._cbSubmitFormEventCallBackDocumentCreated.bind(this);
    this._cbSubmitFormEventCallBackDocumentUpdated    = this._cbSubmitFormEventCallBackDocumentUpdated.bind(this);
    this._cbSubmitFormEventCallBackCategoriesCreated  = this._cbSubmitFormEventCallBackCategoriesCreated.bind(this);
    this._cbSubmitFormEventCallBackTiersCreated       = this._cbSubmitFormEventCallBackTiersCreated.bind(this);
    this._cbSubmitDocumentEventCallBackDeleted        = this._cbSubmitDocumentEventCallBackDeleted.bind(this);

    // Initial State of the component
    this.state = {
      showModal:false,
      isNew:true,
      doc_data : {
        doc_id    : '',
        doc_title : '',
        doc_code  : '',
        doc_desc  : '',
        tdoc_id   : '',
        doc_year  : 0,
        doc_month : 0,
        doc_day   : 0,
        metas     : [],
        cats    : [],
        tiers   : []
      }
    };

    // Getting only ids !
    // this.state.doc_data.cats = _.pluck(props.props.doc_data.cats,'cat_id');
    // this.state.doc_data.tiers = _.pluck(props.props.doc_data.tiers,'tier_id');
    // this.state.doc_data.metas = props.props.doc_data.metas;
  }

  /**
   * componentWillMount
   *
   * Pre render() method
   *
   * @link https://facebook.github.io/react/docs/react-component.html#componentwillmount
   */
  componentWillMount() {
    this.pubsub_token_createDoc = pubsub.subscribe('app-doc-create', function(eventName) {
      console.log('AppMyDocsContainer - Event "'+eventName+'" received.');
      this._updateFieldValueInState({
        doc_id    : '',
        doc_title : '',
        doc_code  : '',
        doc_desc  : '',
        tdoc_id   : '',
        doc_year  : 0,
        doc_month : 0,
        doc_day   : 0
      });
      this.setState({isNew:true});
      this.open();
    }.bind(this));

    this.pubsub_token_editDoc = pubsub.subscribe('app-doc-edit', function(eventName,docId) {
      console.log('AppMyDocsContainer - Event "'+eventName+'" on "'+docId+'" received.');

      var lArrDocData = LocalData.getDocumentById(docId);
      this._updateFieldValueInState(lArrDocData);
      this.setState({isNew:false});
      this.open();
    }.bind(this));
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    // React removed me from the DOM, I have to unsubscribe from the pubsub using my token
    pubsub.unsubscribe(this.pubsub_token_createDoc);
    pubsub.unsubscribe(this.pubsub_token_editDoc);
  }



  // Close Modal Action!
  close() {
    this.setState({ showModal: false });
  }

  // Open Modal Action!
  open() {
    this.setState({ showModal: true });
  }

  // Merge Documents attributes with param !
  _updateFieldValueInState(fieldValues)
  {
    var lArrayDocData = this.state.doc_data;
    _.extend(lArrayDocData,fieldValues);
    this.setState({doc_data:lArrayDocData});
  }

  onTitleChanged(e)
  {
    this._updateFieldValueInState({doc_title:e.target.value});
  }
  onDescriptionChanged(e)
  {
    this._updateFieldValueInState({doc_desc  : e.target.value});
  }
  onTypeDocChanged(e)
  {
    var lStrValue = e.target.value;

    if(e.target.value === "0" )
    {
      lStrValue = null;
    }

    this._updateFieldValueInState(
      {
        tdoc_id : lStrValue,
        doc_code : this.getCalculateDocCode(this.state.doc_data.doc_year,lStrValue)
      });

  //  this.updateDocCode();
  }
  onCategorieChanged(e)
  {
    var lStrValue = e.target.value;
    var lArrTiers = [];
    if(e.target.value !== "0" )
    {
      lArrTiers = this.state.doc_data.cats;
      if(_.indexOf(lArrTiers,e.target.value) >=0)
      {
        lArrTiers.splice(_.indexOf(lArrTiers,e.target.value),1);
      }
      else {
        lArrTiers.push(e.target.value);
      }
    }
    this._updateFieldValueInState({cats   : lArrTiers});
  }
  onTierChanged(e)
  {
    var lStrValue = e.target.value;
    var lArrTiers = [];
    if(e.target.value !== "0" )
    {
      lArrTiers = this.state.doc_data.tiers;
      if(_.indexOf(lArrTiers,e.target.value) >=0)
      {
        lArrTiers.splice(_.indexOf(lArrTiers,e.target.value),1);
      }
      else {
        lArrTiers.push(e.target.value);
      }
    }
    this._updateFieldValueInState({tiers   : lArrTiers});
  }

  getCalculateDocCode(lStrYear,lStrTdocId)
  {

    var lObjTypeDoc;
    var lStrDocCode = '';

    if(lStrTdocId != null && lStrTdocId != 0 && lStrYear > 0 )
    {
      var lObjTypeDoc = LocalData.getTypeDocById(lStrTdocId);
      lStrDocCode = 'D-' + lObjTypeDoc.tdoc_code + '-' + lStrYear + '-' + (LocalData.getAllDocuments().length+1);

    }
    return lStrDocCode;
  }

  onDateChanged(e)
  {
    var yearDoc = '';
    var monthDoc = '';
    var dayDoc = '';
    var lObjResultat = {
      doc_year:'',
      doc_month:'',
      doc_day:''
    }
    if(e.target.value){
      var lArrDate = e.target.value.split("-");
      lObjResultat = {
        doc_year:lArrDate[0],
        doc_month:lArrDate[1],
        doc_day:lArrDate[2],
        doc_code : this.getCalculateDocCode(lArrDate[0],this.state.doc_data.tdoc_id)
      };
    }
    this._updateFieldValueInState(lObjResultat);
  }

  _cancelUpdate(e) {
    this.close();
    //pubsub.publish('close-panel', this.state.doc_data.doc_id);
  }

  handleSubmitFormEvent(e)
  {
    if(this.state.isNew)
    {
      LocalDataSync.createDocument(this.state.doc_data,this._cbSubmitFormEventCallBackDocumentUpdated);
    }
    else {
      LocalDataSync.updateDocument(this.state.doc_data,this._cbSubmitFormEventCallBackDocumentUpdated);
    }

  }

  /*
   * CallBack Submit Form Event
   */
  _cbSubmitFormEventCallBackDocumentCreated(response) {

    if(response.status == 200)
    {
      pubsub.publish('app-message', {type:'success',message:'Document (id:"'+response.data+'") crée avec succès.'});
      // Liaison des categories !
      LocalDataSync.addCategoriesToDocument(response.data,this.state.doc_data.cats,this._cbSubmitFormEventCallBackCategoriesCreated);
      // Liaison des Tiers !
      LocalDataSync.addTiersToDocument(response.data,this.state.doc_data.tiers,this._cbSubmitFormEventCallBackTiersCreated);

    }
    else {
      pubsub.publish('app-message', {type:'error',message:'Error (Code:"'+response.status+'"|Message:"'+response.message+'"|Data:"'+JSON.stringify(response.data)+'").'});
    }
  }

  /*
   * CallBack Submit Form Event
   */
  _cbSubmitFormEventCallBackDocumentUpdated(response) {

    if(response.status == 200)
    {
      pubsub.publish('app-message', {type:'success',message:'Document (id:"'+response.data+'") mis à jour avec succès.'});
      // Liaison des categories !
      LocalDataSync.addCategoriesToDocument(response.data,this.state.doc_data.cats,this._cbSubmitFormEventCallBackCategoriesCreated);
      // Liaison des Tiers !
      LocalDataSync.addTiersToDocument(response.data,this.state.doc_data.tiers,this._cbSubmitFormEventCallBackTiersCreated);

    }
    else {
      pubsub.publish('app-message', {type:'error',message:'Error (Code:"'+response.status+'"|Message:"'+response.message+'"|Data:"'+JSON.stringify(response.data)+'").'});
    }
  }

  /*
   * CallBack Submit Form Event after cat ok
   */
  _cbSubmitFormEventCallBackCategoriesCreated(response) {
    if(response[0].status == 200)
    {
      pubsub.publish('app-message', {type:'success',message:'Document/Cat (id:"'+response[0].data+'") crée avec succès.'});
    }
    else {
      pubsub.publish('app-message', {type:'error',message:'Error (Code:"'+response.status+'"|Message:"'+response.message+'"|Data:"'+JSON.stringify(response)+'").'});
    }
  }

  /*
   * CallBack Submit Form Event after tier ok
   */
  _cbSubmitFormEventCallBackTiersCreated(response) {
    if(response[0].status == 200)
    {
      pubsub.publish('app-message', {type:'success',message:'Document/Tier (id:"'+response[0].data+'") crée avec succès.'});
    }
    else {
      pubsub.publish('app-message', {type:'error',message:'Error (Code:"'+response.status+'"|Message:"'+response.message+'"|Data:"'+JSON.stringify(response)+'").'});
    }
  }


  /*
   * CallBack Submit Form Event after tier ok
   */
  _cbSubmitDocumentEventCallBackDeleted(response) {
    if(response.status == 200)
    {
      pubsub.publish('app-message', {type:'success',message:'Document (id:"'+this.state.doc_data.doc_id+'") effacé avec succès.'});
    }
    else {
      pubsub.publish('app-message', {type:'error',message:'Error (Code:"'+response.status+'"|Message:"'+response.message+'"|Data:"'+JSON.stringify(response)+'").'});
    }
  }

  _deleteDoc(e){
    // @TODO Ajouter validation avant suppression!
    LocalDataSync.deleteDocument(this.state.doc_data.doc_id,this._cbSubmitDocumentEventCallBackDeleted);
    pubsub.publish('app-datareload-all', 'doc');
    pubsub.publish('close-panel', this.state.doc_data.doc_id);
  }
  // Render Components !
  render() {
    // Options for SELECT !
    var categorieItems  = [];
    var tierItems       = [];
    var typdocItems     = [];
    var categorieObjSelected  = {};

    var categorieObj  = LocalData.getAllCategories();
    var tierObj       = LocalData.getAllTiers();
    var typdocObj     = LocalData.getAllTypeDocs();

    var self = this;

    // Generate Options HTML Tag for Categorie!
    categorieObj.forEach( function(categorie){
      categorieItems.push(<option key={categorie.cat_id} value={categorie.cat_id}>{categorie.cat_title}</option>);
        _.extend(categorieObjSelected,[categorie.cat_id]);
      });
    // Generate Options HTML Tag for Tier!
    tierObj.forEach(function(tier){
      tierItems.push(<option key={tier.tier_id} value={tier.tier_id}>{tier.tier_title}</option>);
    });
    // Generate Options HTML Tag for  Type De Document!
    typdocObj.forEach(function(typedoc){
      typdocItems.push(<option key={typedoc.tdoc_id} value={typedoc.tdoc_id}>{typedoc.tdoc_title}</option>);
    });

    // Metadata Controls!
    var metaControlItems = [];

    // Generate FormControl Bootsrap Tag for All Metadata!

    // "doc_id": "doc-58658d671ffd5",
    // "meta_id": "mtdoc-factures-01",
    // "tdoc_id": "tdoc-factures",
    // "mdoc_title": "Date",
    // "mdoc_value": "",
    // "meta_datatype": "date",
    // "meta_pattern": "aaaa-mm-dd",
    // "meta_desc": "Date de Facturation.",
    // "meta_required": "N",
    // "meta_placeholder": "",
    // "meta_mask": "",
    // "meta_json_html_attributes": "{}"


    // META DATA FIELD MANAGEMENT!
    this.state.doc_data.metas.forEach(function(meta){
      var lStrIdControl = {
        id: 'formControlsText_'+meta.meta_id
      };
      metaControlItems.push(
        <FormGroup key={lStrIdControl.id} controlId={lStrIdControl.id}>
          <Col componentClass={ControlLabel} sm={2}>{meta.mdoc_title}</Col>
          <Col sm={10}>
            <FormControl
              type={meta.meta_datatype}
              placeholder={meta.meta_placeholder}
              value={meta.mdoc_value}/>
          </Col>
        </FormGroup>
      );
    });

    var styleDivBouton = {
      'padding' : '5px',
      'float'   : 'right'
    };

    var styleBouton = {
      'margin' : '5px'

    };

    return (
      <Modal show={this.state.showModal} onHide={this.close}>

        <Modal.Header>
          <Modal.Title>{this.state.isNew ? "Nouveau Document":"Document #"+this.state.doc_data.doc_id}</Modal.Title>
        </Modal.Header>

        <Form horizontal>
          <Modal.Body>
            <FormGroup controlId='formControlsText_DocCode'>
                <Col componentClass={ControlLabel} sm={2}>Doc #ID</Col>
                <Col sm={4}>
                  <FormControl
                    type='text'
                    disabled={true}
                    placeholder='#Internal AUTO GUID'
                    value={this.state.doc_data.doc_id}
                    />
                </Col>


                <Col componentClass={ControlLabel} sm={2}>Code</Col>
                <Col sm={4}>
                  <FormControl
                    type='text'
                    value={this.state.doc_data.doc_code}
                    disabled={true}>
                  </FormControl>
                </Col>

            </FormGroup>
            <FormGroup controlId="formControlsSelect_TypeDocId">
              <Col componentClass={ControlLabel} sm={2}>Type</Col>
              <Col sm={10}>
                <FormControl
                  componentClass="select"
                  disabled={!this.state.isNew}
                  placeholder="Choisir un type de document..."
                  value={this.state.doc_data.tdoc_id == null ? 0:this.state.doc_data.tdoc_id}
                  onChange={this.handlerTypeDocChanged}>
                  <option key={0} value={0}>...</option>
                  {typdocItems}
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup controlId='formControlsText_DocTitle'>
                <Col componentClass={ControlLabel} sm={2}>Titre</Col>
                <Col sm={10}>
                  <FormControl
                    type='text'
                    placeholder='Entrer un Titre...'
                    value={this.state.doc_data.doc_title}
                    onChange={this.handlerTitleChanged} />
                </Col>
            </FormGroup>
            <FormGroup controlId='formControlsText_DocDate'>
                <Col componentClass={ControlLabel} sm={2}>Date</Col>
                <Col sm={10}>
                  <FormControl
                    type="date"
                    placeholder='DD/MM/YYY'
                    value={(this.state.doc_data.doc_year && this.state.doc_data.doc_month && this.state.doc_data.doc_day)?this.state.doc_data.doc_year +'-'+ this.state.doc_data.doc_month+'-'+this.state.doc_data.doc_day:''}
                    onChange={this.handlerDateChanged}
                     />
                </Col>
            </FormGroup>
            <FormGroup controlId="formControlsSelect_CatId">
              <Col componentClass={ControlLabel} sm={2}>Catégorie</Col>
              <Col sm={10}>
                <FormControl
                  componentClass="select"
                  placeholder="Choisir une catégorie..."
                  value={this.state.doc_data.cats}
                  onChange={this.handlerCategorieChanged} multiple>
                  {categorieItems}
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup controlId="formControlsSelect_TierId">
              <Col componentClass={ControlLabel} sm={2}>Tier</Col>
              <Col sm={10}>
                <FormControl componentClass="select" placeholder="Choisir un Tier..."
                  value={this.state.doc_data.tiers}
                  onChange={this.handlerTierChanged} multiple>
                  {tierItems}
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup controlId='formControlsText_DocDesc'>
                <Col componentClass={ControlLabel} sm={2}>Description</Col>
                <Col sm={10}>
                  <FormControl
                    componentClass="textarea"
                    placeholder='Entrer une description...'
                    value={this.state.doc_data.doc_desc}
                    onChange={this.handlerDescChanged} />
                </Col>
            </FormGroup>

            {metaControlItems}

            </Modal.Body>

          <Modal.Footer>

          <div style={styleDivBouton}>
            <Button bsStyle="primary" style={styleBouton} onClick={this.handleSubmitFormEvent}>
              {this.state.isNew?"Créer":"Mise à jour"}
            </Button>

            <Button bsStyle="default" style={styleBouton} onClick={this._cancelUpdate}>
              Annuler & Fermer
            </Button>
          </div>
          </Modal.Footer>
        </Form>

      </Modal>
    );
  }
}

/* Properties Definition */
DocumentModal.PropTypes = {
    docid         : React.PropTypes.string,
    doc_data      : React.PropTypes.array

};

/* Default Properties values */
DocumentModal.defaultProps = {
  doc_data : {
    doc_id    : '',
    doc_title : '',
    doc_code  : '',
    doc_desc  : '',
    tdoc_id   : '',
    doc_year  : '',
    doc_month : '',
    doc_day   : '',
    cat_id    : '',
    tier_id   : '',
  }
};

export default DocumentModal
