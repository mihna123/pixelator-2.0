import { settupFrames } from "./components/frames-ui.js";
import { settupSettings } from "./components/settings-ui.js";
import { settupTools } from "./components/tools-ui.js";
import { initialiseRenderer } from "./core/canvas/render.js";
import { setupEventListenets } from "./core/events/handlers.js";
import {
	getFramesState,
	getPreviewState,
	getState,
} from "./core/state/shared-state.js";

const state = getState();
const framesState = getFramesState();
const previewState = getPreviewState();

settupTools();
settupSettings();
settupFrames();
setupEventListenets();

const mainRenderer = initialiseRenderer(state);
const frameRendeder = initialiseRenderer(framesState);
const previewRenderer = initialiseRenderer(previewState);

let previewFrameIndex = 0;

setInterval(() => {
	mainRenderer.draw([...state.frames[state.frameIndex], state.highlightLayer]);
	frameRendeder.draw(state.frames[state.frameIndex]);
	previewRenderer.draw(state.frames[previewFrameIndex]);
}, 50);

setInterval(() => {
	++previewFrameIndex;
	previewFrameIndex %= state.frames.length;
	previewState.shouldClear = true;
	previewState.shouldDraw = true;
}, 100);
