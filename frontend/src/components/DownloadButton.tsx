import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleDown } from "@fortawesome/free-regular-svg-icons";

interface State {}
interface Props {
	path: string;
}

export default class DownloadButton extends React.Component<Props, State> {
	public render() {
		return (
			<span className="text-right float-right mr-4 text-blue-500 hover:text-blue-700 hover-mouse-pointer">
				<a href={`http://hard-drive.live/api/download${this.props.path}`} target="_blank" rel="noreferrer">
					<FontAwesomeIcon icon={faArrowAltCircleDown} />
				</a>
			</span>
		);
	}
}
