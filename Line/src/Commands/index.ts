import { Command } from "./Command";
import { Help } from "./help";
import { List } from "./list";
import { Notify } from "./notify";
import { Send } from "./send";
import { Subscribe } from "./subscribe";
import { Unsubscribe } from "./unsubscribe";

export function Commands () {
    console.log(`Loadding Commands...`);

    new Subscribe();
    new Unsubscribe();
    new Help();
    new List();
    new Notify();
    new Send();

    console.log(`Loadding Successfully!`);
}