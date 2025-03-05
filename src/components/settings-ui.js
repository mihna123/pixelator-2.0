import { getState } from "../core/state/shared-state.js";
import { exportLayers } from "../core/utils/exportUtil.js";

export function settupSettings() {
	const exportButton = document.getElementById("export-btn");

	exportButton.onclick = () => {
		const state = getState();
		exportLayers(state.layers);
	};
}
