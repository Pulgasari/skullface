export interface ClipboardAPI {
  copy     (text: string) : Promise<void>;
  copyHTML (html: string) : Promise<void>;
  copyJSON (obj: any)     : Promise<void>;
  paste()                 : Promise<string>;
}
