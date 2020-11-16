import moment from "moment";
import React from "react";
import Popup from "reactjs-popup";
import { FileInfo } from "../types";

import Tooltip from "./Tooltip";

interface State {
	showDesc: {
		size: boolean;
		lastMod: boolean;
	};
}
interface Props {
	file: FileInfo;
}

export default class DisplayFileInfo extends React.Component<Props, State> {
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
					</tr>
				</tbody>
			</table>
		);
	}
}
