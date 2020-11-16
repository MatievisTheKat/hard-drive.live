import React from "react";
import { Popup } from "reactjs-popup";
import { supportedCreateFileTypes } from "../types";

interface State {
	name: string;
	content: string;
	ext: string;
}
interface Props {
	createFile(name: string, ext: string, data?: string): void;
	closeUpperPopup(): void;
}

export default class CreateFilePopup extends React.Component<Props, State> {
	constructor(props: Props | Readonly<Props>) {
		super(props);

		this.state = {
			name: "",
			content: "",
			ext: "txt",
		};
	}

	private handleNameChange(value: string) {
		this.setState({
			name: value,
		});
	}

	private handleContentChange(value: string) {
		this.setState({
			content: value,
		});
	}

	private handleExtChange(value: string) {
		this.setState({
			ext: value,
		});
	}

	public render() {
		return (
			<Popup
				trigger={
					<div className="mx-auto text-center hover:shadow hover:bg-gray-400 hover-mouse-pointer p-1">
						Create File
					</div>
				}
				position="top center"
				modal>
				{(closePopup: any) => (
					<div className="rounded w-screen container shadow bg-gray-300 p-2 text-center w-2xl">
						<div className="flex-row">
							<p>Name:</p>
							<input
								type="text"
								value={this.state.name}
								onChange={(e) => {
									e.preventDefault();
									this.handleNameChange(e.target.value);
								}}
								className="py-1 px-2 block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 rounded shadow-sm leading-tight focus:outline-none focus:shadow-outline"
							/>

							<p className="mt-5">Type:</p>
							<select
								value={this.state.ext}
								onChange={(e) => {
									e.preventDefault();
									this.handleExtChange(e.target.value);
								}}
								className="py-1 px-2 block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 rounded shadow-sm leading-tight focus:outline-none focus:shadow-outline hover-mouse-pointer">
								{supportedCreateFileTypes.map((t, i) => (
									<option key={i} className="text-center">
										{t}
									</option>
								))}
							</select>

							<p className="mt-5">Content:</p>
							<textarea
								className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 rounded shadow-sm leading-tight focus:outline-none focus:shadow-outline"
								cols={30}
								rows={10}
								value={this.state.content}
								onChange={(e) => {
									e.preventDefault();
									this.handleContentChange(e.target.value);
								}}></textarea>
						</div>

						<div className="mt-4 mx-auto text-center">
							<button
								className={`bg-green-400 mx-2 rounded p-1 ${
									!this.state.name ? "opacity-50 cursor-not-allowed" : "hover:bg-green-500 hover:shadow"
								}`}
								onClick={async (e) => {
									e.preventDefault();
									if (!this.state.name) return;
									this.props.createFile(this.state.name, this.state.ext, this.state.content);
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
