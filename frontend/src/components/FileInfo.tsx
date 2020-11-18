import moment from "moment";
import React from "react";
import Popup from "reactjs-popup";
import { FileInfo as FileInfoType, Types } from "../types";

import Tooltip from "./Tooltip";

interface State {
	showDesc: {
		size: boolean;
		lastMod: boolean;
	};
}
interface Props {
	file: FileInfoType;
}

export default class FileInfo extends React.Component<Props, State> {
	public toProperCase(str: string) {
		return str
			.split(/ +/g)
			.map((word) => word[0].toUpperCase() + word.slice(1, word.length).toLowerCase())
			.join(" ");
	}
	public render() {
		const extractFullFormat = (format: string) =>
			format === "GB"
				? "Gigabytes"
				: format === "MB"
				? "Megabytes"
				: format === "KB"
				? "Kilobytes"
				: format === "B"
				? "Bytes"
				: "Unknown";

		const file = this.props.file;
		const [b, kb, mb, gb] = Object.values(file.size).map((n) => Math.round(n));
		const displaySize =
			gb > 0
				? `${gb.toLocaleString()} GB`
				: mb > 0
				? `${mb.toLocaleString()} MB`
				: kb > 0
				? `${kb.toLocaleString()} KB`
				: `${b.toLocaleString()} B`;
		const sizeFormat = displaySize.replace(/\d/g, "");

		return (
			<table className="table-auto text-sm text-gray-500 float-right -mt-1 mr-8">
				<tbody>
					<tr>
						<Popup
							trigger={<td className="border px-2 py-1 hover-mouse-help">{displaySize}</td>}
							position="top center">
							<Tooltip>File size in {extractFullFormat(sizeFormat).toLowerCase()}</Tooltip>
						</Popup>

						<Popup
							trigger={
								<td className="border px-2 py-1 hover-mouse-help">{moment(file.lastModifiedMs).fromNow()}</td>
							}
							position="top center">
							<Tooltip>Last modified</Tooltip>
						</Popup>

						<Popup
							trigger={<td className="border px-2 py-1 hover-mouse-help">{this.toProperCase(file.username)}</td>}
							position="top center">
							<Tooltip>User that owns this {file.type === Types.Directory ? "folder" : "file"}</Tooltip>
						</Popup>
					</tr>
				</tbody>
			</table>
		);
	}
}
