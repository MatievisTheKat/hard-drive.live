import Axios from "axios";
import React from "react";

import { FileInfo } from "./types";
import Files from "./components/Files";
import Header from "./components/Header";
import Error from "./components/Error";
import DomainError from "./components/DomainError";

interface State {
	error?: any;
	files: FileInfo[];
	cwd: string;
	loading: boolean;
}
interface Props {}

const domain = window.location.hostname;
const correctDomain = domain === "hard-drive.live" || domain === "localhost";

export default class App extends React.Component<Props, State> {
	constructor(props: Props | Readonly<Props>) {
		super(props);

		this.state = {
			error: undefined,
			files: [],
			cwd: "",
			loading: false,
		};
	}

	private set loading(loading: boolean) {
		this.setState({
			loading,
		});
	}

	private async update(path: string = this.state.cwd) {
		this.loading = true;
		await Axios.get(`http://hard-drive.live/api/list/${path}`)
			.then((res) => {
				this.loading = false;
				this.setState({
					files: res.data,
					cwd: path,
				});
			})
			.catch((err) => {
				this.updateError(err);
				this.loading = false;
			});
	}

	private async goUpOneDir() {
		this.loading = true;
		const dirs = this.state.cwd.split("/").map((part) => (part === "" ? undefined : part));

		if (dirs.length < 2) {
			this.loading = false;
			return;
		} else {
			dirs.pop();
			await this.update(dirs.join("/"));
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
					await this.update(`${dirs.slice(0, dirs.indexOf(dir) + 1).join("/")}`);
				}}>
				{`${dir}/`}
			</span>
		));
	}

	private rename(oldName: string, newName: string) {
		this.loading = true;
		Axios.post("http://hard-drive.live/api/rename", {
			oldPath: `${this.state.cwd}/${oldName}`,
			newPath: `${this.state.cwd}/${newName}`,
		})
			.then(async () => {
				await this.update();
			})
			.catch((err) => {
				this.updateError(err);
				this.loading = false;
			});
	}

	private remove(path: string) {
		this.loading = true;
		Axios.post("http://hard-drive.live/api/remove", {
			path,
		})
			.then(async () => {
				await this.update();
			})
			.catch((err) => {
				this.updateError(err);
				this.loading = false;
			});
	}

	private createDir(name: string) {
		this.loading = true;
		Axios.post("http://hard-drive.live/api/createDir", {
			path: `${this.state.cwd}/${name}`,
		})
			.then(async () => {
				await this.update();
			})
			.catch((err) => {
				this.updateError(err);
				this.loading = false;
			});
	}

	private createFile(name: string, ext: string, data?: string) {
		this.loading = true;
		Axios.post("http://hard-drive.live/api/createFile", {
			dirPath: this.state.cwd || "/",
			fileName: name,
			fileExt: ext,
			data,
		})
			.then(async () => {
				await this.update();
			})
			.catch((err) => {
				this.updateError(err);
				this.loading = false;
			});
	}

	private uploadFiles(files: FileList): void {
		this.loading = true;
		for (const file of files) {
			const form = new FormData();

			form.append("files", file, file.name);
			form.append("dirPath", this.state.cwd || "/");

			Axios.post("http://hard-drive.live/api/upload", form)
				.then(async () => {
					await this.update();
				})
				.catch((err) => {
					this.updateError(err);
					this.loading = false;
				});
		}
	}

	private updateError(err: any) {
		this.setState({
			error: err?.response?.data?.error || err.toString(),
		});
	}

	private removeError() {
		this.setState({
			error: undefined,
		});
	}

	public async componentDidMount() {
		if (correctDomain) await this.update();
		else
			this.setState({
				error: <DomainError />,
			});
	}

	public render() {
		return (
			<div className="max-w-4xl mx-auto container">
				<Header
					update={this.update.bind(this)}
					createDir={this.createDir.bind(this)}
					createFile={this.createFile.bind(this)}
					uploadFiles={this.uploadFiles.bind(this)}
					goUpOneDir={this.goUpOneDir.bind(this)}
					formatPwdForDisplay={this.formatPwdForDisplay.bind(this)}
					loading={this.state.loading}
					cwd={this.state.cwd}
				/>

				{this.state.error && <Error remove={this.removeError.bind(this)}>{this.state.error}</Error>}

				<Files
					rename={this.rename.bind(this)}
					remove={this.remove.bind(this)}
					updatePath={this.update.bind(this)}
					files={this.state.files}
					cwd={this.state.cwd}
				/>
			</div>
		);
	}
}
