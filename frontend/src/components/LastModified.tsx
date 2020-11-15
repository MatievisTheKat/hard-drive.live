import moment from "moment";
import React from "react";

interface State {}
interface Props {
	timestamp: number;
}

export default class LastModified extends React.Component<Props, State> {
	public render() {
		return (
			<span className="text-left float-right mr-10 text-gray-500 text-sm">
				last modified {moment(this.props.timestamp).fromNow()}
			</span>
		);
	}
}
