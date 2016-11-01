/**
 * Document Creation  Form
 */
import React  from 'react';
import Axios from 'axios';
import { Form, FormGroup, ControlLabel, FormControl, Col, Button } from 'react-bootstrap';


const LocalData = require('./../application.storage');

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
        doc_id    : props.docattributes.doc_id,
        doc_title : props.docattributes.doc_title,
        doc_code  : props.docattributes.doc_code,
        doc_desc  : props.docattributes.doc_desc,
        tdoc_id   : props.docattributes.tdoc_id,
        doc_year  : props.docattributes.doc_year,
        doc_month : props.docattributes.doc_month,
        doc_day   : props.docattributes.doc_day,
        meta      : [],
        cat_id    : props.docattributes.cat_id,
        tier_id   : props.docattributes.tier_id,
        file_id   : props.docattributes.file_id
      }
    };
  }

  onTitleChanged(e)
  {
    this.setState( { docattributes : {
        doc_id    : this.state.docattributes.doc_id,
        doc_title : e.target.value,
        doc_code  : this.state.docattributes.doc_code,
        doc_desc  : this.state.docattributes.doc_desc,
        tdoc_id   : this.state.docattributes.tdoc_id,
        doc_year  : this.state.docattributes.doc_year,
        doc_month : this.state.docattributes.doc_month,
        doc_day   : this.state.docattributes.doc_day,
        meta      : this.state.docattributes.meta,
        cat_id    : this.state.docattributes.cat_id,
        tier_id   : this.state.docattributes.tier_id,
        file_id   : this.state.docattributes.file_id
      }});
  }
  onDescriptionChanged(e)
  {
    this.setState( {docattributes : {
        doc_id    : this.state.docattributes.doc_id,
        doc_title : this.state.docattributes.doc_title,
        doc_code  : this.state.docattributes.doc_code,
        doc_desc  : e.target.value,
        tdoc_id   : this.state.docattributes.tdoc_id,
        doc_year  : this.state.docattributes.doc_year,
        doc_month : this.state.docattributes.doc_month,
        doc_day   : this.state.docattributes.doc_day,
        meta      : this.state.docattributes.meta,
        cat_id    : this.state.docattributes.cat_id,
        tier_id   : this.state.docattributes.tier_id,
        file_id   : this.state.docattributes.file_id
      }});
  }
  onTypeDocChanged(e)
  {
    var lStrValue = e.target.value;
    if(e.target.value === "0" )
    {
      lStrValue = null;
    }
    this.setState(  {docattributes : {
        doc_id    : this.state.docattributes.doc_id,
        doc_title : this.state.docattributes.doc_title,
        doc_code  : this.state.docattributes.doc_code,
        doc_desc  : this.state.docattributes.doc_desc,
        tdoc_id   : lStrValue,
        doc_year  : this.state.docattributes.doc_year,
        doc_month : this.state.docattributes.doc_month,
        doc_day   : this.state.docattributes.doc_day,
        meta      : this.state.docattributes.meta,
        cat_id    : this.state.docattributes.cat_id,
        tier_id   : this.state.docattributes.tier_id,
        file_id   : this.state.docattributes.file_id
      }});
  }
  onCategorieChanged(e)
  {
    var lStrValue = e.target.value;
    if(e.target.value === "0" )
    {
      lStrValue = null;
    }
    this.setState( {docattributes : {
        doc_id    : this.state.docattributes.doc_id,
        doc_title : this.state.docattributes.doc_title,
        doc_code  : this.state.docattributes.doc_code,
        doc_desc  : this.state.docattributes.doc_desc,
        tdoc_id   : this.state.docattributes.tdoc_id,
        doc_year  : this.state.docattributes.doc_year,
        doc_month : this.state.docattributes.doc_month,
        doc_day   : this.state.docattributes.doc_day,
        meta      : this.state.docattributes.meta,
        cat_id    : lStrValue,
        tier_id   : this.state.docattributes.tier_id,
        file_id   : this.state.docattributes.file_id
      }});
  }
  onTierChanged(e)
  {
    var lStrValue = e.target.value;
    if(e.target.value === "0" )
    {
      lStrValue = null;
    }
    this.setState( {docattributes : {
        doc_id    : this.state.docattributes.doc_id,
        doc_title : this.state.docattributes.doc_title,
        doc_code  : this.state.docattributes.doc_code,
        doc_desc  : this.state.docattributes.doc_desc,
        tdoc_id   : this.state.docattributes.tdoc_id,
        doc_year  : this.state.docattributes.doc_year,
        doc_month : this.state.docattributes.doc_month,
        doc_day   : this.state.docattributes.doc_day,
        meta      : this.state.docattributes.meta,
        cat_id    : this.state.docattributes.cat_id,
        tier_id   : lStrValue,
        file_id   : this.state.docattributes.file_id
      }});
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
                  value={this.state.docattributes.cat_id == null ? 0:this.state.docattributes.cat_id}
                  onChange={this.handlerCategorieChanged}>
                  <option key={0} value={0}>...</option>
                  {categorieItems}
                </FormControl>
              </Col>
            </FormGroup>
            <FormGroup controlId="formControlsSelect_TierId">
              <Col componentClass={ControlLabel} sm={2}>Tier</Col>
              <Col sm={10}>
                <FormControl componentClass="select" placeholder="Choisir un Tier..."
                  value={this.state.docattributes.tier_id == null ? 0:this.state.docattributes.tier_id}
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
