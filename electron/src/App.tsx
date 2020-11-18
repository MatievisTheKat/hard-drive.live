import React from "react";

interface State {}
interface Props {}

export default class App extends React.Component<Props, State> {
	constructor(props: Props | Readonly<Props>) {
		super(props);
	}

	render() {
		return <div className="container bg-blue-300 mx-auto text-center mt-56">hello there</div>;
	}
}
