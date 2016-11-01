// -------------------------------------------------------------------------- //
// Main Application Start script                                              //
// -------------------------------------------------------------------------- //

//IMPORT React libraries!
import React    from 'react';
import ReactDOM from 'react-dom';
import pubsub   from 'pubsub-js';

// Application Main Container React component
import AppMyDocsContainer from './application.container';
import LocalData          from './application.storage';


// Application Static Settings Definition!
var app_opts = {
  application_title       : 'MyDocs',
  application_server_url  : 'http://localhost:8080/php-myged/api/v1/',
  application_version     : '0.1-0',
  application_author      : {
    author_name : 'polux',
    author_mail : 'damien.viguier@gmail.com',
    github_url  : 'TODEF'
  }
};

// Static technical preferences
LocalData.setAppSetting('url-restapi',app_opts.application_server_url);

// Launch Front-end Application
ReactDOM.render(
  <AppMyDocsContainer
    application_title={app_opts.application_title}
    application_author={app_opts.application_author}
    application_server_url={app_opts.application_server_url}
    application_version={app_opts.application_version}
    />,
  document.getElementById('AppContainerDiv')
);

pubsub.publish('app-datareload-all', null);


// -------------------------------------------------------------------------- //
// End Main script                                                            //
// -------------------------------------------------------------------------- //
