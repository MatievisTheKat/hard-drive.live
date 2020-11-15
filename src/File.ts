import fs from "fs-extra";
import Client from "./Client";

export interface FileInfo {
	name: string;
	path: string;
	type: number;
	user: number;
	group: number;
	size: number;
	lastModifiedMs: number;
	lastAccessedMs: number;
	createdMs: number;
	parent: string;
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

export interface FileOptions {
	name: string;
	path: string;
	parent: string;
	type: number;
	user: number;
	group: number;
	size: number;
	lastModified: number;
	lastAccessed: number;
	created: number;
}

export default class File {
	public readonly name: string;
	public readonly path: string;
	public readonly parent: string;
	public readonly type: number;
	public readonly user: number;
	public readonly group: number;
	public readonly size: {
		b: number;
		mb: number;
		gb: number;
	};
	public readonly lastModifiedMs: number;
	public readonly lastAccessedMs: number;
	public readonly createdMs: number;

	constructor(opts: FileOptions) {
		this.name = opts.name;
		this.path = opts.path;
		this.parent = opts.parent;
		this.type = opts.type;
		this.user = opts.user;
		this.group = opts.group;
		this.size = {
			b: opts.size,
			mb: opts.size / 1024,
			gb: opts.size / 1024 / 1024,
		};
		this.lastModifiedMs = opts.lastModified;
		this.lastAccessedMs = opts.lastAccessed;
		this.createdMs = opts.created;
	}

	public async read(): Promise<File[] | Buffer> {
		return new Promise(async (res, rej) => {
			if (this.type === Types.Directory) {
				res(await Client.readDir(this.path));
			} else if (this.type === Types.File || this.type === Types.Symlink) {
				res(await fs.readFile(this.path));
			} else {
				rej(`Cannot read file of type '${Types[this.type]}'`);
			}
		});
	}
}
