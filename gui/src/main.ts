import { mount } from 'svelte';
import App from './app.svelte';

import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';
import './app.css';

export default mount(App, {
    target: document.getElementById('app') as HTMLElement,
});
