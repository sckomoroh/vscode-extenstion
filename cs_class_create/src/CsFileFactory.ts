import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class CsFileFactory {
    private readonly _className: string;
    private readonly _filePath: string;

    constructor(className: string, filePath: string) {
        this._className = className;
        this._filePath = filePath;
    }

    public createClass() {
        var config = vscode.workspace.getConfiguration('cs-class-creator');
        var namespace = config.get<string>("defaultNamespace");
        var srcRoot = config.get<string>("rootSourceFolder");

        if (srcRoot === undefined) {
            return;
        }

        if (namespace === undefined) {
            return;
        }

        this.createSourceFile(namespace, srcRoot);
    }

    private createSourceFile(namespace: string, srcRoot: string) {
        var workspace = vscode.workspace;
        if (workspace === undefined) {
            return undefined;
        }

        var root = workspace.rootPath;
        if (root === undefined) {
            return undefined;
        }

        var fileNamespace = this.getFileNamespace(namespace, root, srcRoot);
        this.createAndSaveFile(fileNamespace);
    }

    private createAndSaveFile(fileNamespace: string) {
        var fileContent = "namespace " + fileNamespace + "\n{\n";
        fileContent += "    class " + this._className + "\n    {\n";
        fileContent += "    }\n";
        fileContent += "}\n";

        var fileName = path.join(this._filePath, this._className + ".cs");

        fs.writeFileSync(fileName, fileContent, 'utf8');

        var openPath = vscode.Uri.parse("file://" + fileName);
        vscode.workspace.openTextDocument(openPath).then(doc => {
            vscode.window.showTextDocument(doc, vscode.ViewColumn.Active);
        });
    }

    private getFileNamespace(namespace: string, root: string, srcRoot: string): string {
        var filePath = this._filePath.substr(root.length + 1);
        filePath = filePath.substr(srcRoot.length + 1);

        if (filePath.length === 0) {
            return namespace;
        }

        return namespace + "." + filePath.replace("/", ".");
    }
}