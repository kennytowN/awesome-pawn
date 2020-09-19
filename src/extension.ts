import * as vscode from 'vscode';

const regularExpressions:any[] = [
	{
		validators: ['/(\W|^)return true;{0}(\W|$)/ig', '/(\W|^)return 1;{0}(\W|$)/ig]'],
		error: 'It is necessary to unify all returns, using true / false or 1/0, respectively.'
	},

	{
		validators: ['[a-z]{2}[(]{1}[a-z]{1,} = [a-z]{1,}[)]{1}'],
		error: 'An assignment operator was encountered when a comparison operator is explicitly needed.'
	}
];

export function activate(context: vscode.ExtensionContext) {
	const editor:vscode.TextEditor | undefined = vscode.window.activeTextEditor;

	if (!editor) {
		return; // No open text editor
	}

	const text:string = editor.document.getText();
	let result:any;

	regularExpressions.forEach(expression => {
		const regExpFirst = new RegExp(expression.validators[0], "ig");

		if(expression.validators[1] !== undefined) {
			const regExpSecond = new RegExp(expression.validators[1], "ig");

			if(regExpFirst.test(text) === regExpSecond.test(text)) {
				vscode.window.showInformationMessage(expression['error']);
			}
		} else if(result = regExpFirst.exec(text)) {
			vscode.window.showInformationMessage(expression['error']);
			var startPos = editor.document.positionAt(result.index);
			var endPos = editor.document.positionAt(result.index + result[0].length);
			var range = new vscode.Range(startPos, endPos);
			
			vscode.window.showInformationMessage("Range: " + range);
		}
	});
}

export function deactivate() {}