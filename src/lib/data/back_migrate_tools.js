// @ts-nocheck
import { promises } from 'fs';
import { join } from 'path';

const PATH_DIR_ENTRIES_INPUT = 'src/lib/data/entries';
const PATH_DIR_ENTRIES_OUTPUT = 'src/lib/data/evaluatedTools';

const OUTPUT_SKELETON = {
	"checklist_version": null,
	"date": null,
	"evaluators": [],
	"history": null,
	"name": null,
	"image": "brain_9_svgrepo_com--CadetBlue.png",
	"urls": [],
	"documentation": {},
	"infrastructure": {},
	"testing": {}
};

const DEFAULTS = {
	"checklist_version": "1.1",
	"evaluators": [{"name": "NMIND"}],
	"date": new Date().toISOString().split('T')[0]
}

/**
 * Read all json files from the input directory
 * @param {string} dirPath - The path to the directory to read from
 * @returns {Promise<any[]>} Each element is the parsed JSON content of a file
 */
async function readDirectoryData(dirPath) {
	const files = await promises.readdir(dirPath);
	const jsonFiles = files.filter((file) => file.endsWith('.json'));

	return Promise.all(
		jsonFiles.map(async (file) => {
			const filePath = join(dirPath, file);
			try {
				const fileContents = await promises.readFile(filePath, 'utf8');
				return JSON.parse(fileContents);
			} catch (error) {
				console.error(`Error reading file ${filePath}:`, error.message);
				throw error;
			}
		})
	);
}

function migrate(entry) {
	/* Ensure checklist entry fits schema, migrating with defaults if necessary. */
	const entry_migrated = { ...OUTPUT_SKELETON };
	const defaults = { ...DEFAULTS};

	entry_migrated.checklist_version = entry.checklist_version ? entry.checklist_version : defaults.checklist_version;
	entry_migrated.date = entry.date ? entry.date : defaults.date;
	entry_migrated.evaluators = entry.evaluators ? entry.evaluators : defaults.evaluators;
	entry_migrated.history = entry.history;
	entry_migrated.name = entry.name;
	entry_migrated.image = entry.image;
	entry_migrated.urls = entry.urls;
	entry_migrated.documentation = entry.documentation;
	entry_migrated.infrastructure = entry.infrastructure;
	entry_migrated.testing = entry.testing;

	return entry_migrated;
}

function makeUrlSafeName(name) {
	return name.toLowerCase().replace(/[^\w\s]/gi, '').replace(/ /g, '-');
}

// Create the output directory if it doesn't exist
await promises.mkdir(PATH_DIR_ENTRIES_OUTPUT, { recursive: true });

// Read all entries from the input directory, and write them to the output directory
for (const entry of await readDirectoryData(PATH_DIR_ENTRIES_INPUT)) {
	const entry_migrated = migrate(entry);
	const id = makeUrlSafeName(entry_migrated.name);
	const outputPath = join(PATH_DIR_ENTRIES_OUTPUT, `checklist_${id}.json`);
	await promises.writeFile(outputPath, JSON.stringify(entry_migrated, null, 2));
	console.log(`Generated ${outputPath} successfully.`);
}
