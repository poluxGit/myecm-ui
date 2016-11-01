/**
* AppHistory - based on React.Component
*
* History Component
*
* @author polux
* @link https://facebook.github.io/react/docs/react-component.html
*/
// Importing libraries
import React  from 'react';
import pubsub from 'pubsub-js';
import { FormGroup, ControlLabel, Panel } from 'react-bootstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'


const LocalData = require('./../application.storage');

// AppHistory Class
class AppHistory extends React.Component {

  /*
  * Default Constructor
  */
  constructor(props) {
    super(props);

    // Initial State definition
    this.state = {
      refresh:true,
      open:false
    };
  }

  /**
   * Post render Event
   */
  componentWillMount() {
    let self = this;
    // when React renders me, I subscribe to the topic 'products'
    // .subscribe returns a unique token necessary to unsubscribe
    this.pubsub_token_history_updated = pubsub.subscribe('app-history-updated', function(topic) {
      console.log('AppMyDocsContainer - Event "'+topic+'" received.');
      this.setState({refresh:!this.state.refresh})

    }.bind(this));
  }

  /**
  * Pre removed from DOM event
  */
  componentWillUnmount() {
    // React removed me from the DOM, I have to unsubscribe from the pubsub using my token
    pubsub.unsubscribe(this.pubsub_token_history_updated);
  }

  /**
  * render
  *
  * @link https://facebook.github.io/react/docs/react-component.html#render
  */
  render() {
    var lArrHsitoryEntries = LocalData.getAllHistoryObjects();
    if(lArrHsitoryEntries && lArrHsitoryEntries.length >0){
      var liHistoryEntries = LocalData.getAllHistoryObjects().reverse().map(function(entry,item){
        return (
          <li key={item}>
            <span><small>{entry.message}</small></span>
          </li>
        );
      });

      // <div>
      //   <Button onClick={ ()=> this.setState({ open: !this.state.open })}>
      //     click
      //   </Button>
      //   <Panel collapsible expanded={this.state.open}>
      //     Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid.
      //     Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
      //   </Panel>
      // </div>
      return (
        <FormGroup id='formGrp_History'>
          <ControlLabel onClick={ ()=> this.setState({ open: !this.state.open })}> History </ControlLabel>
          <Panel collapsible expanded={this.state.open}>
            <ul>
              <ReactCSSTransitionGroup
                transitionName="example"
                transitionEnterTimeout={1500}
                transitionLeaveTimeout={1500}>
                {liHistoryEntries}
              </ReactCSSTransitionGroup>
            </ul>
          </Panel>
        </FormGroup>
      );
    }
    else
    {
      return (
        <FormGroup id='formGrp_History'>
          <ControlLabel> History </ControlLabel>
          <ul>
            <span> Aucune entrée </span>
          </ul>
        </FormGroup>
      );
    }
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

export default AppHistory
