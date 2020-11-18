import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface State {}
interface Props {
	fileName: string;
	cwd: string;
	remove(path: string): void;
}

export default class DeleteButton extends React.Component<Props, State> {
	public render() {
		return (
			<span
				className="text-right float-right mr-2 text-red-500 hover:text-red-700 hover-mouse-pointer"
				onClick={(e) => {
					e.preventDefault();
					this.props.remove(`${this.props.cwd}/${this.props.fileName}`);
				}}>
				<FontAwesomeIcon icon={faTrashAlt} />
			</span>
		);
	}
}
