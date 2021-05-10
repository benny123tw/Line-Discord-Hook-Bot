export declare interface Config {    
    bot: BotConfig;
}

export declare interface BotConfig {
    name:     string;
    token:    string;
    tag:      string;
    prefix:   string;
    author:   string;
    version:  string;
    footer?:  string;
}

export {}