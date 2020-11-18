import * as fs from "fs-extra";

const built = process.argv[2];
const out = process.argv[3];

if (!built || !out) {
	console.error("Please provide two arguments (built, out)");
	process.exit(1);
}

fs.pathExists(built).then(async (builtExists) => {
	if (!builtExists) {
		console.error(`${!builtExists ? "Built" : "Out"} path does not exist`);
		process.exit(1);
	}

	await fs.ensureDir(out);

	fs.copy(built, out)
		.then(() => {
			console.log(`Built files copied to ${out}`);
			process.exit(0);
		})
		.catch((err) => {
			console.error(err);
			process.exit(1);
		});
});
