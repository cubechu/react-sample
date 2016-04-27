'use strict';

let hi = React.createClass({
  render: function() {
    return (
        <h1>hi {this.props.name}!</h1>
    );
  }
});

module.exports = hi;
