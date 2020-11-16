import Axios from "axios";
import React from "react";

import { FileInfo } from "./types";
import Files from "./components/Files";
import Header from "./components/Header";
import Error from "./components/Error";

interface State {
	error?: any;
	files: FileInfo[];
	cwd: string;
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
		};
	}

	private async update(path: string = this.state.cwd) {
		await Axios.get(`http://hard-drive.live/api/list/${path}`)
			.then((res) => {
				this.setState({
					files: res.data,
					cwd: path,
				});
			})
			.catch(this.updateError.bind(this));
	}

	private async goUpOneDir() {
		const dirs = this.state.cwd.split("/").map((part) => (part === "" ? undefined : part));

		if (dirs.length < 2) return;
		else {
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
		Axios.post("http://hard-drive.live/api/rename", {
			oldPath: `${this.state.cwd}/${oldName}`,
			newPath: `${this.state.cwd}/${newName}`,
		})
			.then(async (res) => {
				await this.update();
			})
			.catch(this.updateError.bind(this));
	}

	private remove(path: string) {
		Axios.post("http://hard-drive.live/api/remove", {
			path,
		})
			.then(async () => {
				await this.update();
			})
			.catch(this.updateError.bind(this));
	}

	private createDir(name: string) {
		Axios.post("http://hard-drive.live/api/createDir", {
			path: `${this.state.cwd}/${name}`,
		})
			.then(async () => {
				await this.update();
			})
			.catch(this.updateError.bind(this));
	}

	private createFile(name: string, ext: string, data?: string) {
		Axios.post("http://hard-drive.live/api/createFile", {
			dirPath: this.state.cwd || "/",
			fileName: name,
			fileExt: ext,
			data,
		})
			.then(async (res) => {
				await this.update();
			})
			.catch(this.updateError.bind(this));
	}

	private uploadFiles(files: FileList): void {
		for (const file of files) {
			const form = new FormData();

			form.append("files", file, file.name);
			form.append("dirPath", this.state.cwd || "/");

			Axios.post("http://hard-drive.live/api/upload", form)
				.then(async () => {
					await this.update();
				})
				.catch(this.updateError.bind(this));
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
				error: (
					<span>
						Incorrect domain. In order for this to work properly you will need to update your 'hosts' file.
						<div className="mt-1" />
						<br />
						{window.navigator.platform === "Win32" ? (
							<>
								- Open Notepad as Administrator
								<br />- Select '<code>File</code>' then '<code>Open</code>'
								<br />- Navigate to '<code>C:\Windows\System32\drivers\etc\</code>' and select the '
								<code>hosts</code>' file
							</>
						) : window.navigator.platform.toLowerCase().includes("linux") ? (
							<>
								- Open '<code>/etc/hosts</code>' in sudo mode
							</>
						) : window.navigator.platform.toLowerCase().includes("mac") ? (
							<>
								- Open '<code>/private/etc/hosts</code>' in sudo mode
							</>
						) : (
							<>
								- Open{" "}
								<a
									className="hover:underline text-blue-600"
									href="https://www.google.com/search?q=where+is+my+hosts+file&oq=where+is+my+hosts+file&aqs=chrome..69i57j0l5.4430j0j9&sourceid=chrome&ie=UTF-8"
									target="_blank"
									rel="noreferrer">
									your operating system's '<code>hosts</code>'
								</a>{" "}
								file
							</>
						)}
						<br />- With the file open, add '<code>192.168.1.113 hard-drive.live</code>' below the any content
						<br />- Save the file and{" "}
						<a className="hover:underline text-blue-600" href="http://hard-drive.live">
							click here
						</a>
						. You should be redirected to http://hard-drive.live and be able to view the network hard drive
					</span>
				),
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
					cwd={this.state.cwd}
				/>

				{this.state.error ? <Error remove={this.removeError.bind(this)}>{this.state.error}</Error> : null}

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
