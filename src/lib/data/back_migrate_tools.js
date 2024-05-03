// @ts-nocheck
import { promises } from 'fs';
import { join } from 'path';

const PATH_DIR_ENTRIES_INPUT = 'src/lib/data/entries';
const PATH_DIR_ENTRIES_OUTPUT = 'src/lib/data/evaluatedTools';

const OUTPUT_SKELETON = {
	"name": null,
	"description": null,
	"urls": [],
	"maintainers": [],
	"evaluations": [],
	"slug": null,
	"image": "brain_9_svgrepo_com--CadetBlue.png",
	"tags": []
};

const EVALUATION_SKELETON = {
	"checklistVersion": "1.1",
	"toolVersion": "0.0.0",
	"date": null,
	"evaluatorEmail": "nmind@nmind.mock",
	"checklist": {}
};

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

function makeUrlSafeName(name) {
	return name.toLowerCase().replace(/[^\w\s]/gi, '').replace(/ /g, '-');
}

function convertKeys(obj) {
    const newObj = {};
    Object.keys(obj).forEach(key => {
        let categoryAbbreviation;
        if (key === 'testing') {
            categoryAbbreviation = 'tst';
        } else if (key === 'infrastructure') {
            categoryAbbreviation = 'inf';
        } else if (key === 'documentation') {
            categoryAbbreviation = 'doc';
        } else {
			return;
		}
        newObj[key] = {};
        Object.keys(obj[key]).forEach(subKey => {
			newObj[key][subKey] = {};
			Object.keys(obj[key][subKey]).forEach(subSubKey => {
				newObj[key][subKey][`${subKey}_${categoryAbbreviation}_${subSubKey}`] = obj[key][subKey][subSubKey];
			});
        });
    });
    return newObj;
}

function backMigrate(entry) {
	const entry_backmigrated = { ...OUTPUT_SKELETON };
	entry_backmigrated.name = entry.name;
	entry_backmigrated.description = `This tool was migrated from the old format. Please update it.`;
	entry_backmigrated.urls = entry.urls.map(x => ({ "text": x.url_type, href: x.url }));
	entry_backmigrated.slug = makeUrlSafeName(entry.name);
	entry_backmigrated.evaluations = entry.evaluations ? entry.evaluations : [];

	const evaluation = { ...EVALUATION_SKELETON };
	// set date as today in the format YYYY-MM-DD
	evaluation.date = new Date().toISOString().split('T')[0];
	evaluation.checklist = convertKeys(entry);

	entry_backmigrated.evaluations.push(evaluation);
	return entry_backmigrated;
}

// Create the output directory if it doesn't exist
await promises.mkdir(PATH_DIR_ENTRIES_OUTPUT, { recursive: true });

// Read all entries from the input directory, and write them to the output directory
for (const entry of await readDirectoryData(PATH_DIR_ENTRIES_INPUT)) {
	const entry_backmigrated = backMigrate(entry);
	const id = entry_backmigrated.slug;
	const outputPath = join(PATH_DIR_ENTRIES_OUTPUT, `${id}.json`);
	await promises.writeFile(outputPath, JSON.stringify(entry_backmigrated, null, 2));
	console.log(`Generated ${outputPath} successfully.`);
}
