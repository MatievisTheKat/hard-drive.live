import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faFileWord as word,
	faFileExcel as excel,
	faFileAudio as audio,
	faFileVideo as video,
	faFilePdf as pdf,
	faFilePowerpoint as powerpoint,
	faFileArchive as archive,
	faFileImage as image,
	faFile,
	faFolder,
} from "@fortawesome/free-regular-svg-icons";
import { faFileCsv as csv } from "@fortawesome/free-solid-svg-icons";
import { SupportedFileIcon, Types } from "../types";

interface State {}
interface Props {
	ext: string;
	type: number;
	className?: string;
}

const icons: Record<SupportedFileIcon, any> = {
	word,
	excel,
	csv,
	image,
	archive,
	audio,
	video,
	powerpoint,
	pdf,
};

const extensions: Record<string, SupportedFileIcon> = {
	doc: "word",
	docm: "word",
	docx: "word",
	xlsx: "excel",
	xlsm: "excel",
	xlsb: "excel",
	xltx: "excel",
	jpg: "image",
	jpeg: "image",
	png: "image",
	ico: "image",
	gif: "image",
	mp3: "audio",
	wav: "audio",
	mp4: "video",
	m4v: "video",
	mov: "video",
	wmv: "video",
	mswmm: "video",
	rar: "archive",
	zip: "archive",
};

export default class FileIcon extends React.Component<Props, State> {
	public render() {
		const app = extensions[this.props.ext.toLowerCase()];
		const icon =
			this.props.type === Types.Directory
				? faFolder
				: icons[app] || icons[this.props.ext.toLowerCase() as SupportedFileIcon] || faFile;

		return <FontAwesomeIcon icon={icon} className={this.props.className} />;
	}
}
