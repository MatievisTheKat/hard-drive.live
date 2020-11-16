export interface FileInfo {
	readonly name: string;
	readonly path: string;
	readonly parent: string;
	readonly type: number;
	readonly user: number;
	readonly group: number;
	readonly size: {
		b: number;
		mb: number;
		gb: number;
	};
	readonly lastModifiedMs: number;
	readonly lastAccessedMs: number;
	readonly createdMs: number;
}

export enum Types {
	Unknown,
	Symlink,
	File,
	Directory,
	FIFO,
	CharacterDevice,
	BlockDevice,
	Socket,
}

export type SupportedFileIcon =
	| "word"
	| "powerpoint"
	| "pdf"
	| "archive"
	| "excel"
	| "video"
	| "audio"
	| "csv"
	| "image";
