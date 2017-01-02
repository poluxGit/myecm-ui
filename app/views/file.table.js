
import React  from 'react';
import Axios from 'axios';
import pubsub from 'pubsub-js';

import {BootstrapTable, TableHeaderColumn, Badge} from 'react-bootstrap-table';


const LocalData = require('./../application.storage');
/**
 * DocumentView : Document Renderer components
 */
class FilesTable extends React.Component {

  // Props is received via the constructor
  constructor(props) {
    //...and props is sent back to the parent Component
    //class using super()
    super(props);
  }

  handlerSelectDocument(row,isSelected,event){
    pubsub.publish('app-file-open', row.file_id);
  }
  // Render Components !
  render() {
    var rows = LocalData.getAllFiles();
    var selectPropsRow = {
      mode: "checkbox",  //checkbox for multi select, radio for single select.
      clickToSelect: true,   //click row will trigger a selection on that row.
      bgColor: "rgb(238, 193, 213)",   //selected row background color
      onSelect:this.handlerSelectDocument
    };
    return (
      <div>
        <h2> Liste des Fichiers ({rows != null ? rows.length:0})</h2>
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
          <TableHeaderColumn dataField="file_id" isKey={true} dataAlign="center" dataSort={true}>Int. #ID</TableHeaderColumn>
          <TableHeaderColumn dataField="file_originalname" dataSort={true}>Filename</TableHeaderColumn>
          <TableHeaderColumn dataField="file_size" dataSort={true}>Size</TableHeaderColumn>
          <TableHeaderColumn dataField="file_mime" dataAlign="center">Mime</TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}

export default FilesTable
