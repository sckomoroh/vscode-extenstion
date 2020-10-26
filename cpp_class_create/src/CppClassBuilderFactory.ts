import { IClassBuilderFactory } from './IClassBuilderFactory';
import { IClassBuilder } from './IClassBuilder';
import { CppClassBuilder } from './CppClassBuilder';

export class CppClassBuilderFactory implements IClassBuilderFactory {
    create(className : string, filePath : string) : IClassBuilder {
        return new CppClassBuilder(className, filePath);
    }
}
