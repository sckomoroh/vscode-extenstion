import { IClassBuilderFactory } from './IClassBuilderFactory';
import { IClassBuilder } from './IClassBuilder';
import { CppTestClassBuilder } from './CppTestClassBuilder';

export class CppTestClassBuilderFactory implements IClassBuilderFactory {
    create(className : string, filePath : string) : IClassBuilder {
        return new CppTestClassBuilder(className, filePath);
    }
}
