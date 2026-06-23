import { templates } from "../core/config.ts";

export default async function template() {
  console.log(Object.keys(templates).join("\n"));
}
