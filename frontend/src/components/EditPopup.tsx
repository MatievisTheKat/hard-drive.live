import React from "react";
import Axios from "axios";
import Popup from "reactjs-popup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";

interface State {
	newContent: string | undefined;
	content: string;
}
interface Props {
	name: string;
	path: string;
	updateFile(name: string, ext: string, content: string): void;
	handleError(err: any): void;
}

export default class EditPopup extends React.Component<Props, State> {
	constructor(props: Props | Readonly<Props>) {
		super(props);

		this.state = {
			content: "Loading...",
			newContent: undefined,
		};
	}

	private submit() {
		if (!this.state.newContent) return;

		const parts = this.props.name.split(".");
		if (parts.length > 1) parts.pop();

		this.props.updateFile(parts.join(""), this.props.name.split(".").pop() as string, this.state.newContent);
		this.setContent(undefined);
	}

	private setContent(value: string | undefined) {
		this.setState({
			newContent: value,
		});
	}

	private reset() {
		Axios.get(`http://hard-drive.live/api/view/${this.props.path}`)
			.then((res) => {
				this.setState({
					content: res.data,
					newContent: undefined,
				});
			})
			.catch(this.props.handleError);
	}

	public componentDidMount() {
		this.reset();
	}

	public render() {
		return (
			<Popup
				onOpen={this.reset.bind(this)}
				trigger={
					<span className="text-right float-right mr-4 text-blue-500 hover:text-blue-700 hover-mouse-pointer">
						<FontAwesomeIcon icon={faEdit} />
					</span>
				}
				position="top center"
				modal>
				{(closePopup: any) => (
					<div className="pt-10 rounded w-screen container shadow-lg bg-gray-300 p-2 text-center w-2xl">
						<div className="container">
							<p>Name:</p>
							<input
								type="text"
								value={this.props.name}
								disabled
								className="py-1 px-2 mx-auto block appearance-none w-1/2 bg-white border border-gray-400 hover:border-gray-500 rounded shadow-sm leading-tight focus:outline-none focus:shadow-outline"
							/>

							<p className="mt-5">Content:</p>
							<textarea
								className="block appearance-none w-9/12 mx-auto h-full bg-white border border-gray-400 hover:border-gray-500 rounded shadow-sm leading-tight focus:outline-none focus:shadow-outline"
								cols={30}
								rows={20}
								value={this.state.newContent ?? this.state.content}
								onChange={(e) => {
									e.preventDefault();
									this.setContent(e.target.value);
								}}></textarea>
						</div>

						<div className="mt-4 mx-auto text-center">
							<button
								className={`bg-green-400 mx-2 rounded p-1 ${
									!this.state.newContent ? "opacity-50 cursor-not-allowed" : "hover:bg-green-500 hover:shadow"
								}`}
								onClick={async (e) => {
									e.preventDefault();
									this.submit();
									closePopup();
								}}>
								Edit
							</button>
							<button
								className="bg-red-500 hover:bg-red-600 hover:shadow mx-2 rounded p-1"
								onClick={(e) => {
									e.preventDefault();
									closePopup();
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
