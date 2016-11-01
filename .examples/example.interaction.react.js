// ProductList is just a container
var ProductList = React.createClass({
  render: function() {
    return  <div>
              <ProductSelection />
              <Product name="product 1" />
              <Product name="product 2" />
              <Product name="product 3" />
            </div>
  }
});

// ProductSelection consumes messages from the topic 'products'
// and displays the current selected product
var ProductSelection = React.createClass({
  getInitialState: function() {
    return { selection: 'none' };
  },
  componentWillMount: function() {
    // when React renders me, I subscribe to the topic 'products'
    // .subscribe returns a unique token necessary to unsubscribe
    this.pubsub_token = pubsub.subscribe('products', function(topic, product) {
      // update my selection when there is a message
      this.setState({ selection: product });
    }.bind(this));
  },
  componentWillUnmount: function() {
    // React removed me from the DOM, I have to unsubscribe from the pubsub using my token
    pubsub.unsubscribe(this.pubsub_token);
  },
  render: function() {
    return You have selected the product : {this.state.selection};
  }
});

// A Product is just a <div> which publish a message to the topic 'products'
// when you click on it
var Product = React.createClass({
  onclick: function() {
    // when a product is clicked on, we publish a message on the topic 'products' and we pass the product name
    pubsub.publish('products', this.props.name);
  },
  render: function() {
    return <div onClick={this.onclick}>{this.props.name}</div>;
  }
});

React.render(<ProductList />, document.body);
