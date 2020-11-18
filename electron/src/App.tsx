import React from "react";

interface State {
	dir?: string;
}
interface Props {}

export default class App extends React.Component<Props, State> {
	constructor(props: Props | Readonly<Props>) {
		super(props);

		this.state = {
			dir: undefined,
		};
	}

	updateDir(fileList: FileList | null) {
		if (!fileList) {
			this.setState({
				dir: undefined,
			});
		} else {
			const files: any[] = [];

			for (const file of fileList) {
				files.push(file);
			}

			if (!files) {
				return this.setState({
					dir: undefined,
				});
			}

			const dir = files[0].path;

			this.setState({ dir });
		}
	}

	componentDidMount() {
		const input = document.getElementById("input");
		if (!input) return;
		input.setAttribute("directory", "true");
		input.setAttribute("mozdirectory", "true");
		input.setAttribute("webkitdirectory", "true");
	}

	render() {
		return (
			<div className="hover-mouse-pointer mt-8 container max-w-lg text-center mx-auto">
				<label
					htmlFor="input"
					className="hover-mouse-pointer mt-8 container text-center mx-auto bg-blue-400 shadow-lg rounded p-2 border-b border-gray-700">
					Select folder
				</label>
				<input
					id="input"
					type="file"
					className="w-full h-full"
					hidden
					onChange={(e) => {
						e.preventDefault();
						this.updateDir(e.target.files);
					}}
				/>
			</div>
		);
	}
}
