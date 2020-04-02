export class Value {
  type: string;
  value: string;
  /**
   * @param {string} type the type of the value
   * @param {any} value the value that will be cast to a string
   */
  constructor(
    type: "int" | "float" | "double" | "long" | "string",
    value: any
  ) {
    if (["int", "float", "double", "long"].includes(type)) {
      this.type = type;
      this.value = value.toString();
    } else {
      this.type = "string";
      this.value = `"${value}"`;
    }
  }
  /**
   * Outputs the value as a string
   */
  compile(): string {
    return (
      this.value +
      (["int", "float", "double", "long"].includes(this.type)
        ? this.type.slice(0, 1)
        : "")
    );
  }
}

export class ValueArray {
  type: string;
  values: Value[];
  /**
   * @param {string} type the type of array to be created
   * @param {Value[]} values the elements of the array
   */
  constructor(type: string, values?: Value[]) {
    this.type = type;
    this.values = values || [];
    for (let v of this.values)
      if (v.type != this.type)
        throw new Error(
          `Error: can't pass value of type ${v.type} to value array of type ${this.type}`
        );
  }
  /**
   * Output the value array as a string
   */
  compile(): string {
    return `[${this.values.map(v => v.compile()).join(", ")}]`;
  }
}

export class ValueCompound {
  values: {[key:string]:Value|ValueArray|ValueCompound};
  /**
   * @param {object} values
   */
  constructor(values:{[key:string]:Value|ValueArray|ValueCompound}){
    this.values=values;
  }
  compile(): string {
    return `{${Object.keys(this.values).map(s=>`${s}:${this.values[s].compile()}`)}}`;
  }
}