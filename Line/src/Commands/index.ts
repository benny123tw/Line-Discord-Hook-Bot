import { Command } from "./Command";
import { Subscribe } from "./subscribe";
import { Unsubscribe } from "./unsubscribe";

export function Commands () {
    console.log(`Loadding Commands...`);

    new Subscribe();
    new Unsubscribe();

    console.log(Command.commands);

    console.log(`Loadding Successfully!`);
}