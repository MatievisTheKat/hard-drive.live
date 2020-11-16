import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Popup from "reactjs-popup";
import { FileInfo, Types } from "../types";

interface State {}
interface Props {
  file: FileInfo;
  cwd: string;
	remove(path: string): void;
}

export default class DeleteButton extends React.Component<Props, State> {
	public render() {
		return (
			<Popup
				trigger={
					<span className="text-right float-right mr-2 text-red-500 hover:text-red-700 hover-mouse-pointer">
						<FontAwesomeIcon icon={faTrashAlt} />
					</span>
				}
				position="left center">
				{(close: any) => (
					<div className="mx-auto shadow rounded bg-gray-300 max-w-xs p-2">
						<span>
							Are you sure you want to delete '{this.props.file.name}'
							{this.props.file.type === Types.Directory ? " and all its contents" : ""}?
						</span>

						<br />

						<div>
							<button
								className="shadow bg-red-400 p-1 rounded mr-5 hover:shadow mx-auto"
								onClick={(e) => {
									e.preventDefault();
									this.props.remove(`${this.props.cwd}/${this.props.file.name}`);
									close();
								}}>
								Yes, do as I say
							</button>
							<button className="shadow bg-green-400 p-1 rounded hover:shadow mx-auto" onClick={close}>
								No thanks
							</button>
						</div>
					</div>
				)}
			</Popup>
		);
	}
}
