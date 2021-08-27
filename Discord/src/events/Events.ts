import { Bot } from "src/Bot";
import Ready from "./client/Ready";
import Disconnect from "./client/Disconnect";
import Error from "./client/Error";
import Message from "./guild/Message";
import VoiceStateUpdate from "./client/VoiceStateUpdate";
import GuildUpdate from "./client/GuildUpdate";

export class Events {

    private _bot: Bot;
    private _client: Bot["client"];

    constructor(bot: Bot) {
        this._bot = bot;
        this._client = bot["client"];
        this.setup();
    }

    private setup() {
        this._ready(); this._error();
        this._disconnect(); this._message();
        this._voiceStateUpdate();this._guildUpdate();
    }

    private _ready = () => this._client.on("ready", this._bind(Ready));
    private _error = () => this._client.on("error", this._bind(Error));
    private _disconnect = () => this._client.on("disconnect", this._bind(Disconnect));

    private _voiceStateUpdate = () => this._client.on("voiceStateUpdate", this._bind(VoiceStateUpdate));
    private _guildUpdate = () => this._client.on("guildUpdate", this._bind(GuildUpdate));

    private _message = () => this._client.on("message", this._bind(Message));

    private _bind = (fn: Function) => fn.bind(null, this._bot); 
}