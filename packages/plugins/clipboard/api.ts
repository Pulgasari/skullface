// @skullface/plugins/clipboard/api.ts

export async function copy (text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

export async function paste (): Promise<string> {
  return await navigator.clipboard.readText();
}

export async function copyHTML (html: string): Promise<void> {
  const blob = new Blob([html], { type: "text/html" });
  const item = new ClipboardItem({ "text/html": blob });
  await navigator.clipboard.write([item]);
}

export async function copyJSON (obj: any): Promise<void> {
  const json = JSON.stringify(obj, null, 2);
  await navigator.clipboard.writeText(json);
}
