import * as vscode from 'vscode';

import {Serialize, SerializeProperty, Serializable} from 'ts-serializer';

export class GradleTaskView {
	private readonly _terminal = vscode.window.createOutputChannel("Gradle");
	private readonly _provider : TasksDataProvider = new TasksDataProvider();
	private readonly _jarPath : string | null = null;

	constructor(context: vscode.ExtensionContext) {
		var extension = vscode.extensions.getExtension("selfproduction.gradle-tasks");
		if (extension != undefined) {
			var extensionDir = extension.extensionPath;
			this._jarPath = extensionDir + "/gradle-conn-test.main.jar";
		} else {
			console.log("Cannot to obtain the extension path");
			return;
		}

		vscode.window.createTreeView('gradleTaskView', { treeDataProvider: this._provider });
		vscode.commands.registerCommand('gradleTaskView.runTask', (cmdName) => this.runTask(cmdName));

		this.getTasks();
	}

	runTask(cmdName : TaskItem) : any {
		if (vscode.workspace.workspaceFolders == undefined) {
			return;
		}
	
		const cp = require('child_process')
		let cwd = vscode.workspace.workspaceFolders[0].uri.fsPath;
		let cmd = 'java -jar ' + this._jarPath + ' ' + cwd + ' ' + cmdName.folder + ":" + cmdName.name;
		let callback = (err : boolean, stdout : string, stderr : string) => {
			this._terminal.show();
			this._terminal.append(stdout);
			if (err) {
				this._terminal.append(stderr);
				console.log(stderr);
	
				let msg = "Task '" + cmdName + "' failed";
				vscode.window.showErrorMessage(msg);
			} else {
				let msg = "Task '" + cmdName + "' completed";
				vscode.window.showInformationMessage(msg);
			}
		};
	
		// TODO:

		cp.exec(cmd, callback);
	}
	
	getTasks() {
		if(vscode.workspace.workspaceFolders == undefined) {
			return;
		}
	
		const cp = require('child_process')
		let cwd = vscode.workspace.workspaceFolders[0].uri.fsPath;
		let callback = (err : boolean, stdout : string, stderr : string) => {
			if (err) {
				console.log('stderr: ' + stderr);
			}
	
			let projects = this.parseTasks(stdout);
			this._provider.projects = projects;

			this._provider.refresh();
		};
	
		var cmd = "java -jar " + this._jarPath + " " + cwd + " __VSC_ENUM_TASKS__";
		cp.exec(cmd, callback);
	}

	parseTasks(output : string) : GradleProjectArray | null {
		let marker = "GRADLE-WRAPPER-RESULT:";
		let index = output.indexOf(marker);

		if (index != -1) {
			let json = "{ \"projects\": " + output.substr(index + marker.length + 1) + " }";
			let obj = JSON.parse(json);
			
			let projects = new GradleProjectArray();
			projects.deserialize(obj);

			return projects;
		}

		return null;
	}
}

@Serialize({})
export class GradleProject extends Serializable {
	@SerializeProperty({
        map: 'name'
    })
	public projectName : string  = "";

	@SerializeProperty({
        map: 'folder'
    })
	public projectFolder : string = "";

	@SerializeProperty({
		map: 'tasks',
		list : true
    })
	public projectTasks : string[] = [];
}

@Serialize({})
export class GradleProjectArray extends Serializable {
	@SerializeProperty({
		list: true,
		type:  GradleProject
    })
	public projects : GradleProject[] = [];
}


export class TaskItem {
	private _isProject : boolean;
	private _name : string;
	private _folder : string | null = null;
	private _tasks : TaskItem[] = [];

	constructor(isProject : boolean, name : string, folder : string | null) {
		this._isProject = isProject;
		this._name = name;
		this._folder = folder;
	}

	get isProject() : boolean {
		return this._isProject;
	}

	get name() : string {
		return this._name;
	}

	get folder() : string | null {
		return this._folder;
	}

	get tasks() : TaskItem[] {
		return this._tasks;
	}

	set tasks(value : TaskItem[]) {
		this._tasks = value;
	}
}

export class ProjectTreeItem extends vscode.TreeItem {
	constructor(public readonly label: string) {
		super(label, vscode.TreeItemCollapsibleState.Collapsed);
	}

	contextValue = 'gradleProject';
}

export class TaskTreeItem extends vscode.TreeItem {
	constructor(public readonly label: string) {
		super(label, vscode.TreeItemCollapsibleState.None);
	}

	contextValue = 'gradleTask';
}

export class TasksDataProvider implements vscode.TreeDataProvider<TaskItem> {
	private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
	private _gradleProjectArray : GradleProjectArray | null = null;

	readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

	get projects() : GradleProjectArray | null{
		return this._gradleProjectArray;
	}

	set projects(value : GradleProjectArray | null) {
		this._gradleProjectArray = value;
	}

	public refresh() : any {
		this._onDidChangeTreeData.fire();
	}

	public getChildren(element: TaskItem) : TaskItem[] | undefined {
		if (this._gradleProjectArray == null) {
			return undefined;
		}

		let tasks : TaskItem[] = [];
		if (element == undefined) {
			// Root 
			this._gradleProjectArray.projects.forEach((item : GradleProject) => {
				let taskItem = new TaskItem(true, item.projectName, item.projectFolder)
				tasks.push(taskItem);
			});
		} else {
			const project = this._gradleProjectArray.projects.find((item) => {
				return item.projectName == element.name;
			});

			if (project != undefined) {
				project.projectTasks.forEach((item) => {
					tasks.push(new TaskItem(false, item, project.projectFolder));
				});
			}
		}
		
		return tasks;
	}

	public getTreeItem(element: TaskItem) : vscode.TreeItem {
		return element.isProject
			? new ProjectTreeItem(element.name)
			: new TaskTreeItem(element.name);
	}
}
