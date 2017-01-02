/**
 * Server Data management - data-sync
 *
 * @polux
 */
import LocalData  from './application.storage';
import Axios      from 'axios';

const _ = require('underscore');

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

/**
 * Load Files metadata from server
 */
function loadFilesMetaFromServer() {

  var lURLRestAPI = LocalData.getAppSetting('url-restapi');
  LocalData.addSessionLogMessage('ApplicationDataSynchronizer - Refresh Files metadata from "'+lURLRestAPI+'file/" !');

  // Launch AJAX Request !
  Axios.get('file/')
    .then(function(response){
      if(response.status == 200){
        console.log('ApplicationDataSynchronizer - HTTP GET Response OK (HTTP:200).');
        LocalData.addSessionLogMessage('ApplicationDataSynchronizer - HTTP GET Response OK (HTTP:200).');
        LocalData.setFiles(response.data);
      }
      else {
        console.log('AppMyDocsContainer - Erreur lors du chargement des données des Fichiers (HTTP Code:'+response.status+').');
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

// Adding a new Catégorie!
function createNewTier(tierdata, callbackHandler) {
  console.log('ApplicationDataSynchronizer - HTTP POST Request About Tier creation.');
  // Data existance checks!
  if(tierdata.tier_code && tierdata.tier_title)
  {
    var query_param = tierdata;
    var params = '';
    var key = '';
    for (key in query_param) {
        params += encodeURIComponent(key)+"="+encodeURIComponent(query_param[key])+"&";
    }

    var query_options = {
      headers:{'Content-Type': 'application/x-www-form-urlencoded'}
    };
    var lUrlQuery = 'tier/'

    // Launch AJAX Request !
    Axios.post(lUrlQuery, params,query_options)
      .then(function(response){
        if(response.status == 200){
          console.log('ApplicationDataSynchronizer - HTTP POST Response OK (HTTP:200).');
          LocalData.addSessionLogMessage('HTTP POST - Création de TIER - Code:200 => OK | Data returned: '+JSON.stringify(response));
        }
        else {
          console.log('AppMyDocsContainer - Erreur lors de la création d\'un Tier (HTTP Code:'+response.status+').');
        }
        callbackHandler(response);
      }).catch(function(error){
        console.log(error);
      });
  }else {
    console.err('AppMyDocsContainer - Erreur lors de la création d\'un Tier).');
    throw new Error('Impossible de créer un tier. Les arguments sont insuffisants!');
  }

}



/**
 * Create a New Document
 *
 */
 // Adding a new Catégorie!
 function createNewDocument(docsdata, callbackHandler) {
   console.log('ApplicationDataSynchronizer - HTTP POST Request About Document creation.');
   // Data existance checks!
   if(docsdata.doc_title)
   {
     var query_param = docsdata;
     var params = '';
     var key = '';
     for (key in query_param) {
         params += encodeURIComponent(key)+"="+encodeURIComponent(query_param[key])+"&";
     }

     var query_options = {
       headers:{'Content-Type': 'application/x-www-form-urlencoded'}
     };
     var lUrlQuery = 'document/';

     // Launch AJAX Request !
     Axios.post(lUrlQuery, params,query_options)
       .then(function(response){
         if(response.status == 200){
           console.log('ApplicationDataSynchronizer - HTTP POST Response OK (HTTP:200).');
           LocalData.addSessionLogMessage('HTTP POST - Création de Document - Code:200 => OK | Data returned: '+JSON.stringify(response));
         }
         else {
           console.log('AppMyDocsContainer - Erreur lors de la création d\'un Document (HTTP Code:'+response.status+').');
         }
         callbackHandler(response);
       }).catch(function(error){
         console.log(error);
       });
   }else {
     console.err('AppMyDocsContainer - Erreur lors de la création d\'un Document).');
     throw new Error('Impossible de créer un Document. Les arguments sont insuffisants!');
   }
 }//end createNewDocument()


 /**
  * Update a Document
  *
  */
function updateDocument(docsdata, callbackHandler) {
  console.log('ApplicationDataSynchronizer - HTTP POST Request About Document update.');
  // Data existance checks!
  if(docsdata.doc_title)
  {
    var query_param = docsdata;
    var params = '';
    var key = '';
    for (key in query_param) {
        params += encodeURIComponent(key)+"="+encodeURIComponent(query_param[key])+"&";
    }

    var query_options = {
      headers:{'Content-Type': 'application/x-www-form-urlencoded'}
    };
    var lUrlQuery = 'document/'+docsdata.doc_id+'/';

    // Launch AJAX Request !
    Axios.put(lUrlQuery, params,query_options)
      .then(function(response){
        if(response.status == 200){
          console.log('ApplicationDataSynchronizer - HTTP PUT Response OK (HTTP:200).');
          LocalData.addSessionLogMessage('HTTP POST - Maj de Document - Code:200 => OK | Data returned: '+JSON.stringify(response));
        }
        else {
          console.log('AppMyDocsContainer - Erreur lors de la création d\'un Document (HTTP Code:'+response.status+').');
        }
        callbackHandler(response);
      }).catch(function(error){
        console.log(error);
      });
  } else {
    console.err('AppMyDocsContainer - Erreur lors de la création d\'un Document).');
    throw new Error('Impossible de créer un Document. Les arguments sont insuffisants!');
  }
}//end updateDocument()

/**
 * Update a Document
 *
 */
function updateTier(tierdata, callbackHandler) {

  console.log('ApplicationDataSynchronizer - HTTP PUT Request About Tier update.');
  // Data existance checks!
  if(tierdata.tier_code && tierdata.tier_title)
  {
    var query_param = tierdata;
    var params = '';
    var key = '';
    for (key in query_param) {
        params += encodeURIComponent(key)+"="+encodeURIComponent(query_param[key])+"&";
    }

    var query_options = {
      headers:{'Content-Type': 'application/x-www-form-urlencoded'}
    };
    var lUrlQuery = 'tier/'+tierdata.tier_id+'/';

    // Launch AJAX Request !
    Axios.put(lUrlQuery, params,query_options)
      .then(function(response){
        if(response.status == 200){
          console.log('ApplicationDataSynchronizer - HTTP PUT Response OK (HTTP:200).');
          LocalData.addSessionLogMessage('HTTP PUT - Update de TIER - Code:200 => OK | Data returned: '+JSON.stringify(response));
        }
        else {
          console.log('AppMyDocsContainer - Erreur lors de la création d\'un Tier (HTTP Code:'+response.status+').');
        }
        callbackHandler(response);
      }).catch(function(error){
        console.log(error);
      });
  }else {
    console.err('AppMyDocsContainer - Erreur lors de la mise à jour d\'un Tier).');
    throw new Error('Impossible de mettre à jour un tier. Les arguments sont insuffisants!');
  }
}//end updateTier()

/**
 * Delete a Document
 *
 */
function deleteDocument(doc_id, callbackHandler) {
 console.log('ApplicationDataSynchronizer - HTTP POST Request About Document update.');
 // Data existance checks!
 if(doc_id)
 {

   var lUrlQuery = 'document/'+doc_id;

   // Launch AJAX Request !
   Axios.delete(lUrlQuery)
     .then(function(response){
       if(response.status == 200){
         console.log('ApplicationDataSynchronizer - HTTP DELETE Response OK (HTTP:200).');
         LocalData.addSessionLogMessage('HTTP POST - Suppression de Document - Code:200 => OK | Data returned: '+JSON.stringify(response));
       }
       else {
         console.log('AppMyDocsContainer - Erreur lors de la suppression de Document (HTTP Code:'+response.status+').');
       }
       callbackHandler(response);
     }).catch(function(error){
       console.log(error);
     });
 }else {
   console.err('AppMyDocsContainer - Erreur lors de la création d\'un Document).');
   throw new Error('Impossible de créer un Document. Les arguments sont insuffisants!');
 }
}//end updateDocument()




 /**
  * Link a Categorie to Document!
  *
  */
 function addCategoriesToDocument(doc_id, cats, callbackHandler) {
   console.log('ApplicationDataSynchronizer - HTTP POST Request About Cat/Doc links creation.');

   // Data existance checks!
   if(doc_id && cats && cats.length >0)
   {
     var cat='';
     var lStrArrayHTTPQuery = [];
     for(var i=0;i<cats.length;i++){
       cat= cats[i];
       var lUrlQuery = 'document/' + doc_id + '/addcat/' + cat;
       // Add promise to array for further execution!
       lStrArrayHTTPQuery.push(Axios.post(lUrlQuery));
     }

     // Launch all promises!
     Axios.all(lStrArrayHTTPQuery)
       .then(function(responses){

         var lBoolResult = true;
         var response = {};

         responses.forEach(function(resp,itemIdx){
           lBoolResult = lBoolResult && (resp.status === 200);
         });

         if(lBoolResult===true)
         {
           response.status = 200;
         }
         response.data = _.pluck(responses,'data');
         LocalData.addSessionLogMessage('HTTP POST - Créations de lien Cat/Doc - Code:200 => OK | Data returned: '+JSON.stringify(response));

         callbackHandler(response);
       }).catch(function(error){
         console.log(error);
       });
   }
   else
   {
     console.err('AppMyDocsContainer - Erreur lors de la création d\'un lien Cat/Doc).');
     throw new Error('Impossible de créer un lien Tier/Doc. Les arguments sont insuffisants!');
   }
 }//end addCategoriesToDocument

/**
 * Link a Tiers to Document!
 *
 */
function addTiersToDocument(doc_id, tiers, callbackHandler) {
  console.log('ApplicationDataSynchronizer - HTTP POST Request About Cat/Doc links creation.');

  // Data existance checks!
  if(doc_id && tiers && tiers.length >0)
  {
    var tier='';
    var lStrArrayHTTPQuery = [];
    for(var i=0;i<tiers.length;i++){
      tier= tiers[i];
      var lUrlQuery = 'document/' + doc_id + '/addtier/' + tier;
      // Add promise to array for further execution!
      lStrArrayHTTPQuery.push(Axios.post(lUrlQuery));
    }

    // Launch all promises!
    Axios.all(lStrArrayHTTPQuery)
      .then(function(responses){

        var lBoolResult = true;
        var response = {};

        responses.forEach(function(resp,itemIdx){
          lBoolResult = lBoolResult && (resp.status === 200);
        });

        if(lBoolResult===true)
        {
          response.status = 200;
        }
        response.data = _.pluck(responses,'data').join(', ');
        LocalData.addSessionLogMessage('HTTP POST - Créations de lien Tier/Doc - Code:200 => OK | Data returned: '+JSON.stringify(response));

        callbackHandler(response);
      }).catch(function(error){
        console.log(error);
      });
  }
  else
  {
    console.err('AppMyDocsContainer - Erreur lors de la création d\'un lien Tier/Doc).');
    throw new Error('Impossible de créer un lien Tier/Doc. Les arguments sont insuffisants!');
  }
}//end addTiersToDocument

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

/**
 * Launch OCR Analysis on server
 */
function createOCRAnalysisOnServer(callbackHandler) {

  var lURLRestAPI = LocalData.getAppSetting('url-restapi');
  LocalData.addSessionLogMessage('ApplicationDataSynchronizer - Init an OCR Analysis Task !');

  // Launch AJAX Request !
  Axios.post('tasks/ocr/')
    .then(function(response){
      if(response.status == 200){
        console.log('ApplicationDataSynchronizer - HTTP POST Response OK (HTTP:200).');
        LocalData.addSessionLogMessage('ApplicationDataSynchronizer - HTTP POST Response OK (HTTP:200).');
        callbackHandler(response.data);
      }
      else {
        console.log('AppMyDocsContainer - Erreur lors du lancment de l\'analyse OCR (HTTP Code:'+response.status+').');
      }
    }).catch(function(error){
      console.log(error);
    });
}

/**
 * Launch OCR Analysis on server
 */
function launchOCRAnalysisOnServer(taskid,fileid,callbackHandler) {

  var lURLRestAPI = LocalData.getAppSetting('url-restapi');
  LocalData.addSessionLogMessage('ApplicationDataSynchronizer - Launch OCR Analysis "'+taskid+'" on file "'+fileid+'" !');

  // Launch AJAX Request !
  Axios.post('tasks/ocr/'+taskid+'/'+fileid+'/')
    .then(function(response){
      if(response.status == 200){
        console.log('ApplicationDataSynchronizer - HTTP POST Response OK (HTTP:200).');
        LocalData.addSessionLogMessage('ApplicationDataSynchronizer - HTTP POST Response OK (HTTP:200).');
        callbackHandler(response.data);
      }
      else {
        console.log('AppMyDocsContainer - Erreur lors du lancment de l\'analyse OCR (HTTP Code:'+response.status+').');
      }
    }).catch(function(error){
      console.log(error);
    });
}

/**
 * Launch OCR Analysis on server
 */
function getTaskInfo(taskid) {

  var lURLRestAPI = LocalData.getAppSetting('url-restapi');
  LocalData.addSessionLogMessage('ApplicationDataSynchronizer - Getting data about task #'+taskid+' !');

  // Launch AJAX Request !
  Axios.get('tasks/'+taskid+'/')
    .then(function(response){
      if(response.status == 200){
        console.log('ApplicationDataSynchronizer - HTTP GET Response OK (HTTP:200).');
        LocalData.addSessionLogMessage('ApplicationDataSynchronizer - HTTP GET Response OK (HTTP:200).');
        return response.data;
      }
      else {
        console.log('AppMyDocsContainer - Erreur lors du lancment de l\'analyse OCR (HTTP Code:'+response.status+').');
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
  loadFilesMetaFromServer   : loadFilesMetaFromServer,
  loadAllDataAboutDocuments : loadAllDataAboutDocuments,

  // Creation function!
  createCategorie           : createNewCategorie,
  createTier                : createNewTier,
  createDocument            : createNewDocument,
  createOCRAnalysisOnServer : createOCRAnalysisOnServer,
  launchOCRAnalysisOnServer : launchOCRAnalysisOnServer,
  getTaskInfo               : getTaskInfo,

  addCategoriesToDocument   : addCategoriesToDocument,
  addTiersToDocument        : addTiersToDocument,

  deleteDocument            : deleteDocument,
  updateDocument            : updateDocument,
  updateTier                : updateTier
};
