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

// Adding a new Catégorie!
function createNewCategorie(catdata, callbackHandler) {
  console.log('ApplicationDataSynchronizer - HTTP POST Request About Catégorie creation.');
  // Data existance checks!
  if(catdata.cat_code && catdata.cat_title)
  {
    var query_param = {
      'cat_id': catdata.cat_id,
      'cat_code': catdata.cat_code,
      'cat_title': catdata.cat_title,
      'cat_desc': catdata.cat_desc
    };
    var params = '';
    var key = '';
    for (key in query_param) {
        params += encodeURIComponent(key)+"="+encodeURIComponent(query_param[key])+"&";
    }

    var query_options = {
      headers:{'Content-Type': 'application/x-www-form-urlencoded'}
    };
    var lUrlQuery = 'categorie/'

    // Launch AJAX Request !
    Axios.post(lUrlQuery, params,query_options)
      .then(function(response){
        if(response.status == 200){
          console.log('ApplicationDataSynchronizer - HTTP POST Response OK (HTTP:200).');
          LocalData.addSessionLogMessage('HTTP POST - Création de Catégorie - Code:200 => OK | Data returned: '+JSON.stringify(response));
        }
        else {
          console.log('AppMyDocsContainer - Erreur lors de la création d\'une Catégorie (HTTP Code:'+response.status+').');
        }
        callbackHandler(response);
      }).catch(function(error){
        console.log(error);
      });
  }else {
    console.err('AppMyDocsContainer - Erreur lors de la création d\'une Catégorie ).');
    throw new Error('Impossible de créer une catégorie. Les arguments sont insuffisants!');
  }

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
  // Load functionnalities
  loadDocumentsFromServer   : loadDocumentsFromServer,
  loadTypesDocFromServer    : loadTypesDocFromServer,
  loadTiersFromServer       : loadTiersFromServer,
  loadCategoriesFromServer  : loadCategoriesFromServer,
  loadAllDataAboutDocuments : loadAllDataAboutDocuments,

  // Creation function!
  createCategorie           : createNewCategorie
};
