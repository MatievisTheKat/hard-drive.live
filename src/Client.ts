import fs from "fs-extra";
import { join } from "path";
import archiver from "archiver";
import File, { Types } from "./File";

export default class Client {
	public readonly cwd: string;
	public readonly storagePath: string;

	constructor(devicePath: string) {
		this.storagePath = devicePath;
		this.cwd = devicePath;
	}

	public static nameFromPath(path: string): string | undefined {
		return path.split("/").pop();
	}

	public static parentFromPath(path: string): string {
		const split = path.split("/").filter((dir) => dir !== "");
		split.pop();
		return `/${split.join("/")}`;
	}

	public static async stat(path: string): Promise<File> {
		return new Promise(async (res, rej) => {
			const name = Client.nameFromPath(path);
			const parentPath = Client.parentFromPath(path);
			const stat = await fs.stat(path);
			const is = {
				file: stat.isFile(),
				dir: stat.isDirectory(),
				symlink: stat.isSymbolicLink(),
				fifo: stat.isFIFO(),
				socket: stat.isSocket(),
				charDevice: stat.isCharacterDevice(),
				blockDevice: stat.isBlockDevice(),
			};

			let type = Types.Unknown;

			if (is.file) type = Types.File;
			else if (is.dir) type = Types.Directory;
			else if (is.symlink) type = Types.Symlink;
			else if (is.fifo) type = Types.FIFO;
			else if (is.socket) type = Types.Socket;
			else if (is.charDevice) type = Types.CharacterDevice;
			else if (is.blockDevice) type = Types.BlockDevice;

			res(
				new File({
					name: name as string,
					path,
					type,
					user: stat.uid,
					group: stat.gid,
					size: stat.size,
					lastAccessed: stat.atimeMs,
					lastModified: stat.mtimeMs,
					created: stat.ctimeMs,
					parent: parentPath,
				})
			);
		});
	}

	public static async readDir(path: string): Promise<File[]> {
		return new Promise(async (res, rej) => {
			await fs
				.readdir(path)
				.then(async (contents) => {
					const files = [];

					for (const innerName of contents) {
						const innerPath = join(path, innerName);
						files.push(await Client.stat(innerPath));
					}

					res(files);
				})
				.catch(rej);
		});
	}

	public static async exists(path: string): Promise<boolean> {
		return await fs.pathExists(path);
	}

	public static cleanPathEnd(path: string): string {
		return path.endsWith("/") ? path.slice(0, path.length - 1) : path;
	}

	public sanitizePath(path: string): string {
		return path.startsWith(this.storagePath)
			? Client.cleanPathEnd(path)
			: join(this.storagePath, Client.cleanPathEnd(path));
	}

	public desanitizePath(path: string): string {
		return path.replace(this.storagePath, "");
	}

	public async ls(path: string = this.storagePath): Promise<File[]> {
		if (!path.startsWith(this.storagePath)) path = this.sanitizePath(path);
		if (path === "/" || path === "") path = this.storagePath;
		return await Client.readDir(path);
	}

	public rename(oldPath: string, newPath: string): Promise<void> {
		if (!oldPath.startsWith(this.storagePath)) oldPath = this.sanitizePath(oldPath);
		if (!newPath.startsWith(this.storagePath)) newPath = this.sanitizePath(newPath);
		return new Promise(async (res, rej) => {
			fs.rename(oldPath, newPath).then(res).catch(rej);
		});
	}

	public remove(path: string): Promise<void> {
		if (!path.startsWith(this.storagePath)) path = this.sanitizePath(path);
		return new Promise((res, rej) => {
			fs.remove(path).then(res).catch(rej);
		});
	}

	public upload(dirPath: string, tmpPath: string, name: string, overwrite = false): Promise<boolean | any> {
		const finalPath = join(!dirPath.startsWith(this.storagePath) ? this.sanitizePath(dirPath) : dirPath, name);
		return new Promise(async (res, rej) => {
			fs.move(tmpPath, finalPath, { overwrite })
				.then(() => res(true))
				.catch(rej);
		});
	}

	public create(path: string, name: string, ext: string, data?: string): Promise<void> {
		const filePath = join(!path.startsWith(this.storagePath) ? this.sanitizePath(path) : path, `${name}.${ext}`);
		return new Promise((res, rej) => {
			fs.writeFile(filePath, data || "")
				.then(res)
				.catch(rej);
		});
	}

	public mkdir(path: string): Promise<void> {
		if (!path.startsWith(this.storagePath)) path = this.sanitizePath(path);
		return new Promise((res, rej) => {
			fs.mkdir(path).then(res).catch(rej);
		});
	}

	public async zipDir(path: string, destPath?: string): Promise<File> {
		if (!path.startsWith(this.storagePath)) path = this.sanitizePath(path);
		const stat = await Client.stat(path);
		if (!destPath) destPath = join(Client.parentFromPath(path), `${stat.name}.zip`);

		return new Promise((res, rej) => {
			if (stat.type !== Types.Directory) return rej("Selected path is not a directory");

			const archive = archiver("zip");
			const stream = fs.createWriteStream(destPath as string);

			archive.directory(path, false).on("error", rej).pipe(stream);

			stream.on("close", async () => {
				const zipped = await Client.stat(destPath as string);
				res(zipped);
			});

			archive.finalize();
		});
	}
}
