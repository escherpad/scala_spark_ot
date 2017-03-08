/** Created by ge on 12/6/16.
 * Usage Example
 * Selector(key/selectionFunction/arrayOf'keys/etc, component)
 * */
import React, {PropTypes} from "react";

export default function Selector(selector, Component) {

  return class SelectContainer extends React.Component {
    static propTypes = {
      store: PropTypes.any.isRequired,
      dispatch: PropTypes.func.isRequired
    };

    constructor() {
      super();
      this.storeToState = this._storeToState.bind(this);
    }

    _storeToState(store) {
      this.setState(selector(store));
    }

    componentWillMount() {
      this.subscription = this.props.store.subscribe(this.storeToState);
    }

    componentWillUnmount() {
      this.subscription.unsubscribe()
    }

    shouldComponentUpdate(newProps, newStates) {
      // note: both store and dispatch are required.
      // note2: state update *always* trigger re-render
      if (Object.keys(newProps).length > 2) return true;
      return false;
    }

    render() {
      if (!this.state) return <div></div>;
      let props = {...this.state, ...this.props};
      return <Component {...props}/>
    }
  }
}

