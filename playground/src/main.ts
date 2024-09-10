import './style.css';

import bionic from '@lector/mode-bionic';
import rsvp from '@lector/mode-rsvp';
import parseTxt from '@lector/parser-txt';
import { createReader } from '@lector/primitives';

const restart = document.querySelector('#restart') as HTMLButtonElement;
const finish = document.querySelector('#finish') as HTMLButtonElement;
const prev = document.querySelector('#prev') as HTMLButtonElement;
const next = document.querySelector('#next') as HTMLButtonElement;
const resume = document.querySelector('#resume') as HTMLButtonElement;
const pause = document.querySelector('#pause') as HTMLButtonElement;
const toggle = document.querySelector('#toggle') as HTMLButtonElement;
const readingModeToggler = document.querySelector('#toggle-reading-mode') as HTMLButtonElement;

const reader = createReader({
	parser: parseTxt('This is a dummy text to test the txt parser. 😾'),
	modes: {
		rsvp,
		bionic,
	},
	renderTo: document.querySelector('#display') as HTMLElement,
});

reader.render();

restart.addEventListener('click', async () => {
	await reader.executeCommand('rsvp', 'restart');
});

finish.addEventListener('click', async () => {
	await reader.executeCommand('rsvp', 'finish');
});

prev.addEventListener('click', async () => {
	await reader.executeCommand('rsvp', 'previous');
});

next.addEventListener('click', async () => {
	await reader.executeCommand('rsvp', 'next');
});

resume.addEventListener('click', async () => {
	await reader.executeCommand('rsvp', 'resumePlayback');
});

pause.addEventListener('click', async () => {
	await reader.executeCommand('rsvp', 'pausePlayback');
});

toggle.addEventListener('click', async () => {
	await reader.executeCommand('rsvp', 'togglePlayback');
});

readingModeToggler.addEventListener('click', () => {
	if (reader.mode === 'bionic') {
		reader.switchMode('rsvp');
	} else {
		reader.switchMode('bionic');
	}
});
