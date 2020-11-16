import React from "react";
import { Types, FileInfo } from "../types";

import DeleteButton from "./DeleteButton";
import DisplayFileInfo from "./DisplayFileInfo";
import RenamePopup from "./RenamePopup";
import FileIcon from "./FileIcon";

interface State {}
interface Props {
	files: FileInfo[];
	cwd: string;
	updatePath(path?: string): Promise<void>;
	remove(path: string): void;
	rename(oldName: string, newName: string): void;
}

export default class Files extends React.Component<Props, State> {
	public render() {
		const formatFiles = (files: FileInfo[]): JSX.Element => {
			return (
				<div className="mx-auto container flex-col">
					{files.map((f, i) => (
						<div key={i} className="flex-row text-black border border-gray-700 my-4 p-2 rounded shadow">
							{f.type === Types.Directory ? (
								<span
									className="hover-mouse-pointer hover:text-blue-700"
									onClick={async (e) => {
										e.preventDefault();
										await this.props.updatePath(`${this.props.cwd}/${f.name}`);
									}}>
									<FileIcon type={f.type} ext={"directory"} className="mx-2 text-blue-400" />
									{f.name}
								</span>
							) : (
								<a
									key={i}
									className="hover-mouse-pointer hover:text-blue-700"
									href={`http://hard-drive.live/api/download${this.props.cwd}/${f.name}`}
									download>
									<FileIcon type={f.type} ext={f.name.split(".").pop() || ""} className="mx-2 text-blue-400" />
									{f.name}
								</a>
							)}

							<DeleteButton remove={this.props.remove} cwd={this.props.cwd} file={f} />
							<RenamePopup rename={this.props.rename} name={f.name} />
							<DisplayFileInfo file={f} />
						</div>
					))}
				</div>
			);
		};

		return (
			<div className="mx-auto container flex-col mt-8">
				{formatFiles(this.props.files.filter((f) => f.type === Types.Directory).sort())}
				{formatFiles(this.props.files.filter((f) => f.type === Types.File).sort())}
			</div>
		);
	}
}
