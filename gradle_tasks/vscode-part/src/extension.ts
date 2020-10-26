import * as vscode from 'vscode';

import { GradleTaskView } from './gradleTaskView';

export function activate(context: vscode.ExtensionContext) {
	var extension = vscode.extensions.getExtension("selfproduction.gradle-tasks");
	if (extension !== undefined) {
		var myExtDir = extension.extensionPath;
		console.log(myExtDir);
	}

	const treeView = new GradleTaskView(context);
	vscode.commands.registerCommand('gradleTaskView.refreshTasks', () => treeView.getTasks());
}

export function deactivate() {}

/*

var fs = require("fs");
var java = require("java");

var baseDir = "./dependencies";
var dependencies = fs.readdirSync(baseDir);
dependencies.forEach(function(dependency) {
    console.log(baseDir + "/" + dependency);
    java.classpath.push(baseDir + "/" + dependency);
})

var listener = java.newProxy("com.gradle.tool.IStreamListener", {
    onLineReceived : (line? : string) => {
        console.log(line);
    }
}); 

var listener2 = java.newProxy("com.gradle.tool.IStreamListener",  cc); 

var wrapper = java.newInstanceSync("com.gradle.tool.GradleWrapper", "/home/sckomoroh/Documents/src/repo/nrvc_test_app/test-multi");

var res2 = wrapper.executeTask("tasks", listener, (obj) => {
    var a = 0;
});

*/
