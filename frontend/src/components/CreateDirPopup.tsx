import React from "react";
import Popup from "reactjs-popup";

interface State {
	newDirName: string;
}
interface Props {
	createDir(name: string): void;
	closeUpperPopup(): void;
}

export default class CreateDirPopup extends React.Component<Props, State> {
	constructor(props: Props | Readonly<Props>) {
		super(props);

		this.state = {
			newDirName: "",
		};
	}

	private handleDirNameChange(value: string) {
		this.setState({
			newDirName: value.replace(/(\/|\\)/gi, "-"),
		});
	}

	public render() {
		return (
			<Popup
				trigger={
					<div className="mx-auto text-center hover:shadow hover:bg-gray-400 hover-mouse-pointer p-1">
						Create Folder
					</div>
				}
				modal
				position="top center">
				{(closePopup: any) => (
					<div className="rounded shadow bg-gray-300 p-2">
						<label htmlFor="new-dir-name">Folder Name:</label>
						<input
							value={this.state.newDirName}
							onChange={(e) => {
								e.preventDefault();
								this.handleDirNameChange(e.target.value);
							}}
							type="text"
							className="shadow appearance-none border rounded w-full max-w-xs py-2 px-3 text-gray-700 mb-2 leading-tight focus:outline-none focus:shadow-outline"
						/>
						<div className="mt-4 mx-auto text-center">
							<button
								className={`bg-green-400 mx-2 rounded p-1 ${
									!this.state.newDirName ? "opacity-50 cursor-not-allowed" : "hover:bg-green-500 hover:shadow"
								}`}
								onClick={async (e) => {
									e.preventDefault();
									if (!this.state.newDirName) return;
									this.props.createDir(this.state.newDirName);
									this.props.closeUpperPopup();
									closePopup();
								}}>
								Create
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
