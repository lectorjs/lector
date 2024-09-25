import './style.css';

import { RsvpMode, context } from '@lectorjs/mode-rsvp';
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

context.subscribe(({ isFinished, isPlaying }) => {
    if (isFinished) {
        toggle.textContent = 'Restart';
    } else if (isPlaying) {
        toggle.textContent = 'Pause';
    } else {
        toggle.textContent = 'Resume';
    }

    reader.render();
});

reader.render();

restart.addEventListener('click', reader.commands.goToStart);
finish.addEventListener('click', reader.commands.goToEnd);
prev.addEventListener('click', reader.commands.goBackward);
next.addEventListener('click', reader.commands.goForward);
toggle.addEventListener('click', reader.commands.toggle);
