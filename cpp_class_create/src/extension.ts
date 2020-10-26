import * as vscode from 'vscode';

import { IClassBuilderFactory } from "./IClassBuilderFactory";
import { CppClassBuilderFactory } from "./CppClassBuilderFactory";
import { CppInlineClassBuilderFactory } from "./CppInlineClassBuilderFactory";
import { CppTestClassBuilderFactory } from './CppTestClassBuilderFactory';
import { CreateHandler } from './CreateHandler';

export function activate(context: vscode.ExtensionContext) {
	var handler : CreateHandler;
	var factory : IClassBuilderFactory;

	let cppDisposable = vscode.commands.registerCommand(
		'extension.cpp_create_class',
		(fileUri) => {
			factory = new CppClassBuilderFactory();
			handler = new CreateHandler(factory);
			handler.create(fileUri);
		});

	let cppInlineDisposable = vscode.commands.registerCommand(
		'extension.cpp_inline_create_class',
		(fileUri) => {
			factory = new CppInlineClassBuilderFactory();
			handler = new CreateHandler(factory);
			handler.create(fileUri);
		});
	
	let cppTestDisposable = vscode.commands.registerCommand(
		'extension.cpp_test_create_class',
		(fileUri) => {
			factory = new CppTestClassBuilderFactory();
			handler = new CreateHandler(factory);
			handler.create(fileUri);
		});
	
	context.subscriptions.push(cppDisposable);
	context.subscriptions.push(cppInlineDisposable);
	context.subscriptions.push(cppTestDisposable);
}

export function deactivate() {}
