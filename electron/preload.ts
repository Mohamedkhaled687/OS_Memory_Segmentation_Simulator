import { contextBridge } from "electron";

// Expose a minimal API to the renderer.
// Currently the simulator is entirely client-side,
// so we only expose a platform identifier.
contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
});
