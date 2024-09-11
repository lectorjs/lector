import rsvp from '@librereader/mode-rsvp';
import parseTxt from '@librereader/parser-txt';
import { createReader } from '@librereader/primitives';
import './style.css';

const restart = document.querySelector('#restart') as HTMLButtonElement;
const finish = document.querySelector('#finish') as HTMLButtonElement;
const prev = document.querySelector('#prev') as HTMLButtonElement;
const next = document.querySelector('#next') as HTMLButtonElement;
const resume = document.querySelector('#resume') as HTMLButtonElement;
const pause = document.querySelector('#pause') as HTMLButtonElement;
const toggle = document.querySelector('#toggle') as HTMLButtonElement;

const reader = createReader({
	parser: parseTxt('This is a dummy text to test the txt parser. 😾'),
	mode: rsvp(),
	renderTo: document.querySelector('#display') as HTMLElement,
});

reader.render();

restart.addEventListener('click', async () => {
	await reader.executeCommand('restart');
});

finish.addEventListener('click', async () => {
	await reader.executeCommand('finish');
});

prev.addEventListener('click', async () => {
	await reader.executeCommand('prev');
});

next.addEventListener('click', async () => {
	await reader.executeCommand('next');
});

resume.addEventListener('click', async () => {
	await reader.executeCommand('resume');
});

pause.addEventListener('click', async () => {
	await reader.executeCommand('pause');
});

toggle.addEventListener('click', async () => {
	await reader.executeCommand('toggle');
});
