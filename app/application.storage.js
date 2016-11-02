/**
 * Data Persistance module
 *
 * @polux
 */

import pubsub from 'pubsub-js';
const localStorage    = global.localStorage;
const sessionStorage  = global.sessionStorage;

const _ = require('underscore');

/*
 * LocalStroage Data structure
 *
 *
 * documents :[],
 * categories:[],
 * tiers:[],
 * typedocs:[]
 *
 }
 **/

/**
 * Application Settings
 */
function getAppSetting(pStrSettingName)
{
  if(localStorage.getItem('app-settings_'+pStrSettingName))
  {
    return localStorage.getItem('app-settings_'+pStrSettingName);
  }
  return null;
}

function setAppSetting(pStrSettingName, pStrSettingValue)
{
  localStorage.setItem('app-settings_'+pStrSettingName,pStrSettingValue);
  //console.debug('ApplicationStorageSystem - AppSettings - Properties : "'+pStrSettingName+'" | Value : "' +pStrSettingValue+ '".');
}


/* ************************************************************************** */
/* Document Data Management
/* ************************************************************************** */
// Return Document Data as an object
function getDocumentData(docid) {
  var lObjDocResult = undefined;

  if(docid){
    var lTabDocs = JSON.parse(localStorage.getItem('documents'));

    if(lTabDocs && lTabDocs.length > 0) {
      // Looking for aimed document!
      for(var i = 0;i<lTabDocs.length;i++)
      {
        if(lTabDocs[i].doc_id == docid)
        {
          console.debug('ApplicationStorageSystem - Document with ID "' + docid + '" founded!');
          lObjDocResult = lTabDocs[i];
          return lObjDocResult;
        }
      }
    }
    // No result possible => Empty Array!
  }
  else {
    // docid isn't defined => No Result !
    lObjDocResult = undefined;
  }

  return lObjDocResult;
}

// Save Document into localStorage
function setDocumentsData(pArrDocuments) {
    localStorage.setItem('documents',JSON.stringify(pArrDocuments));
    console.log('ApplicationStorageSystem - ' + pArrDocuments.length.toString() + ' document(s) saved into localStorage');
}

// Get All Docs Objects !
function getAllDocumentsObj() {
  if(localStorage.getItem('documents')){
    return JSON.parse(localStorage.getItem('documents'));
  }
  else {
        return null;
  }
}
// Get Documents count !
function getDocumentCount()
{
  var lTabDocs = getAllDocumentsObj();
  if(lTabDocs && lTabDocs.length())
  {
    return lTabDocs.length();
  }
  return 0;
}

// Return an array with all categories linked to document
function getAllCategorieByDoc(docid){
  var lObjDoc = getDocumentData(docid);
  var lArrResult = [];
  if(lObjDoc.cats)
  {
    lArrResult = lObjDoc.cats;
  }
  return lArrResult;
}

// Return an array with all categories linked to document
function setDocumentsCategories(docid,categories){
  // Getting all documents
  var lArrDocs = getAllDocumentsObj();

  // Looking for aimed docuement!
  if(lArrDocs && lArrDocs.length > 0) {
    // Looking for aimed document!
    var i;
    for(i = 0;i<lArrDocs.length;i++)
    {
      if(lArrDocs[i].doc_id == docid)
      {
        break;
      }
    }

    if(i<lArrDocs.length) {
      lArrDocs[i].cats = categories;
      setDocumentsData(lArrDocs);
    }
    else {
      console.debug('Erreur durant la mise à jour des catégories du doc :"'+docid+'".');
    }
  }
}

// Return an array with all categories linked to document
function getAllTiersByDoc(docid){
  var lObjDoc = getDocumentData(docid);
  var lArrResult = [];
  if(lObjDoc.tiers)
  {
    lArrResult = lObjDoc.tiers;
  }
  return lArrResult;
}

// Return an array with all tiers linked to document
function setDocumentsTiers(docid,tiers){
  // Getting all documents
  var lArrDocs = getAllDocumentsObj();

  // Looking for aimed docuement!
  if(lArrDocs && lArrDocs.length > 0) {
    // Looking for aimed document!
    var i;
    for(i = 0;i<lArrDocs.length;i++)
    {
      if(lArrDocs[i].doc_id == docid)
      {
        break;
      }
    }

    if(i<lArrDocs.length) {
      lArrDocs[i].tiers = tiers;
      setDocumentsData(lArrDocs);
    }
    else {
      console.debug('Erreur durant la mise à jour des tiers du doc :"'+docid+'".');
    }
  }
}


// Meta

function getAllMetasByDoc(docid){
  var lObjDoc = getDocumentData(docid);
  var lArrResult = [];
  if(lObjDoc.tiers)
  {
    lArrResult = lObjDoc.metas;
  }
  return lArrResult;
}

// Return an array with all tiers linked to document
function setDocumentsMetas(docid,metas){
  // Getting all documents
  var lArrDocs = getAllDocumentsObj();

  // Looking for aimed docuement!
  if(lArrDocs && lArrDocs.length > 0) {
    // Looking for aimed document!
    var i;
    for(i = 0;i<lArrDocs.length;i++)
    {
      if(lArrDocs[i].doc_id == docid)
      {
        break;
      }
    }

    if(i<lArrDocs.length) {
      lArrDocs[i].metas = metas;
      setDocumentsData(lArrDocs);
    }
    else {
      console.debug('Erreur durant la mise à jour des meta du doc :"'+docid+'".');
    }
  }
}



/* ************************************************************************** */
/* Categories Data Management
/* ************************************************************************** */
// Return Categorie Data as an object
function getCategorieData(catid) {
  var lObjDocResult = undefined;

  if(catid){
    var lTabDocs = JSON.parse(localStorage.getItem('categories'));

    if(lTabDocs && lTabDocs.length > 0) {
      // Looking for aimed document!
      for(var i = 0;i<lTabDocs.length;i++)
      {
        if(lTabDocs[i].cat_id == catid)
        {
          //console.debug('ApplicationStorageSystem - Categorie with ID "' + catid + '" founded!');
          lObjDocResult = lTabDocs[i];
          return lObjDocResult;
        }
      }
    }
    // No result possible => Empty Array!
  }
  else {
    // docid isn't defined => No Result !
    lObjDocResult = undefined;
  }
  return lObjDocResult;
}

// Save Categories into localStorage
function setCategoriesData(pArrCats) {
    localStorage.setItem('categories',JSON.stringify(pArrCats));
    console.log('ApplicationStorageSystem - ' + pArrCats.length.toString() + ' categorie(s) saved into localStorage');
}

// Get All Categories Objects !
function getAllCategoriesObj() {
  if(localStorage.getItem('categories')){
    return JSON.parse(localStorage.getItem('categories'));
  }
  else {
        return null;
  }
}

/* ************************************************************************** */
/* Tiers Data Management
/* ************************************************************************** */
// Return Tier Data as an object
function getTierData(tierid) {
  var lObjDocResult = undefined;
  if(tierid){
    var lTabDocs = JSON.parse(localStorage.getItem('tiers'));

    if(lTabDocs && lTabDocs.length > 0) {
      // Looking for aimed document!
      for(var i = 0;i<lTabDocs.length;i++)
      {
        if(lTabDocs[i].tier_id == tierid)
        {
          //console.debug('ApplicationStorageSystem - Tier with ID "' + tierid + '" founded!');
          lObjDocResult = lTabDocs[i];
          return lObjDocResult;
        }
      }
    }
    // No result possible => Empty Array!
  }
  else {
    // docid isn't defined => No Result !
    lObjDocResult = undefined;
  }
  return lObjDocResult;
}

// Save Tiers into localStorage
function setTiersData(pArrTiers) {
    localStorage.setItem('tiers',JSON.stringify(pArrTiers));
    console.log('ApplicationStorageSystem - ' + pArrTiers.length.toString() + ' tier(s) saved into localStorage');
}

// Get All Tiers Objects !
function getAllTiersObj() {
  if(localStorage.getItem('tiers')){
    return JSON.parse(localStorage.getItem('tiers'));
  }
  else {
        return null;
  }
}

/* ************************************************************************** */
/* TypeDocs Data Management
/* ************************************************************************** */
// Return TypeDoc Data as an object
function getTypeDocData(tdocid) {
  var lObjDocResult = undefined;
  if(tdocid){
    var lTabDocs = JSON.parse(localStorage.getItem('typedocs'));

    if(lTabDocs && lTabDocs.length > 0) {
      // Looking for aimed document!
      for(var i = 0;i<lTabDocs.length;i++)
      {
        if(lTabDocs[i].tdoc_id == tdocid)
        {
          //console.debug('ApplicationStorageSystem - TypeDoc with ID "' + tdocid + '" founded!');
          lObjDocResult = lTabDocs[i];
          return lObjDocResult;
        }
      }
    }
    // No result possible => Empty Array!
  }
  else {
    // docid isn't defined => No Result !
    lObjDocResult = undefined;
  }
  return lObjDocResult;
}

// Save Tiers into localStorage
function setTypeDocsData(pArrTypeDocs) {
    localStorage.setItem('typedocs',JSON.stringify(pArrTypeDocs));
    console.log('ApplicationStorageSystem - ' + pArrTypeDocs.length.toString() + ' type(s) document saved into localStorage');
}

// Get All Tiers Objects !
function getAllTypeDocsObj() {
  if(localStorage.getItem('typedocs')){
    return JSON.parse(localStorage.getItem('typedocs'));
  }
  else {
        return null;
  }
}

function clearDocumentsData(){
  localStorage.remove('documents');
}

function clearCategoriesData(){
  localStorage.remove('categories');
}

function clearTiersData(){
  localStorage.remove('tiers');
}

function clearTypeDocsData(){
  localStorage.remove('typedocs');
}

function clearAllAppData(){
  clearDocumentsData();
  clearCategoriesData();
  clearTiersData();
  clearTypeDocsData();
}

/* ************************************************************************** */
/* Session Storage mechanism : History, Logs ...
/* ************************************************************************** */

// Add a session history entry!
function addSessionHistoryMessage(message)
{
  var lArrHistory = [];
  if(sessionStorage.getItem('history')) {
    lArrHistory = JSON.parse(sessionStorage.getItem('history'))
  }
  lArrHistory.push({dateMsg: new Date(), message : message});
  sessionStorage.setItem('history',JSON.stringify(lArrHistory));

  pubsub.publish('app-history-updated', null);
}

// Return all History entries (null if none)
function getAllHistoryObjects()
{
  if(sessionStorage.getItem('history')) {
    return JSON.parse(sessionStorage.getItem('history'))
  }
  return null;
}

// Add a Seesion log entry!
function addSessionLogMessage(message)
{
  var lArrHistory = [];
  if(sessionStorage.getItem('logs')) {
    lArrHistory = JSON.parse(sessionStorage.getItem('logs'))
  }
  lArrHistory.push({dateMsg: new Date(), message : message});
  sessionStorage.setItem('logs',JSON.stringify(lArrHistory));
}

// Return all History entries (null if none)
function getAllLogsObjects()
{
  if(sessionStorage.getItem('logs')) {
    return JSON.parse(sessionStorage.getItem('logs'))
  }
  return null;
}

// expose the methods as static module!
module.exports = {
  // Documents
  setDocuments            : setDocumentsData,
  getDocumentbyId         : getDocumentData,
  getAllDocuments         : getAllDocumentsObj,
  getAllCategorieByDoc    : getAllCategorieByDoc,
  setDocumentsCategories  : setDocumentsCategories,
  getAllTiersByDoc        : getAllTiersByDoc,
  setDocumentsTiers       : setDocumentsTiers,
  getAllMetasByDoc        : getAllMetasByDoc,
  setDocumentsMetas       : setDocumentsMetas,

  // Catégories
  setCategories       : setCategoriesData,
  getCategorieById    : getCategorieData,
  getAllCategories    : getAllCategoriesObj,

  // Tiers
  setTiers            : setTiersData,
  getTierById         : getTierData,
  getAllTiers         : getAllTiersObj,

  // Type de Document
  setTypeDocs         : setTypeDocsData,
  getTypeDocById      : getTypeDocData,
  getAllTypeDocs      : getAllTypeDocsObj,

  clearAllData        : clearAllAppData,

  // History
  addSessionHistoryMessage  : addSessionHistoryMessage,
  getAllHistoryObjects      : getAllHistoryObjects,

  // Logs
  addSessionLogMessage      : addSessionLogMessage,
  getAllLogsObjects         : getAllLogsObjects,

  // Application Settings
  getAppSetting : getAppSetting,
  setAppSetting : setAppSetting
};
