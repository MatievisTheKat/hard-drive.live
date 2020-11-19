import React from "react";
import { Popup } from "reactjs-popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencilAlt } from "@fortawesome/free-solid-svg-icons";

interface State {
	newName: string;
}
interface Props {
	name: string;
	rename(oldName: string, newName: string): void;
}

export default class RenamePopup extends React.Component<Props, State> {
	constructor(props: Props | Readonly<Props>) {
		super(props);

		this.state = {
			newName: this.props.name,
		};
	}

	private handleInputChange(value: string) {
		this.setState({
			newName: value.replace(/(\/|\\)/gi, "-"),
		});
	}

	public render() {
		return (
			<Popup
				trigger={
					<span className="text-right float-right mr-4 text-blue-500 hover:text-blue-700 hover-mouse-pointer">
						<FontAwesomeIcon icon={faPencilAlt} />
					</span>
				}
				modal
				position="top center">
				{(closePopup: any) => (
					<div className="rounded shadow bg-gray-300 p-2 text-center">
						<label htmlFor="new-name">New Name:</label>
						<input
							value={this.state.newName}
							onChange={(e) => {
								e.preventDefault();
								this.handleInputChange(e.target.value);
							}}
							type="text"
							className="shadow appearance-none border rounded w-full max-w-xs py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline"
						/>
						<div className="mt-4 mx-auto text-center">
							<button
								className={`bg-green-400 mx-2 rounded p-1 ${
									!this.state.newName || this.state.newName === this.props.name
										? "opacity-50 cursor-not-allowed"
										: "hover:bg-green-500 hover:shadow"
								}`}
								onClick={async (e) => {
									e.preventDefault();
									if (!this.state.newName || this.state.newName === this.props.name) return;
									this.props.rename(this.props.name, this.state.newName);
									closePopup();
								}}>
								Rename
							</button>
							<button className="bg-red-500 hover:bg-red-600 hover:shadow mx-2 rounded p-1" onClick={closePopup}>
								Cancel
							</button>
						</div>
					</div>
				)}
			</Popup>
		);
	}
}
