import { Command } from "..";
import { Argument, Position } from "../../arguments";

type MaskMode = "replace" | "masked";

function isMaskMode(arg: unknown): arg is MaskMode {
    return arg === "replace" || arg === "masked";
}

type CloneMode = "force" | "move" | "normal";
type Filter = string;
type Clone =
    | [Position, Position, Position]
    | [Position, Position, Position, MaskMode]
    | [Position, Position, Position, MaskMode, CloneMode];
type CloneFiltered =
    | [Position, Position, Position, "filtered", string]
    | [Position, Position, Position, "filtered", string, CloneMode];

type Args = Clone | CloneFiltered;

export class CloneCommand extends Command<"clone", Args> {
    begin: Position;
    end: Position;
    destination: Position;
    maskMode?: MaskMode;
    filter?: Filter;
    cloneMode?: CloneMode;

    constructor(
        begin: Position,
        end: Position,
        destination: Position,
        maskMode?: MaskMode,
        cloneMode?: CloneMode
    );
    constructor(
        begin: Position,
        end: Position,
        destination: Position,
        filter?: Filter,
        cloneMode?: CloneMode
    );
    constructor(
        begin: Position,
        end: Position,
        destination: Position,
        filterOrMaskMode?: Filter | MaskMode,
        cloneMode?: CloneMode
    ) {
        super("clone");
        this.begin = begin;
        this.end = end;
        this.destination = destination;

        if (!filterOrMaskMode) this.maskMode = "replace";
        else if (isMaskMode(filterOrMaskMode)) this.maskMode = filterOrMaskMode;
        else this.filter = filterOrMaskMode;

        this.cloneMode = cloneMode ?? "normal";
    }

    getArguments() {
        const args: Argument[] = [
            ...super.getArguments(),
            this.begin,
            this.end,
            this.destination,
        ];

        // cloneMode === 'normal' can be omitted
        const cloneMode = this.cloneMode !== "normal" && this.cloneMode;

        const maskMode = this.maskMode !== "replace" && this.maskMode;

        if (cloneMode || maskMode || this.filter) {
            if (maskMode) args.push(maskMode);
            else if (this.filter) args.push("filtered", this.filter);

            if (cloneMode) args.push(cloneMode);
        }

        return args as Args;
    }
}

export function clone(
    begin: Position,
    end: Position,
    destination: Position,
    maskMode?: MaskMode,
    cloneMode?: CloneMode
): CloneCommand;
export function clone(
    begin: Position,
    end: Position,
    destination: Position,
    filter?: Filter,
    cloneMode?: CloneMode
): CloneCommand;
export function clone(
    begin: Position,
    end: Position,
    destination: Position,
    filterOrMaskMode?: Filter | MaskMode,
    cloneMode?: CloneMode
): CloneCommand {
    return new CloneCommand(
        begin,
        end,
        destination,
        filterOrMaskMode,
        cloneMode
    );
}

Command.registerCommand("clone", clone);
declare module "../" {
    interface CommandContext {
        clone: typeof clone;
    }
}
