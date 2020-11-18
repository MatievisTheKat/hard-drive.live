import dotenv from "dotenv";
import express, { Request } from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import { join, resolve } from "path";
import { Logger } from "./Logger";
import Client from "./Client";
import { Types } from "./File";
import fs from "fs-extra";

dotenv.config({
	path: resolve(".env"),
});

const client = new Client("/media/general/New Volume");
const app = express();
const upload = multer({ dest: resolve("tmp") });
const port = parseInt(process.env.PORT || "3000");

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("json spaces", 2);

app.get("/api/list/:basePath?/*", (req, res) => {
	const path = getPathFromParams(req);
	client
		.ls(path)
		.then((list) => res.json(list))
		.catch((err) => {
			Logger.error(err);
			res.status(500).json({ error: err.message });
		});
});

app.post("/api/rename", async (req, res) => {
	const { oldPath, newPath } = req.body;
	if (!oldPath || !newPath || !(await Client.exists(client.sanitizePath(oldPath))))
		return res.status(400).json({ error: "Error: cannot rename a file that does not exist" });

	client
		.rename(oldPath, newPath)
		.then(() => res.status(200).json({ success: true }))
		.catch((err) => {
			Logger.error(err);
			res.status(500).json(err);
		});
});

app.post("/api/remove", async (req, res) => {
	const { path } = req.body;
	if (!path || !(await Client.exists(client.sanitizePath(path))))
		return res.status(400).json({ error: "Error: failed to remove file since it does not exist" });

	client
		.remove(path)
		.then(() => res.status(200).json({ success: true }))
		.catch((err) => {
			Logger.error(err);
			res.status(500).json(err);
		});
});

app.post("/api/upload", upload.array("files"), async (req, res) => {
	const files = req.files as Express.Multer.File[];
	const { dirPath, overwrite } = req.body;
	if (!dirPath || !(await Client.exists(client.sanitizePath(dirPath))))
		return res.status(400).json({ error: "Error: Invalid directory to upload to" });

	let successCount = 0;
	const errors: any[] = [];

	for (const file of files) {
		const result = await client.upload(dirPath, file.path, file.originalname, overwrite).catch((err) => {
			Logger.error(err);
			errors.push(err.message);
		});
		if (result) successCount++;
	}

	if (successCount === 0) return res.status(500).json({ error: "Error: Failed to upload any files", errors });
	else res.status(200).json({ success: true, successCount });
});

app.post("/api/createDir", async (req, res) => {
	const { path } = req.body;
	if (!path) return res.status(400).json({ error: "Error: No path provided" });
	if (await Client.exists(client.sanitizePath(path)))
		return res.status(400).json({ error: "Error: A folder with that name already exists" });

	client
		.mkdir(path)
		.then(() => res.status(200).json({ success: true }))
		.catch((err) => {
			Logger.error(err);
			res.status(500).json(err);
		});
});

app.get("/api/zip/:basePath?/*", async (req, res) => {
	const path = client.sanitizePath(getPathFromParams(req));
	if (!(await Client.exists(path))) return res.status(400).json({ error: "Error: Path does not exist" });

	const stat = await Client.stat(path);
	if (stat.type !== Types.Directory)
		return res.status(400).json({ error: "Error: Requested path is not a folder" });

	client.zipDir(stat.path).then((zipped) => {
		res.status(200).json(zipped);
	});
});

app.get("/api/download/:basePath?/*", async (req, res) => {
	const path = client.sanitizePath(getPathFromParams(req));
	if (!(await Client.exists(path))) return res.status(400).json({ error: "Error: Path does not exist" });

	const stat = await Client.stat(path);
	if (stat.type === Types.Directory) {
		client.zipDir(path).then((zipped) => {
			res.download(zipped.path);
		});
	} else res.download(path);
});

app.get("/api/view/:basePath?/*", async (req, res) => {
	const path = client.sanitizePath(getPathFromParams(req));
	if (!(await Client.exists(path))) return res.status(400).json({ error: "Error: path does not exist" });

	const stat = await Client.stat(path);
	if (stat.type === Types.Directory)
		return res
			.status(400)
			.json({ error: "Error: cannot view a directory via this endpoint. Try /api/list/:path" });

	const parent = stat.parent;
	const pubParent = resolve(`./public/${client.desanitizePath(parent)}`);
	const pubPath = resolve(`./public/${client.desanitizePath(join(parent, stat.name))}`);

	await fs.ensureDir(pubParent);
	await fs.copyFile(path, pubPath);

	res.redirect(`/public${client.desanitizePath(path)}`);
});

app.use("/public", express.static(resolve("./public")));

app.post("/api/createFile", async (req, res) => {
	const { dirPath, fileName, fileExt, data } = req.body;
	if (!dirPath || !fileName || !fileExt)
		return res.status(400).json({ error: "Error: Must provide a dirPath, fileName, and fileExt" });
	if (await Client.exists(client.sanitizePath(`${dirPath}/${fileName}.${fileExt}`)))
		return res.status(400).json({ error: "Error: A file with that name and extension already exists" });

	client
		.create(dirPath, fileName, fileExt, data)
		.then(() => res.status(200).json({ success: true }))
		.catch((err) => {
			Logger.error(err);
			res.status(500).json(err);
		});
});

app.listen(port, () => Logger.log(`Listening on port ${port}`));

function getPathFromParams(req: Request): string {
	const { basePath } = req.params;

	return `${decodeURI(basePath || req.params["0"]) || ""}/${decodeURI(
		basePath
			? req.params["0"]
					.split(/\//g)
					.map((dir) => decodeURI(dir))
					.join("/") || ""
			: ""
	)}`;
}
