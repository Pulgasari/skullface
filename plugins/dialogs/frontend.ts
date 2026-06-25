// plugin/dialogs/frontend.ts

export const pickFile         = (o) => window.__skullface_dialogs.pickFile(o);
export const pickFiles        = (o) => window.__skullface_dialogs.pickFiles(o);
export const pickFolder       = (o) => window.__skullface_dialogs.pickFolder(o);
export const pickSaveLocation = (o) => window.__skullface_dialogs.pickSaveLocation(o);

export const showMessage = (o) => window.__skullface_dialogs.showMessage(o);
export const showConfirm = (o) => window.__skullface_dialogs.showConfirm(o);
export const showError   = (o) => window.__skullface_dialogs.showError(o);
