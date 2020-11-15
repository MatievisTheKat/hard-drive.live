import Axios from "axios";
import React from "react";

import { FileInfo } from "./types";
import Files from "./components/Files";
import Header from "./components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";

interface State {
	error?: any;
	files: FileInfo[];
	cwd: string;
}
interface Props {}

export default class App extends React.Component<Props, State> {
	constructor(props: Props | Readonly<Props>) {
		super(props);

		this.state = {
			error: undefined,
			files: [],
			cwd: "",
		};
	}

	private async updatePath(path: string = this.state.cwd) {
		await Axios.get(`http://hard-drive.live/api/list/${path}`)
			.then((res) => {
				this.setState({
					files: res.data,
					cwd: path,
				});
			})
			.catch((err) => {
				this.setState({
					error: err?.response?.data?.error || err,
				});
			});
	}

	private async goUpOneDir() {
		const dirs = this.state.cwd.split("/").map((part) => (part === "" ? undefined : part));

		if (dirs.length < 2) return;
		else {
			dirs.pop();
			await this.updatePath(dirs.join("/"));
		}
	}

	private formatPwdForDisplay() {
		const dirs = this.state.cwd.split("/");
		return dirs.map((dir, i) => (
			<span
				key={i}
				className="hover:underline hover:text-gray-600 hover-mouse-pointer"
				onClick={async (e) => {
					e.preventDefault();
					await this.updatePath(`${dirs.slice(0, dirs.indexOf(dir) + 1).join("/")}`);
				}}>
				{`${dir}/`}
			</span>
		));
	}

	private remove(path: string) {
		Axios.post(`http://hard-drive.live/api/remove`, {
			path,
		})
			.then(async () => {
				await this.updatePath();
			})
			.catch((err) => {
				this.setState({
					error: err?.response?.data?.error || err,
				});
			});
	}

	private createDir(name: string) {
		Axios.post(`http://hard-drive.live/api/createDir`, {
			path: `${this.state.cwd}/${name}`,
		})
			.then(async () => {
				await this.updatePath();
			})
			.catch((err) => {
				this.setState({
					error: err?.response?.data?.error || err,
				});
			});
	}

	private uploadFiles(files: FileList): void {
		for (const file of files) {
			const form = new FormData();

			form.append("files", file, file.name);
			form.append("dirPath", this.state.cwd || "/");

			Axios.post("http://hard-drive.live/api/upload", form)
				.then(async () => {
					await this.updatePath();
				})
				.catch((err) => {
					this.setState({
						error: err?.response?.data?.error || err,
					});
				});
		}
	}

	public async componentDidMount() {
		await this.updatePath();
	}

	public render() {
		return (
			<div className="max-w-4xl mx-auto container">
				<Header
					createDir={this.createDir.bind(this)}
					uploadFiles={this.uploadFiles.bind(this)}
					goUpOneDir={this.goUpOneDir.bind(this)}
					formatPwdForDisplay={this.formatPwdForDisplay.bind(this)}
					cwd={this.state.cwd}
				/>

				{this.state.error ? (
					<div className="bg-red-400 mx-auto container p-2 rounded border-red-900 shadow">
						{this.state.error.toString()}
						<span
							className="float-right mr-2 hover-mouse-pointer"
							onClick={(e) => {
								e.preventDefault();
								this.setState({
									error: undefined,
								});
							}}>
							<FontAwesomeIcon icon={faTimesCircle} />
						</span>
					</div>
				) : null}

				<Files
					remove={this.remove.bind(this)}
					updatePath={this.updatePath.bind(this)}
					files={this.state.files}
					cwd={this.state.cwd}
				/>
			</div>
		);
	}
}
