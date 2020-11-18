import React from "react";
import Popup from "reactjs-popup";

interface State {
	files: FileList | null;
}
interface Props {
	uploadFiles(files: FileList): void;
	closeUpperPopup(): void;
}

export default class UploadPopup extends React.Component<Props, State> {
	constructor(props: Props | Readonly<Props>) {
		super(props);

		this.state = {
			files: null,
		};
	}

	private handleFileChange(files: FileList | null): void {
		this.setState({
			files,
		});
	}

	public render() {
		return (
			<Popup
				trigger={
					<div className="mx-auto text-center hover:shadow hover:bg-gray-400 hover-mouse-pointer p-1">
						Upload File
					</div>
				}
				modal
				position="top center">
				{(closePopup: any) => (
					<div className="rounded shadow-lg bg-gray-300 p-2 text-center pt-4 w-screen container">
						<label className="mt-3 hover-mouse-pointer bg-gray-500 shadow appearance-none border rounded w-full max-w-xs py-2 px-3 leading-tight focus:outline-none focus:shadow-outline">
							{this.state.files ? `${this.state.files.length} Selected` : "Select Files"}
							<input
								type="file"
								multiple={true}
								className="hidden"
								onChange={(e) => {
									e.preventDefault();
									this.handleFileChange(e.target.files);
								}}
							/>
						</label>

						<div className="mt-5 mx-auto text-center">
							<button
								className={`bg-green-400 mx-2 rounded p-1 ${
									!this.state.files ? "opacity-50 cursor-not-allowed" : "hover:bg-green-500 hover:shadow"
								}`}
								onClick={async (e) => {
									e.preventDefault();
									if (!this.state.files) return;
									this.props.uploadFiles(this.state.files);
									this.props.closeUpperPopup();
									closePopup();
								}}>
								Upload
							</button>
							<button
								onClick={(e) => {
									e.preventDefault();
									closePopup();
									this.props.closeUpperPopup();
								}}
								className="bg-red-500 hover:bg-red-600 hover:shadow mx-2 rounded p-1">
								Cancel
							</button>
						</div>
					</div>
				)}
			</Popup>
		);
	}
}
