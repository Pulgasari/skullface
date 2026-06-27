// @skullface/core/interfaces.ts

export interface SkullfaceConfig {
  plugins? : string[];
  window?  : {
    title?  : string;
    url?    : string;
    width?  : number;
    height? : number;
  };
}
