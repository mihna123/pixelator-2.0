import { getState } from "../core/state/shared-state.js";
import { exportFrames } from "../core/utils/exportUtil.js";

export function settupSettings() {
	const exportButton = document.getElementById("export-btn");

	exportButton.onclick = () => {
		const state = getState();
		exportFrames(state.frames);
	};
}
