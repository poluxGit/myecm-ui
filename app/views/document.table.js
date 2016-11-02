import React  from 'react';
import Axios from 'axios';
import pubsub from 'pubsub-js';

import {BootstrapTable, TableHeaderColumn, Badge} from 'react-bootstrap-table';


const LocalData = require('./../application.storage');
/**
 * DocumentView : Document Renderer components
 */
class DocumentTable extends React.Component {

  // Props is received via the constructor
  constructor(props) {
    //...and props is sent back to the parent Component
    //class using super()
    super(props);
  }

  // Formatting Date Column
  _dataFormatDateDoc(cell,row){
    return row.doc_year+'-'+row.doc_month+'-'+row.doc_day || 'Not defined!';
  }

  // Formating TypeDoc Column : binding real name
  _dataFormatTypeDoc(cell,row){
    var resultat = cell;
    if(cell) {
      var lObjCat = LocalData.getTypeDocById(cell);
      resultat = lObjCat.tdoc_title;
    }
    return resultat;
  }

  // Formating TypeDoc Column : binding real name
  _dataFormatTiers(cell,row){
    var lStrResultat = '';
    for(var i=0;i<cell.length;i++){
      var title = cell[i].tier_title;
      lStrResultat += '<Badge> '+title+' </Badge><br />';
    }
    return lStrResultat;
  }

  // Formating TypeDoc Column : binding real name
  _dataFormatCats(cell,row){
    var lStrResultat = '';
    for(var i=0;i<cell.length;i++){
      var title = cell[i].cat_title;
      lStrResultat += '<Badge> '+title+' </Badge><br />';
    }
    return lStrResultat;
  }

  handlerSelectDocument(row,isSelected,event){
    pubsub.publish('open-doc-edit-panel', row.doc_id);
  }


  // Render Components !
  render() {
    var rows = LocalData.getAllDocuments();
    var selectPropsRow = {
      mode: "radio",  //checkbox for multi select, radio for single select.
      clickToSelect: true,   //click row will trigger a selection on that row.
      bgColor: "rgb(238, 193, 213)",   //selected row background color
      onSelect:this.handlerSelectDocument
    };
    return (
      <div>
        <h2> Liste des documents </h2>
        <BootstrapTable
        	data={rows}
        	striped={true}
        	hover={true}
        	condensed={true}
        	pagination={false}
        	selectRow={selectPropsRow}
        	insertRow={false}
        	deleteRow={false}
        	columnFilter={false}
        	search={true}>
          <TableHeaderColumn dataField="doc_id" isKey={true} hidden={true} dataAlign="left" dataSort={true}>ID</TableHeaderColumn>
          <TableHeaderColumn dataField="tdoc_id" dataSort={true} dataFormat={this._dataFormatTypeDoc}>Type</TableHeaderColumn>
          <TableHeaderColumn dataField="doc_title" dataSort={true}>Titre</TableHeaderColumn>
          <TableHeaderColumn dataField="doc_year" dataAlign="left" dataFormat={this._dataFormatDateDoc}>Date</TableHeaderColumn>
          <TableHeaderColumn dataField="doc_month" hidden={true} dataAlign="left">Mois</TableHeaderColumn>
          <TableHeaderColumn dataField="doc_day" hidden={true} dataAlign="left">Jour</TableHeaderColumn>
          <TableHeaderColumn dataField="cats" dataAlign="center" dataFormat={this._dataFormatCats}>Catégorie(s)</TableHeaderColumn>
          <TableHeaderColumn dataField="tiers" dataAlign="center" dataFormat={this._dataFormatTiers}>Tier(s)</TableHeaderColumn>
          <TableHeaderColumn dataField="doc_desc" dataAlign="center">Description</TableHeaderColumn>
          <TableHeaderColumn dataField="doc_code" dataAlign="center">Code</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}

export default DocumentTable
