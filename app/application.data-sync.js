/**
 * Server Data management - data-sync
 *
 * @polux
 */
import LocalData  from './application.storage';
import Axios      from 'axios';

/* ************************************************************************** */
/* HTTP Request
/* ************************************************************************** */

// Default configuration !
Axios.defaults.baseURL = LocalData.getAppSetting('url-restapi');

/**
 * Load Documents from server
 */
function loadDocumentsFromServer() {

  var lURLRestAPI = LocalData.getAppSetting('url-restapi');
  LocalData.addSessionLogMessage('ApplicationDataSynchronizer - Refresh Documents from "'+lURLRestAPI+'document/" !');

  // Launch AJAX Request !
  Axios.get('document/')
    .then(function(response){
      if(response.status == 200){
        console.log('ApplicationDataSynchronizer - HTTP GET Response OK (HTTP:200).');
        LocalData.addSessionLogMessage('ApplicationDataSynchronizer - HTTP GET Response OK (HTTP:200).');
        LocalData.setDocuments(response.data);
      }
      else {
        console.log('AppMyDocsContainer - Erreur lors du chargement des données de Document (HTTP Code:'+response.status+').');
      }
    }).catch(function(error){
      console.log(error);
    });
}

function loadCategoriesDataForDoc(docid)
{
  var lUrlGetMeta = 'document/'+docid+'/getcat/';

  let doc = docid;

  Axios.get(lUrlGetMeta)
    .then(function(response){
      if(response.status == 200){
        LocalData.setDocumentsCategories(doc,response.data);
      }
      else {
        console.log('AppMyDocsContainer - Erreur lors du chargement des données de Document (HTTP Code:'+response.status+').');
      }
    }).catch(function(error){
      console.log(error);
    });
}


function loadTiersDataForDoc(docid)
{
  var lUrlGetMeta = 'document/'+docid+'/gettiers/';

  let doc = docid;

  Axios.get(lUrlGetMeta)
    .then(function(response){
      if(response.status == 200){
        LocalData.setDocumentsTiers(doc,response.data);
      }
      else {
        console.log('AppMyDocsContainer - Erreur lors du chargement des données de Document (HTTP Code:'+response.status+').');
      }
    }).catch(function(error){
      console.log(error);
    });
}

function loadMetaDataForDoc(docid)
{
  var lUrlGetMeta = 'document/'+docid+'/getmeta/';

  let doc = docid;

  Axios.get(lUrlGetMeta)
    .then(function(response){
      if(response.status == 200){
        LocalData.setDocumentsMetas(doc,response.data);
      }
      else {
        console.log('AppMyDocsContainer - Erreur lors du chargement des données de Document (HTTP Code:'+response.status+').');
      }
    }).catch(function(error){
      console.log(error);
    });
}



/**
 * Load Metas, Categories and Tiers data for Documents from server
 */
function loadAllDataAboutDocuments()
{
  var lArrDocs = LocalData.getAllDocuments();

  for(var i=0;i<lArrDocs.length;i++)
  {
    loadCategoriesDataForDoc(lArrDocs[i].doc_id);
  }

  for(var i=0;i<lArrDocs.length;i++)
  {
    loadTiersDataForDoc(lArrDocs[i].doc_id);
  }

  for(var i=0;i<lArrDocs.length;i++)
  {
    loadMetaDataForDoc(lArrDocs[i].doc_id);
  }
}

/**
 * Load Catégories from server
 */
function loadCategoriesFromServer() {

  var lURLRestAPI = LocalData.getAppSetting('url-restapi');
  LocalData.addSessionLogMessage('ApplicationDataSynchronizer - Refresh Catégories from "'+lURLRestAPI+'categorie/" !');

  // Launch AJAX Request !
  Axios.get('categorie/')
    .then(function(response){
      if(response.status == 200){
        console.log('ApplicationDataSynchronizer - HTTP GET Response OK (HTTP:200).');
        LocalData.addSessionLogMessage('ApplicationDataSynchronizer - HTTP GET Response OK (HTTP:200).');
        LocalData.setCategories(response.data);
      }
      else {
        console.log('AppMyDocsContainer - Erreur lors du chargement des données de Catégorie (HTTP Code:'+response.status+').');
      }
    }).catch(function(error){
      console.log(error);
    });
}

/**
 * Load Tiers from server
 */
function loadTiersFromServer() {

  var lURLRestAPI = LocalData.getAppSetting('url-restapi');
  LocalData.addSessionLogMessage('ApplicationDataSynchronizer - Refresh Tiers from "'+lURLRestAPI+'tier/" !');

  // Launch AJAX Request !
  Axios.get('tier/')
    .then(function(response){
      if(response.status == 200){
        console.log('ApplicationDataSynchronizer - HTTP GET Response OK (HTTP:200).');
        LocalData.addSessionLogMessage('ApplicationDataSynchronizer - HTTP GET Response OK (HTTP:200).');
        LocalData.setTiers(response.data);
      }
      else {
        console.log('AppMyDocsContainer - Erreur lors du chargement des données de Tier (HTTP Code:'+response.status+').');
      }
    }).catch(function(error){
      console.log(error);
    });
}

/**
 * Load Tiers from server
 */
function loadTypesDocFromServer() {

  var lURLRestAPI = LocalData.getAppSetting('url-restapi');
  LocalData.addSessionLogMessage('ApplicationDataSynchronizer - Refresh Tiers from "'+lURLRestAPI+'typedoc/" !');

  // Launch AJAX Request !
  Axios.get('typedocument/')
    .then(function(response){
      if(response.status == 200){
        console.log('ApplicationDataSynchronizer - HTTP GET Response OK (HTTP:200).');
        LocalData.addSessionLogMessage('ApplicationDataSynchronizer - HTTP GET Response OK (HTTP:200).');
        LocalData.setTypeDocs(response.data);
      }
      else {
        console.log('AppMyDocsContainer - Erreur lors du chargement des données de typedoc (HTTP Code:'+response.status+').');
      }
    }).catch(function(error){
      console.log(error);
    });
}

// expose the methods as static module!
module.exports = {
  loadDocumentsFromServer   : loadDocumentsFromServer,
  loadTypesDocFromServer    : loadTypesDocFromServer,
  loadTiersFromServer       : loadTiersFromServer,
  loadCategoriesFromServer  : loadCategoriesFromServer,
  loadAllDataAboutDocuments : loadAllDataAboutDocuments
};
