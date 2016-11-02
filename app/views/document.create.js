/**
 * Document Creation  Form
 */
import React  from 'react';
import Axios from 'axios';
import { Form, FormGroup, ControlLabel, FormControl, Col, Button } from 'react-bootstrap';


const LocalData = require('./../application.storage');
const _ = require('underscore');

/**
 * DocumentCreateView : Document Renderer components
 */
class DocumentCreateView extends React.Component {

  // Props is received via the constructor
  constructor(props) {
    //...and props is sent back to the parent Component
    //class using super()
    super(props);

    this.handlerTitleChanged    = this.onTitleChanged.bind(this);
    this.handlerDescChanged     = this.onDescriptionChanged.bind(this);
    this.handlerTypeDocChanged  = this.onTypeDocChanged.bind(this);
    this.handlerCategorieChanged  = this.onCategorieChanged.bind(this);
    this.handlerTierChanged  = this.onTierChanged.bind(this);

    // Initial State of the component is defined
    // in the constructor also
    this.state = {
      docattributes : {
        doc_id    : '',
        doc_title : '',
        doc_code  : '',
        doc_desc  : '',
        tdoc_id   : '',
        doc_year  : '',
        doc_month : '',
        doc_day   : '',
        metas     : [],
        cats      : [],
        tiers     : [],
        files     : []
      }
    };
  }

  // Merge Categorie attributes with param !
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
    this._updateFieldValueInState({cats: lArrTiers});
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

  // Render Components !
  render() {
    // Options for SELECT !
    var categorieItems  = [];
    var tierItems       = [];
    var typdocItems     = [];

    var categorieObj  = LocalData.getAllCategories();
    var tierObj       = LocalData.getAllTiers();
    var typdocObj     = LocalData.getAllTypeDocs();



    // Generate Options HTML Tag for Categorie!
    categorieObj.forEach(function(categorie){
      categorieItems.push(<option key={categorie.cat_id} value={categorie.cat_id}>{categorie.cat_title}</option>);
    });
    // Generate Options HTML Tag for Tier!
    tierObj.forEach(function(tier){
      tierItems.push(<option key={tier.tier_id} value={tier.tier_id}>{tier.tier_title}</option>);
    });
    // Generate Options HTML Tag for  Type De Document!
    typdocObj.forEach(function(typedoc){
      typdocItems.push(<option key={typedoc.tdoc_id} value={typedoc.tdoc_id}>{typedoc.tdoc_title}</option>);
    });



    // CREATION MODE !
    return (
        <article id={0}>
          <header>
            <h3> Nouveau Document </h3>
          </header>
          <Form horizontal>
            <FormGroup controlId="formControlsSelect_TypeDocId">
              <Col componentClass={ControlLabel} sm={2}>Type</Col>
              <Col sm={10}>
                <FormControl
                  componentClass="select"
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
                  onChange={this.handlerCategorieChanged}
                  multiple>
                  <option key={0} value={0}>...</option>
                  {categorieItems}
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup controlId="formControlsSelect_TierId">
              <Col componentClass={ControlLabel} sm={2}>Tier</Col>
              <Col sm={10}>
                <FormControl componentClass="select" placeholder="Choisir un Tier..." multiple
                  value={this.state.docattributes.tiers}
                  onChange={this.handlerTierChanged}>
                  <option key={0} value={0}>...</option>
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

            <Button type="submit">
              Créer
            </Button>

          </Form>

            <p>&nbsp;</p>
          <footer> Footer Article {this.props.docid} </footer>
        </article>
      );

  }

}


/* Properties Definition */
DocumentCreateView.PropTypes = {
    docid         : React.PropTypes.string,
    docattributes : React.PropTypes.array
};

/* Default Properties values */
DocumentCreateView.defaultProps = {
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




export default DocumentCreateView
