import { IClassBuilderFactory } from './IClassBuilderFactory';
import { IClassBuilder } from './IClassBuilder';
import { CppInlineClassBuilder } from './CppInlineClassBuilder';

export class CppInlineClassBuilderFactory implements IClassBuilderFactory {
    create(className : string, filePath : string) : IClassBuilder {
        return new CppInlineClassBuilder(className, filePath);
    }
}
