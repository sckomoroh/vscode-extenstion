import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { IClassBuilder } from './IClassBuilder';

export class CppInlineClassBuilder implements IClassBuilder {
    private readonly _className : string;
    private readonly _path : string;

    constructor(className : string, filePath : string) {
        this._className = className;
        this._path = filePath;
    }

    createClass() {
        var config = vscode.workspace.getConfiguration('class-creator');
        var namespace = config.get<string>("defaultNamespace");
        var is17std = config.get<boolean>("is17std");
        if (is17std === undefined) {
            is17std = false;
        }

        this.createHeaderFile(namespace, is17std);
    }

    private createHeaderFile(namespace : string | undefined, is17std : boolean) {
        var fileContent : string = "";

        fileContent += "#ifndef ";

        var namespaceParts : string[] | undefined = undefined;
        if (namespace !== undefined) {
            namespaceParts = namespace.split(".");
        }

        var lockGuard : string = this.createLockGuard(namespaceParts);
        fileContent += lockGuard + "\n";
        fileContent += "#define " + lockGuard + "\n\n";

        if (namespaceParts !== undefined) {
            fileContent += this.createStartNamespace(is17std, namespaceParts);
        }

        fileContent += "\n";
        fileContent += "class " + this._className + " {\n";
        fileContent += "private:\n\n";
        fileContent += "public:\n";
        fileContent += "    " + this._className + "() = default;\n";
        fileContent += "    virtual ~" + this._className + "() = default;\n";
        fileContent += "};\n\n";

        if (namespaceParts !== undefined) {
            fileContent += this.createEndNamespace(is17std, namespaceParts);
        }

        fileContent += "\n";
        fileContent += "#endif // " + lockGuard + "\n";

        var filePath = path.join(this._path, this._className + ".h");
        this.writeToFileAndOpen(filePath, fileContent, true);
    }

    private createLockGuard(namespaceParts : string[] | undefined) : string {
        var lockGuard : string;
        lockGuard = this._className + "_H_";
        if (namespaceParts !== undefined) {
            lockGuard = namespaceParts.join('_') + "_" + lockGuard;
        }

        return lockGuard;
    }

    private writeToFileAndOpen(fileName : string, content : string, active : boolean) {
        fs.writeFileSync(fileName, content, 'utf8');

        var openPath = vscode.Uri.parse("file://" + fileName);
        vscode.workspace.openTextDocument(openPath).then(doc => {
            vscode.window.showTextDocument(doc, active
                ? vscode.ViewColumn.Active
                : vscode.ViewColumn.Beside);
        });
    }

    private createStartNamespace(is17std : boolean, namespaceParts : string[]) : string {
        var fileContent : string = "";
        if (is17std) {
            var namespace17Std = namespaceParts.join("::");
            fileContent += "namespace " + namespace17Std + " {\n";
        } else {
            namespaceParts.forEach(element => {
                fileContent += "namespace " + element + " {\n";
            });
        }

        return fileContent;
    }

    private createEndNamespace(is17std : boolean, namespaceParts : string[]) : string {
        var fileContent : string = "";
        if (is17std) {
            var namespace17Std = namespaceParts.join("::");
            fileContent += "} // " + namespace17Std + "\n";
        } else {
            for (var i=namespaceParts.length - 1; i>=0; i--) {
                fileContent += "} // " + namespaceParts[i] + "\n";
            }
        }

        return fileContent;
    }
}