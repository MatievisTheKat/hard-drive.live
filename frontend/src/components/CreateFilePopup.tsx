import React from "react";
import { Popup } from "reactjs-popup";

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
			ext: "",
		};
	}

	private setName(value: string) {
		const parts = value.split(".");
		this.setState({
			name: value,
			ext: parts.length > 1 ? parts.pop() || "txt" : "txt",
		});
	}

	private setContent(value: string) {
		this.setState({
			content: value,
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
					<div className="pt-10 rounded w-screen container shadow-lg bg-gray-300 p-2 text-center w-2xl">
						<div className="container">
							<p>Name:</p>
							<input
								type="text"
								value={this.state.name}
								onChange={(e) => {
									e.preventDefault();
									this.setName(e.target.value);
								}}
								className="py-1 px-2 mx-auto block appearance-none w-1/2 bg-white border border-gray-400 hover:border-gray-500 rounded shadow-sm leading-tight focus:outline-none focus:shadow-outline"
							/>

							<p className="mt-5">Content:</p>
							<textarea
								className="block appearance-none w-9/12 mx-auto h-full bg-white border border-gray-400 hover:border-gray-500 rounded shadow-sm leading-tight focus:outline-none focus:shadow-outline"
								cols={30}
								rows={20}
								value={this.state.content}
								onChange={(e) => {
									e.preventDefault();
									this.setContent(e.target.value);
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

									const parts = this.state.name.split(".");
									if (parts.length > 1) parts.pop();

									this.props.createFile(parts.join(""), this.state.ext, this.state.content);
									this.props.closeUpperPopup();
									closePopup();
								}}>
								Create
							</button>
							<button
								className="bg-red-500 hover:bg-red-600 hover:shadow mx-2 rounded p-1"
								onClick={(e) => {
									e.preventDefault();
									closePopup();
									this.props.closeUpperPopup();
								}}>
								Cancel
							</button>
						</div>
					</div>
				)}
			</Popup>
		);
	}
}
