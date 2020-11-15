import { faFolder, faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { FileInfo, Types } from "../types";

import DeleteButton from "./DeleteButton";
import LastModified from "./LastModified";
import Size from "./Size";

interface State {}
interface Props {
	files: FileInfo[];
	cwd: string;
	updatePath(path?: string): Promise<void>;
	remove(path: string): void;
}

export default class Files extends React.Component<Props, State> {
	public render() {
		return (
			<div className="mx-auto container flex-col mt-8">
				{this.props.files
					.filter((f) => f.type === Types.Directory)
					.sort()
					.map((f, i) => (
						<div key={i} className="flex-row text-black border border-gray-700 my-4 p-1 rounded shadow">
							<span
								className="hover-mouse-pointer hover:text-blue-700"
								onClick={async (e) => {
									e.preventDefault();
									await this.props.updatePath(`${this.props.cwd}/${f.name}`);
								}}>
								<FontAwesomeIcon icon={faFolder} className="mx-2 text-blue-400" />
								{f.name}
							</span>
							<DeleteButton remove={this.props.remove} cwd={this.props.cwd} file={f} />
							<LastModified timestamp={f.lastModifiedMs} />
							<Size bytes={f.size.b} />
						</div>
					))}

				{this.props.files
					.filter((f) => f.type === Types.File)
					.sort()
					.map((f, i) => (
						<div key={i} className="flex-row text-black border border-gray-700 my-4 p-1 rounded shadow">
							<a
								key={i}
								className="hover-mouse-pointer hover:text-blue-700"
								href={`http://hard-drive.live/api/download${this.props.cwd}/${f.name}`}
								download>
								<FontAwesomeIcon icon={faFile} className="mx-2 text-blue-400" />
								{f.name}
							</a>

							<DeleteButton remove={this.props.remove} cwd={this.props.cwd} file={f} />
							<LastModified timestamp={f.lastModifiedMs} />
							<Size bytes={f.size.b} />
						</div>
					))}
			</div>
		);
	}
}
