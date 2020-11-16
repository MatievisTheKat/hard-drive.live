import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";

interface State {}
interface Props {
	remove(): void;
}

export default class Error extends React.Component<Props, State> {
	public render() {
		return (
			<div className="bg-red-400 mx-auto container p-2 rounded border-red-900 shadow">
				{this.props.children}
				<span
					className="float-right mr-2 hover-mouse-pointer"
					onClick={(e) => {
						e.preventDefault();
						this.props.remove();
					}}>
					<FontAwesomeIcon icon={faTimesCircle} />
				</span>
			</div>
		);
	}
}
