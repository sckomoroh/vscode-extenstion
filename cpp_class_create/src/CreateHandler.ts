import * as vscode from 'vscode';
import * as path from 'path';

import { IClassBuilderFactory } from "./IClassBuilderFactory";

export class CreateHandler {
	private readonly _factory : IClassBuilderFactory;
	constructor(factory : IClassBuilderFactory) {
		this._factory = factory;
	}

	create(fileUri : vscode.Uri) {
		var filePath = this.getFilePath(fileUri);
		if (filePath === undefined) {
			return;
		}

		var classNameResult = vscode.window.showInputBox();
		classNameResult.then((className) => this.processClassNameResult(className, filePath));
	}

	private getFilePath(fileUri : vscode.Uri) : string | undefined {
		var result : string | undefined = undefined;

		do {
			if (fileUri !== undefined && fileUri.path !== undefined) {
				result = fileUri.path;
				break;
			}

			if (vscode.workspace === undefined) {
				console.log("The workspace is undefined");
				break;
			}
			if (vscode.workspace.rootPath === undefined) {
				console.log("The workspace root path is undefined");
				break;
			}

			var config = vscode.workspace.getConfiguration('class-creator');
			if (config === undefined) {
				console.log("Configuration is undefined");
				break;
			}

			var rootSource = config.get<string>("rootSourceFolder");
			if (rootSource === undefined) {
				console.log("Source root is undefined");
				break;
			}

			if (vscode.workspace.rootPath === undefined) {
				break;
			}

			result = path.join(vscode.workspace.rootPath, rootSource);

		} while (false);

		return result;
	}

	private processClassNameResult(className : string | undefined, filePath : string | undefined) {
		do {
			if (className === undefined) {
				break;
			}

			if (filePath === undefined) {
				break;
			}

			this.createClass(className, filePath);
		} while (false);
	}

	private createClass(className : string, filePath : string) : any {
		var classCreator = this._factory.create(className, filePath);
		classCreator.createClass();
	}
}
