import { settupSettings } from "./components/settings-ui.js";
import { settupTools } from "./components/tools-ui.js";
import { initialiseRenderer } from "./core/canvas/render.js";
import { setupEventListenets } from "./core/events/handlers.js";
import { getState } from "./core/state/shared-state.js";

const state = getState();
settupTools();
settupSettings();
setupEventListenets();

const renderer = initialiseRenderer(state.canvas);

setInterval(() => {
	renderer.draw(state.layers);
}, 50);
