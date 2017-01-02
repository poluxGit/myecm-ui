/**
 * Main Application Container
 *
 * Defines all page behavior Main frontend Application React Class
 *
 * @author polux
 * @extends React.Component
 */
import React                from 'react';
import Search               from './components/search.component';
import AppHistory           from './components/history.component';
import Toolbar              from './components/toolbar.component';
//import ViewsContainer       from './containers/views.container';
import FilesTable           from './views/file.table';
import CategorieModal       from './views/categorie.view';
import DocumentModal        from './views/document.view';
import FileModal            from './views/file.view';
import TierModal            from './views/tier.view';
import AppMessages          from './components/message.component';
import pubsub               from 'pubsub-js';
import Axios                from 'axios';
import { PageHeader, Button , Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';

const localData     = require('./application.storage');
const localDataSync = require('./application.data-sync');

// Main GUI Class - React.component Class extended
class AppMyDocsContainer extends React.Component {

  /**
   * Default constructor
   */
  constructor(props) {

    super(props);
    this.handleCreateDoc = this.handleCreateDoc.bind(this);

    // State default data!
    this.state = {
      value : null,
      html_items  : {
        containerId   : 'mainApplicationDiv',
        headerId      : 'mainHeaderPanel',
        mainPanelId   : 'page-wrapper',
        leftPanelId   : 'mainLeftPanel',
        rightPanelId  : 'mainRightPanel',
        footerId      : 'mainWindowFooter'
      },
      docs_data :[],
      cat_data  :[],
      tier_data :[],
      tydoc_data:[]
    };
  }

  /**
   * Post render Event
   */
  componentWillMount() {
    // when React renders me, I subscribe to the topic 'products'
    // .subscribe returns a unique token necessary to unsubscribe
    this.pubsub_token = pubsub.subscribe('app-datareload-all', function(topic, docid) {
      console.log('AppMyDocsContainer - Event "'+topic+'" received - (data:"'+docid+'").');
      localData.addSessionHistoryMessage('Demande de rechargement de données interceptée par l\'application');
      this.reloadData();

    }.bind(this));
  }

  /* load/Reload data */
  reloadData(){

    localData.addSessionHistoryMessage('Loading document data from server.');
    localDataSync.loadDocumentsFromServer();

    localData.addSessionHistoryMessage('Loading categories data from server.');
    localDataSync.loadCategoriesFromServer();

    localData.addSessionHistoryMessage('Loading tiers data from server.');
    localDataSync.loadTiersFromServer();

    localData.addSessionHistoryMessage('Loading typedocs data from server.');
    localDataSync.loadTypesDocFromServer();

    localData.addSessionHistoryMessage('Loading files metadata from server.');
    localDataSync.loadFilesMetaFromServer();

    localData.addSessionHistoryMessage('Loading all data about documents from server.');
    localDataSync.loadAllDataAboutDocuments();
  }

  /**
  * Pre removed from DOM event
  */
  componentWillUnmount() {
    // React removed me from the DOM, I have to unsubscribe from the pubsub using my token
    pubsub.unsubscribe(this.pubsub_token);
  }

  /**
   * Handle Search Event Management
   */
  handleSearchChildEvent(searchQueryString) {
    console.log(`AppMyDocsContainer - Event searchDoc launched (value:`+searchQueryString+`).`);
    //    this.addPanel(docid);
  }

  // React input update (binding) is manual which
  // makes it rubust. This is how you keep the input box
  // in sync with keystroke inputs
  handleChange(e) {
    // New values are availbale from the event object
    this.setState({value: e.target.value});
  }

  // Update state Value attribute
  handleCreateDoc(e) {
    console.log(`AppMyDocsContainer - Event CreateDoc launched.`);
    pubsub.publish('app-doc-create', null);
    localData.addSessionHistoryMessage('Création de document.');
  }
  // Update state Value attribute
  handleEditDoc(docId) {
    console.log(`AppMyDocsContainer - Event EditDoc launched on '`+docId+`'.`);
    pubsub.publish('app-doc-edit', docId);
    localData.addSessionHistoryMessage('Edition de document "'+docId+'".');
  }

  // Display all docuement in table
  handleDisplayTableDoc(e){
    console.log(`AppMyDocsContainer - Event DisplayAllDocs launched.`);
    pubsub.publish('open-doc-table-panel', null);
    localData.addSessionHistoryMessage('Affichage du tableau de documents.');
  }

  handleAddTypeDoc(){
    pubsub.publish('app-tier-edit', 'tie-edf');
    localData.addSessionHistoryMessage('Edition du tier => .');
  }

  handleEditTier(tierId){
    pubsub.publish('app-tier-edit', tierId);
    localData.addSessionHistoryMessage('Edition du tier => '+tierId);
  }

  handleEditCat(catId){
    pubsub.publish('app-cat-edit', catId);
    localData.addSessionHistoryMessage('Edition de la Catégorie => '+catId);
  }

  handleAddCat(){
    pubsub.publish('app-cat-create', null);
    localData.addSessionHistoryMessage('Ouverture du formulaire de création de Catégorie.');
  }

  handleAddTier(){
    pubsub.publish('app-tier-create', null);
    localData.addSessionHistoryMessage('Ouverture du formulaire de création de Tier.');
  }

  // Container components wrap presentation component
  render() {
    return (
      <div id={this.state.html_items.containerId}>
        <PageHeader id={this.state.html_items.headerId}>
           {this.props.application_title} <small> {this.props.application_author.author_name} </small>
         <AppMessages />
        </PageHeader>

        <Navbar inverse collapseOnSelect>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">MyDocs</a>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavDropdown eventKey={1} title="Lister les ..." id="basic-nav-dropdown">
                <MenuItem eventKey={1.1} onClick={this.handleDisplayTableDoc}>Documents</MenuItem>
              </NavDropdown>

            </Nav>
            <Nav pullRight>
              <NavDropdown eventKey={10} title="Ajouter ..." id="basic-nav-dropdown">
                <MenuItem eventKey={10.4} onClick={this.handleCreateDoc}>Document</MenuItem>
                <MenuItem eventKey={10.1} onClick={this.handleAddCat}>Catégorie</MenuItem>
                <MenuItem eventKey={10.2} onClick={this.handleAddTier}>Tier</MenuItem>
                <MenuItem eventKey={10.3} onClick={this.handleAddTypeDoc}>Type de document</MenuItem>
                <MenuItem eventKey={10.5} onClick={()=>{this.handleEditTier('tie-edf');}}>Edit Tier Test DEV</MenuItem>
                <MenuItem eventKey={10.6} onClick={()=>{this.handleEditDoc('doc-58658d671ffd5');}}>Edit Doc Test DEV</MenuItem>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <article id={this.state.html_items.mainPanelId}>
          <div id={this.state.html_items.leftPanelId}>
            <ul id="leftPanelNavItems">

              <Search searchDoc={this.handleSearchChildEvent} />
              <AppHistory />
            </ul>
          </div>
          <div id={this.state.html_items.rightPanelId}>
                <FilesTable />
          </div>
        </article>
        <CategorieModal />
        <FileModal />
        <DocumentModal />
        <TierModal />
        <footer id={this.state.html_items.footerId}>
            By {this.props.application_author.author_name} - {this.props.application_version}
        </footer>
      </div>
    );
  }
}

/** Properties definition **/
AppMyDocsContainer.PropTypes = {
    application_title       : React.PropTypes.string,
    application_version     : React.PropTypes.string,
    application_author      : React.PropTypes.array,
    application_server_url  : React.PropTypes.string
};

/** Default Mandatory Properties Values  **/
AppMyDocsContainer.defaultProps = {
  application_title   : 'App. Default Title',
  application_version : 'Not defined',
  application_author  : {
    author_name : 'App. AuthorName',
    author_mail : 'App. AuthorEMail',
    github_url  : 'App. GitRepoURL'
  }
};

export default AppMyDocsContainer
