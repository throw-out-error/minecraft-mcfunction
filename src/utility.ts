import fs from "fs";
function jsonBeautify(
	object: Record<string, unknown> | Array<unknown>
): string {
	const json: string[] = JSON.stringify(object).split("");
	let indent: number = 0;
	for (let i: number = 0; i < json.length; i++) {
		const char: string = json[i];
		switch (char) {
			case "{":
			case "[":
				indent++;
				json.splice(i + 1, 0, "\n");
				for (let j: number = 0; j < indent; j++)
					json.splice(i + j + 2, 0, "\t");
				break;
			case "}":
			case "]":
				indent--;
				json.splice(i, 0, "\n");
				for (let j: number = 0; j < indent; j++)
					json.splice(i + j + 1, 0, "\t");
				i += indent + 1;
				break;
			case ",":
				json.splice(i + 1, 0, "\n");
				for (let j: number = 0; j < indent; j++)
					json.splice(i + j + 2, 0, "\t");
				break;
		}
	}
	return json.join("");
}

function mkdirIfNotExist(path: string) {
	if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
}

function hasIllegalChars(s: string): boolean {
	return s != s.replace(/[^0-9a-z_\-.]/g, "");
}

function hasIllegalCharsSlash(s: string): boolean {
	return s != s.replace(/[^0-9a-z_\-./]/g, "");
}

function itemArrayFromString(s: string): Array<unknown> {
	return s
		.split("||")
		.map(s => (s[0] == "#" ? { tag: s.slice(1) } : { item: s }));
}

function assumeMinecraft(s: string): string {
	return s.includes(":") ? s : `minecraft:${s}`;
}

export {
	jsonBeautify,
	mkdirIfNotExist,
	hasIllegalChars,
	hasIllegalCharsSlash,
	itemArrayFromString,
	assumeMinecraft
};
