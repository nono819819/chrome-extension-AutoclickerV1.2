// This file is loaded as a content script.
// Functions defined in popup.js (startAutoClickAndRipple, stopAutoClickAndRipple)
// are directly called from the background script into this context.
// This is because chrome.scripting.executeScript can take a 'func' property
// and execute it directly in the target context (which is the content script's isolated world).

// The functions startAutoClickAndRipple and stopAutoClickAndRipple are passed directly
// from popup.js into the content script's execution context.
// Therefore, this file primarily acts as a placeholder to allow those functions to run.
// No explicit code is needed here, just its presence for 'files: ["content.js"]'
// in manifest.json and chrome.scripting.executeScript to work correctly.

// If you were to have more complex content script logic that doesn't fit
// into a single function call, you would put it here.