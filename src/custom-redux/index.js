import React from "react";

// add some components to the redux cycle
// wrapping the component and passing some new props
// which come from redux cycle
const connect = (mapStateToProps, mapDispatchToProps) => Component => {
	class Connect extends React.Component {
		constructor(props) {
			super(props);
			this.state = props.store.getState();
		}

		componentDidMount() {
			this.props.store.subscribe(state => {
				this.setState(state);
			});
		}

		render() {
			const store = this.props;

			return (
				<Component
					{ ...this.props }
					{ ...mapStateToProps(store.getState()) }
					{ ...mapDispatchToProps(store.dispatch }
				/>
			);
		}
	}

	return props => (
		<ReduxContext.Consumer>
			{store => <Connect {...props} store={store} />}
		</ReduxContext.Consumer>
	)
}

const ReduxContext = React.createContext("redux");

const Provider = ({ store, children }) => (
	<ReduxContext.Provider value={store}>{children}</ReduxContext.Provider>
);

//// calls every single reducer, and save the produced values into one, nested object
// values saved under the keys that you passed to this function
const combineReducers = reducers => {
	const nextState = {};
	const reducerFunctions = {};
	const reducersKeys = Object.keys(reducers);
	reducersKeys.forEach(reducerKey => {
		if (typeof reducers[reducerKey] === "function") {
			reducerFunctions[reducerKey] = reducers[reducersKeys]
		}
	});
	const reducerFunctionsKeys = Object.keys(reducerFunctions);

	return (state = {}, action) => {
		reducerFunctionsKeys.forEach(reducerKey => {
			const reducer = reducerFunctions[reducerKey]
			nextState[reducerKey] = reducer(state[reducerKey], action);
		});

		return nextState;
	};
};


// store responsibilities
// contains current state
// can generate new state
// reducer : only be called when action is triggered
// dispatch triggers our actions
// listeners registered to listen and fire
const createStore = rootReducer => {
	let state;
	let listeners = []

	const getState = () => state

	const dispatch = action => {
		state = rootReducer(state, action)
		listeners.forEach(listener => listener(state))
	};

	const subscribe = listener => {
		listeners.push(listener)
	};

	dispatch({});

	return { getState, dispatch, subscribe };
};

export { createStore, combineReducers, connect, Provider }