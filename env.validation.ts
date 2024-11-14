import { plainToInstance } from "class-transformer";
import { IsEnum, IsNumber, IsString, validateSync } from "class-validator";

enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
    Provision = 'provision',
};

class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment;

    @IsNumber()
    PORT: number

    @IsString()
    DB_HOST: string

    @IsNumber()
    DB_PORT: number;

    @IsString()
    DB_USERNAME: string;

    @IsString()
    DB_PASSWORD: string;

    @IsString()
    DB_NAME: string

    @IsString()
    SECRET: string
}


export function validate(config: Record<string, unknown>) {
    console.log("config : ", config)
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    })

    console.log("validated config : ", validatedConfig)

    const error = validateSync(validatedConfig, {
        skipMissingProperties: false
    });
    if (error.length > 0) {
        throw new Error(error.toString())
    }

    return validatedConfig
}