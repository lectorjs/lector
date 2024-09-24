import './style.css';

import { RsvpMode, subscribeContext } from '@lectorjs/mode-rsvp';
import parser from '@lectorjs/parser-text';
import { createReader } from '@lectorjs/primitives';

const restart = document.querySelector('#restart') as HTMLButtonElement;
const finish = document.querySelector('#finish') as HTMLButtonElement;
const prev = document.querySelector('#prev') as HTMLButtonElement;
const next = document.querySelector('#next') as HTMLButtonElement;
const toggle = document.querySelector('#toggle') as HTMLButtonElement;

const reader = createReader({
    mode: new RsvpMode(),
    parser: parser('Jokester began sneaking into the castle in the middle of the night and leaving jokes. 😾'),
    renderTo: document.querySelector('#display') as HTMLElement,
});

subscribeContext(({ isFinished, isPlaying }) => {
    if (isFinished) {
        toggle.textContent = 'Restart';
    } else if (isPlaying) {
        toggle.textContent = 'Pause';
    } else {
        toggle.textContent = 'Resume';
    }
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

toggle.addEventListener('click', async () => {
    await reader.executeCommand('toggle');
});
