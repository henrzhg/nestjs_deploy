import { IsArray, IsDateString, IsMilitaryTime, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSongsDTO {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    @IsArray()
    // @IsString({ each:true })
    @IsNumber({}, { each:true })
    readonly artists;

    @IsNotEmpty()
    @IsDateString()
    readonly releasedDate: Date;

    @IsNotEmpty()
    @IsMilitaryTime()
    readonly duration: Date;

    @IsString()
    @IsOptional()
    readonly lyrics: string;
}