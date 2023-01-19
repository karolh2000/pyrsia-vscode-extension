// https://github.com/xojs/eslint-config-xo-typescript/issues/43
/* eslint-disable @typescript-eslint/naming-convention */
import * as vscode from 'vscode';
import { Integration, IntegrationTreeItem, Event } from '../integrations/api/Integration'; // NOI18

export class IntegrationsView {
	private static readonly refreshIntegrationModelCommandId: string = "pyrsia.integrations.model.update"; // NOI18
	private static readonly refreshIntegrationViewCommandId: string = "pyrsia.integrations.view.update"; // NOI18
	private static readonly refreshIntegrationCommandId: string = "pyrsia.integrations.update"; // NOI18
	private static readonly viewType: string = "pyrsia.node-integrations"; // NOI18
	
	private readonly treeViewProvider: NodeIntegrationsTreeProvider;
	private readonly _view?: vscode.TreeView<string>;

	constructor(context: vscode.ExtensionContext) {

		this.treeViewProvider = new NodeIntegrationsTreeProvider();

		this._view = vscode.window.createTreeView(
			IntegrationsView.viewType,
			{ showCollapseAll: true, treeDataProvider: this.treeViewProvider }
		);

		this.treeViewProvider.update();

		vscode.commands.registerCommand(IntegrationsView.refreshIntegrationModelCommandId, () => {
			this.treeViewProvider.update();
		});

		vscode.commands.registerCommand(IntegrationsView.refreshIntegrationViewCommandId, () => {
			this.treeViewProvider.refreshTreeView();
		});

		vscode.commands.registerCommand(IntegrationsView.refreshIntegrationCommandId, () => {
			this.treeViewProvider.update();
			this.treeViewProvider.refreshTreeView();
		});

		this._view.onDidChangeVisibility(() => {
			this.treeViewProvider.update();
		});

		this._view.onDidChangeSelection(() => {
			this.treeViewProvider.update();
		});

		context.subscriptions.push(this._view);
	}

	static requestIntegrationsModelUpdate(): void {
		vscode.commands.executeCommand(this.refreshIntegrationModelCommandId);
	}

	static requestIntegrationsViewUpdate(): void {
		vscode.commands.executeCommand(this.refreshIntegrationViewCommandId);
	}

	static requestIntegrationsUpdate(): void {
		vscode.commands.executeCommand(this.refreshIntegrationCommandId);
	}

	addIntegration(integration: Integration): void {
		this.treeViewProvider.addIntegration(integration);
	}

	async update(): Promise<void> {
		if (this.treeViewProvider) {
			await this.treeViewProvider.update();
		}
	}
}

class NodeIntegrationsTreeProvider implements vscode.TreeDataProvider<string> {
	// on change tree data
	private _onDidChangeTreeData: vscode.EventEmitter<string | undefined | null | void> =
		new vscode.EventEmitter<string | undefined | null | void>();
	// eslint-disable-next-line @typescript-eslint/member-ordering
	readonly onDidChangeTreeData: vscode.Event<string | undefined | null | void> = this._onDidChangeTreeData.event;

	// on visibility change
	// private _onDidChangeVisibility: vscode.EventEmitter<string | undefined | null | void> = new vscode.EventEmitter<string | undefined | null | void>();
	// readonly onDidChangeVisibility: vscode.Event<string | undefined | null | void> = this._onDidChangeVisibility.event;

	private readonly integrations: Set<Integration> = new Set<Integration>();

	addIntegration(integration: Integration): void {
		this.integrations.add(integration);
	}

	getTreeItem(id: string): vscode.TreeItem | Thenable<vscode.TreeItem> {
		let treeItem: IntegrationTreeItem | undefined;

		for (const integration of this.integrations.values()) {
			treeItem = integration.getTreeItem(id);
		}

		if (!treeItem) {
			throw new Error(`Tree item ${id} doesn't exist.`);
		}

		return treeItem;
	}

	getChildren(parentId?: string | undefined): vscode.ProviderResult<string[]> {
		console.log(parentId);
		let children: string[] = [];
		for (const integration of this.integrations) {
			children = children.concat(integration.getTreeItemChildren(parentId));
		}

		return children;
	}

	update(): void {
		for (const integration of this.integrations) {
			integration.update(Event.IntegrationModelUpdate);
		}
	}

	resolveTreeItem?(
		item: vscode.TreeItem,
		element: string,
		token: vscode.CancellationToken
	): vscode.ProviderResult<vscode.TreeItem> {
		console.log(element);
		console.log(token);
		return item;
	}

	refreshTreeView(): void {
		this._onDidChangeTreeData.fire(undefined);
	}
}
