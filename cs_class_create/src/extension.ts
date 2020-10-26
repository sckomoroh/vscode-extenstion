import * as vscode from 'vscode';

import { CreateHandler } from './CreateHandler';

export function activate(context: vscode.ExtensionContext) {
	var handler : CreateHandler;

	console.log('Congratulations, your extension "cs-class-create" is now active!');

	let csCreateClassDisposable = vscode.commands.registerCommand(
		'extension.cs_create_class',
		(fileUri) => {
			handler = new CreateHandler();
			handler.create(fileUri);
		});
	
	context.subscriptions.push(csCreateClassDisposable);
}

export function deactivate() {}
