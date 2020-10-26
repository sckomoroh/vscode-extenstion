import { IClassBuilder } from './IClassBuilder'

export interface IClassBuilderFactory {
    create(className : string, filePath : string) : IClassBuilder;
}