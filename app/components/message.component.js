/**
* AppMessagesComponent - based on React.Component
*
* Application Messages Component
*
* @author polux
* @link https://facebook.github.io/react/docs/react-component.html
*/
// Importing libraries
import React  from 'react';
import pubsub from 'pubsub-js';
import { FormGroup, ControlLabel,  Well, Fade } from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

const LocalData = require('./../application.storage');

// AppMessagesComponent Class
class AppMessagesComponent extends React.Component {

  /*
  * Default Constructor
  */
  constructor(props) {
    super(props);

    this.displayName = 'AppMessagesComponent';

    // Initial State definition
    this.state = {
      showMsg:false,
      messages:[],
    };
  }

  /**
   * Post render Event
   */
  componentWillMount() {
    // when React renders me, I subscribe to the topic 'products'
    // .subscribe returns a unique token necessary to unsubscribe
    this.pubsub_token_message = pubsub.subscribe('app-message', function(topic, data) {
      console.log(this.displayName+' - An Application Message Event received.');
      var lArrMsgs = this.state.messages.slice();
      lArrMsgs.push(data);
      // Adding
      this.setState({showMsg:true, messages: lArrMsgs})
    }.bind(this));
  }

  /**
  * Pre removed from DOM event
  */
  componentWillUnmount() {
    // React removed me from the DOM, I have to unsubscribe from the pubsub using my token
    pubsub.unsubscribe(this.pubsub_token_message);
  }

  /**
  * render
  *
  * @link https://facebook.github.io/react/docs/react-component.html#render
  */
  render() {
    var styleGlobal = {
      'fontSize' : 'medium',
      'float' : 'right',
      'marginBottom' :'0',
      'marginRight':'10px',
      'padding':'5px'
    }
    var lObjLastMessage = {};
    if(this.state.messages && this.state.messages.length > 0) {
      lObjLastMessage = this.state.messages[this.state.messages.length -1];
    }
    else {
      this.state.showMsg = false;
    }

    return (

      <Fade in={this.state.showMsg} className={this.state.showMsg ? lObjLastMessage.type : 'default'} style={styleGlobal} onClick={()=>this.setState({showMsg:false})}>
               <div>
                 <Well bsSize='sm' className={this.state.showMsg ? 'success': 'default'}>
                   {lObjLastMessage.message}
                 </Well>
               </div>
             </Fade>

    );
  }
}

// /* ************************************************************************** */
// /* AppHistory Static Class properties
// /* ************************************************************************** */
// // AppHistory Class Properties Definition
// AppHistory.propTypes = {
//   searchDoc: React.PropTypes.func,
// };
// // AppHistory Properties default values
// AppHistory.defaultProps = {
//   searchDoc: '',
// };
// // displayName ? Used for debugging by JSX ???

export default AppMessagesComponent
