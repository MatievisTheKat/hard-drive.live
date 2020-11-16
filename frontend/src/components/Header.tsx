import { faArrowAltCircleLeft, faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import Popup from "reactjs-popup";

import CreateDirPopup from "./CreateDirPopup";
import UploadPopup from "./UploadPopup";
import CreateFilePopup from "./CreateFilePopup";

interface State {}
interface Props {
	cwd: string;
	createDir(name: string): void;
	createFile(name: string, ext: string, data?: string): void;
	uploadFiles(files: FileList): void;
	goUpOneDir(): void;
	formatPwdForDisplay(): JSX.Element[];
}

export default class Header extends React.Component<Props, State> {
	public render() {
		return (
			<div className="container border border-blue-800 border-b-2 shadow-lg m-10 p-1 mx-auto">
				<h4>
					<span className="max-w-2xl">
						<FontAwesomeIcon
							icon={faArrowAltCircleLeft}
							className="mx-2 text-blue-600 hover-mouse-pointer"
							onClick={(e) => {
								e.preventDefault();
								this.props.goUpOneDir();
							}}
						/>
						{this.props.cwd ? this.props.formatPwdForDisplay() : "/"}
					</span>

					<Popup
						trigger={
							<span className="float-right text-blue-600 mx-2 hover-mouse-pointer">
								<FontAwesomeIcon icon={faPlusSquare} />
							</span>
						}
						position="left center"
						nested>
						{(close: any) => (
							<div className="shadow bg-gray-300">
								<CreateFilePopup createFile={this.props.createFile} closeUpperPopup={close} />
								<UploadPopup uploadFiles={this.props.uploadFiles} closeUpperPopup={close} />
								<CreateDirPopup createDir={this.props.createDir} closeUpperPopup={close} />
							</div>
						)}
					</Popup>
				</h4>
			</div>
		);
	}
}
