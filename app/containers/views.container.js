/**
 * Views Panels Container
 *
 * @author poluxGit
 * @extends React.Component
 */

import React  from 'react';
import ReactDOM from 'react-dom';
import DocumentEditView from './../views/document.edit';
import DocumentCreateView from './../views/document.create';
import TableDocumentView from './../views/document.table';
import Axios from 'axios';
import pubsub from 'pubsub-js';
import { Tabs, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';

// Main Panels Renderer & Manager !
class ViewsContainer extends React.Component {

  /**
   * Default Constructor
   */
  constructor(props) {
    // Properties
    super(props);

    // For globale events sniffing !
    //this.pubsub_token = [];

    this.state = {
      activeDocID   : null,
      viewName      : 'default',
      activePanelKey : '',
      panels        : []
    };

    // {
    //   id   : 'welcome',
    //   type : 'doc-edit',
    //   props : {
    //     docid : ''
    //   }

  }

  /**
   * Post render Event
   */
  componentWillMount() {
    // when React renders me, I subscribe to the topic 'products'
    // .subscribe returns a unique token necessary to unsubscribe
    this.pubsub_token_createdoc = pubsub.subscribe('open-doc-create-panel', function(topic) {
      console.log('ViewsContainer - Event "'+topic+'" received.');
      this.openCreateDocViewPanel();
    }.bind(this));

    this.pubsub_token_editdoc = pubsub.subscribe('open-doc-edit-panel', function(topic, docid) {
      console.log('ViewsContainer - Event "'+topic+'" received (docid:"'+docid+'").');
      this.openEditDocViewPanel(docid);
    }.bind(this));

    // Opening Tale of Document View
    this.pubsub_token_tabledoc = pubsub.subscribe('open-doc-table-panel', function(topic) {
      console.log('ViewsContainer - Event "'+topic+'" received.');
      this.openTableDocViewPanel();
    }.bind(this));
    //'open-doc-table-panel'
  }

  /**
  * Pre removed from DOM event
  */
  componentWillUnmount() {
    // React removed me from the DOM, I have to unsubscribe from the pubsub using my token
    pubsub.unsubscribe(this.pubsub_token_createdoc);
    pubsub.unsubscribe(this.pubsub_token_editdoc);
    pubsub.unsubscribe(this.pubsub_token_tabledoc);
  }

  // Open an existing Document View (edit mode)!
  openEditDocViewPanel(docid)
  {
      this.openNewPanel('doc-edit','Edition de document',{docid:docid});

  }

  // Open a new Document View Panels !
  openCreateDocViewPanel()
  {
    console.log('ViewsContainer - Opening a Document View in CREATION Mode');
    this.openNewPanel('doc-create','Nouveau Document',{});


  }

  // Open a Table about all documents View Panels !
  openTableDocViewPanel()
  {
    this.openNewPanel('doc-table','Tous les Documents',{});
  }

  // Open a new panels
  openNewPanel(type,title,options){
    console.log('ViewsContainer - Opening a new panel (Type:'+type+'|Title:"'+title+'").');
    var panels = this.state.panels;

    var newPanel = [{
      id    : 'panel_'+type,
      mode  : type,
      title : title,
      props : options
    }];
    panels = panels.concat(newPanel);
    this.setState({
      panels:panels,
      activePanelKey:'panel_'+type
    });
  }

  /**
   * Render components
   */
  render() {

    // <Tabs defaultActiveKey={2} id="uncontrolled-tab-example">
    //   <Tab eventKey={1} title="Tab 1">Tab 1 content</Tab>
    //   <Tab eventKey={2} title="Tab 2">Tab 2 content</Tab>
    //   <Tab eventKey={3} title="Tab 3" disabled>Tab 3 content</Tab>
    // </Tabs>

    var renderedPanels = [];
    // No Panels registered - Default Start Case!
    if(this.state.panels && this.state.panels.length === 0 ) {
      renderedPanels = (
        <Tab key={-1} eventKey={-1} title="Bienvenue">Veuillez sélectionner une action dans la barre de boutons.</Tab>
      );
      this.state.activePanelKey = -1;
    }
    else {
      this.state.panels.forEach( function(item,idx){
        if(item.mode === 'doc-create')
        {
          renderedPanels.push(<Tab key={item.id} eventKey={idx} title={item.title}>
              <DocumentCreateView />
            </Tab>
          );
        }
        else if (item.mode === 'doc-edit') {
          renderedPanels.push(<Tab key={item.id} eventKey={idx} title={item.title}>
              <DocumentEditView docid={item.props.docid} />
            </Tab>
          );
        }
        else if (item.mode === 'doc-table') {
          renderedPanels.push(<Tab key={item.id} eventKey={idx} title={item.title}>
              <TableDocumentView />
            </Tab>
          );
        }
      });
      this.state.activePanelKey = '';
    }

    return (
      <Tabs defaultActiveKey={this.state.activePanelKey} id="uncontrolled-tab-example">
        {renderedPanels}
      </Tabs>
    );
  }
}

// /** Properties definition **/
// ViewsContainer.PropTypes = {
//     CategoriesData  : React.PropTypes.array
// };
//
// ViewsContainer.defaultProps = {
//     CategoriesData  : [],
//     DocumentsData   : [],
//     TiersData       : [],
//     TypesDocData    : []
// };

export default ViewsContainer