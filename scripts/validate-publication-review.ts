import { readFile } from 'node:fs/promises';
import { publicationReviewErrors } from '../worker/event-intelligence/publication-review.ts';
const [packetPath, reviewPath] = process.argv.slice(2);
if (!packetPath || !reviewPath) throw new Error('Provide editor-decision.json and publication-review.json');
const errors = publicationReviewErrors(JSON.parse(await readFile(packetPath,'utf8')), JSON.parse(await readFile(reviewPath,'utf8')));
if (errors.length) throw new Error(errors.join('\n'));
console.log('Publication impact, event uniqueness and source-reading review passed');
