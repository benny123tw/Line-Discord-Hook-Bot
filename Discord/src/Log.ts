import * as winston from 'winston';
import * as chalk from 'chalk';

export class Log {

    private _logger: winston.Logger;
    private readonly _logLevels:
        winston.config.AbstractConfigSetLevels = {
            error: 0,
            warn: 1,
            info: 2,
            modules: 3,
            modwarn: 4,
            modinfo: 5,
            debug: 6,
        };
    private readonly _tag: string;

    constructor(tag: string) {
        this._logger = this.create();
        this.addColors();
        this._tag = this.tagFormat(tag);
    }

    private create(): winston.Logger {
        return winston.createLogger({
            levels: this._logLevels,
            transports: [new winston.transports.Console()],
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.padLevels({ levels: this._logLevels }),
                winston.format.timestamp(),
                winston.format.printf(info => `${info.timestamp} ${info.level}: ${chalk.greenBright(this._tag)}${info.message}`),
            ),
            level: 'debug',
        });
    }

    private addColors(): void {
        winston.addColors({
            error: 'red',
            warn: 'yellow',
            info: 'green',
            modules: 'cyan',
            modwarn: 'yellow',
            modinfo: 'green',
            debug: 'blue',
        })
    }

    private tagFormat(tag: string): string {
        if (!tag.startsWith('[')) tag = '[' + tag;
        if (!tag.endsWith(']')) tag = tag + ']';

        return tag.toUpperCase();
    }

    /**
     *  winston log methods
     */
    public info(message: string): void {
        this._logger.info(message);
    }

    public error(message: string): void {
        this._logger.error(message);
    }

    public debug(message: string): void {
        this._logger.debug(message);
    }

    public warn(message: string): void {
        this._logger.warn(message);
    }
}