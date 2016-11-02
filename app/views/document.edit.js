import React  from 'react';
import Axios from 'axios';
import pubsub from 'pubsub-js';
import { Form, FormGroup, ControlLabel, FormControl, Col, Button } from 'react-bootstrap';

const LocalData = require('./../application.storage');
const LocalDataSync = require('./../application.data-sync');
const _ = require('underscore');

/**
 * DocumentView : Document Renderer components
 */
class DocumentEditView extends React.Component {

  // Props is received via the constructor
  constructor(props) {
    //...and props is sent back to the parent Component
    //class using super()
    super(props);

    // Event Handlers
    this.handlerTitleChanged                          = this.onTitleChanged.bind(this);
    this.handlerDescChanged                           = this.onDescriptionChanged.bind(this);
    this.handlerTypeDocChanged                        = this.onTypeDocChanged.bind(this);
    this.handlerCategorieChanged                      = this.onCategorieChanged.bind(this);
    this.handlerTierChanged                           = this.onTierChanged.bind(this);
    this.handlerDateChanged                           = this.onDateChanged.bind(this);
    this._cancelUpdate                                = this._cancelUpdate.bind(this);
    this._deleteDoc                                   = this._deleteDoc.bind(this);
    this.handleSubmitFormEvent                        = this.handleSubmitFormEvent.bind(this);
    this._cbSubmitFormEventCallBackDocumentUpdated    = this._cbSubmitFormEventCallBackDocumentUpdated.bind(this);
    this._cbSubmitFormEventCallBackCategoriesCreated  = this._cbSubmitFormEventCallBackCategoriesCreated.bind(this);
    this._cbSubmitFormEventCallBackTiersCreated       = this._cbSubmitFormEventCallBackTiersCreated.bind(this);
    this._cbSubmitDocumentEventCallBackDeleted        = this._cbSubmitDocumentEventCallBackDeleted.bind(this);

    // Initial State of the component
    this.state = {
      docattributes : {
        doc_id    : props.props.docattributes.doc_id,
        doc_title : props.props.docattributes.doc_title,
        doc_code  : props.props.docattributes.doc_code,
        doc_desc  : props.props.docattributes.doc_desc,
        tdoc_id   : props.props.docattributes.tdoc_id,
        doc_year  : props.props.docattributes.doc_year,
        doc_month : props.props.docattributes.doc_month,
        doc_day   : props.props.docattributes.doc_day,
        metas     : [],
        cats    : [],
        tiers   : []
      }
    };

    // Getting only ids !
    this.state.docattributes.cats = _.pluck(props.props.docattributes.cats,'cat_id');
    this.state.docattributes.tiers = _.pluck(props.props.docattributes.tiers,'tier_id');
    this.state.docattributes.metas = props.props.docattributes.metas;
  }

  // Merge Documents attributes with param !
  _updateFieldValueInState(fieldValues)
  {
    var lArrayDocData = this.state.docattributes;
    _.extend(lArrayDocData,fieldValues);
    this.setState({docattributes:lArrayDocData});
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
    this._updateFieldValueInState({tdoc_id   : lStrValue});
  }
  onCategorieChanged(e)
  {
    var lStrValue = e.target.value;
    var lArrTiers = [];
    if(e.target.value !== "0" )
    {
      lArrTiers = this.state.docattributes.cats;
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
      lArrTiers = this.state.docattributes.tiers;
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

      };
    }
    this._updateFieldValueInState(lObjResultat);
  }

  _cancelUpdate(e) {
    pubsub.publish('close-panel', this.state.docattributes.doc_id);
  }

  handleSubmitFormEvent(e)
  {
      LocalDataSync.updateDocument(this.state.docattributes,this._cbSubmitFormEventCallBackDocumentUpdated);
  }

  /*
   * CallBack Submit Form Event
   */
  _cbSubmitFormEventCallBackDocumentUpdated(response) {

    if(response.status == 200)
    {
      pubsub.publish('app-message', {type:'success',message:'Document (id:"'+response.data+'") mis à jour avec succès.'});
      // Liaison des categories !
      LocalDataSync.addCategoriesToDocument(response.data,this.state.docattributes.cats,this._cbSubmitFormEventCallBackCategoriesCreated);
      // Liaison des Tiers !
      LocalDataSync.addTiersToDocument(response.data,this.state.docattributes.tiers,this._cbSubmitFormEventCallBackTiersCreated);

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
      pubsub.publish('app-message', {type:'success',message:'Document (id:"'+this.state.docattributes.doc_id+'") effacé avec succès.'});
    }
    else {
      pubsub.publish('app-message', {type:'error',message:'Error (Code:"'+response.status+'"|Message:"'+response.message+'"|Data:"'+JSON.stringify(response)+'").'});
    }
  }

  _deleteDoc(e){
    // @TODO Ajouter validation avant suppression!
    LocalDataSync.deleteDocument(this.state.docattributes.doc_id,this._cbSubmitDocumentEventCallBackDeleted);
    pubsub.publish('app-datareload-all', 'doc');
    pubsub.publish('close-panel', this.state.docattributes.doc_id);
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
    categorieObj.forEach(function(categorie){
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
    this.state.docattributes.metas.forEach(function(meta){
      var lStrIdControl = {
        id: 'formControlsText_'+meta.meta_id
      };
      metaControlItems.push(
        <FormGroup key={lStrIdControl.id} controlId={lStrIdControl.id}>
          <Col componentClass={ControlLabel} sm={2}>{meta.mdoc_title}</Col>
          <Col sm={10}>
            <FormControl
              componentClass="text"
              placeholder='Entrer une valeur...'
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
      <article id={this.props.docid}>
        <header>
          <h3 title={this.props.docid}>{this.props.props.docattributes.doc_title}</h3>
        </header>
        <Form horizontal>
          <FormGroup controlId='formControlsText_DocCode'>
              <Col componentClass={ControlLabel} sm={2}>Doc #</Col>
              <Col sm={10}>
                <FormControl
                  type='text'
                  disabled={true}
                  placeholder='Document Unique Code # AUTO'
                  value={this.state.docattributes.doc_code}
                  />
              </Col>
          </FormGroup>
          <FormGroup controlId="formControlsSelect_TypeDocId">
            <Col componentClass={ControlLabel} sm={2}>Type</Col>
            <Col sm={10}>
              <FormControl
                componentClass="select"
                disabled={true}
                placeholder="Choisir un type de document..."
                value={this.state.docattributes.tdoc_id == null ? 0:this.state.docattributes.tdoc_id}
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
                  value={this.state.docattributes.doc_title}
                  onChange={this.handlerTitleChanged} />
              </Col>
          </FormGroup>
          <FormGroup controlId='formControlsText_DocDate'>
              <Col componentClass={ControlLabel} sm={2}>Date</Col>
              <Col sm={10}>
                <FormControl
                  type="date"
                  placeholder='DD/MM/YYY'
                  value={(this.state.docattributes.doc_year && this.state.docattributes.doc_month && this.state.docattributes.doc_day)?this.state.docattributes.doc_year +'-'+ this.state.docattributes.doc_month+'-'+this.state.docattributes.doc_day:''}
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
                value={this.state.docattributes.cats}
                onChange={this.handlerCategorieChanged} multiple>
                {categorieItems}
              </FormControl>
            </Col>
          </FormGroup>
          <FormGroup controlId="formControlsSelect_TierId">
            <Col componentClass={ControlLabel} sm={2}>Tier</Col>
            <Col sm={10}>
              <FormControl componentClass="select" placeholder="Choisir un Tier..."
                value={this.state.docattributes.tiers}
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
                  value={this.state.docattributes.doc_desc}
                  onChange={this.handlerDescChanged} />
              </Col>
          </FormGroup>
          {metaControlItems}

          <div style={styleDivBouton}>
            <Button bsStyle="primary" style={styleBouton} onClick={this.handleSubmitFormEvent}>
              Mise à jour
            </Button>
            <Button bsStyle="danger" style={styleBouton} onClick={this._deleteDoc}>
              Supprimer
            </Button>
            <Button bsStyle="default" style={styleBouton} onClick={this._cancelUpdate}>
              Annuler
            </Button>
          </div>

        </Form>

          <p>&nbsp;</p>
        <footer> </footer>
      </article>
    );
  }
}

/* Properties Definition */
DocumentEditView.PropTypes = {
    docid         : React.PropTypes.string,
    docattributes : React.PropTypes.array

};

/* Default Properties values */
DocumentEditView.defaultProps = {
  docattributes : {
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




export default DocumentEditView
