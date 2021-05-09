export declare interface Config {    
    bot: Bot;
}

export declare interface Bot {
    name:    string;
    token:   string;
    tag:     string;
    prefix:  string;
    author:  string;
    version: string;
    footer?:  string;
}

export {}