import {App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting} from 'obsidian';

// Remember to rename these classes and interfaces!

interface PluginConfiguration {
  sourceFolder: string;
  plop: string;
}

const DEFAULT_SETTINGS: PluginConfiguration = {
  sourceFolder: 'default',
  plop: 'plop'
}

export default class PluginLast3lier extends Plugin {
  settings: PluginConfiguration;

	async onload() {
    console.log('loading plugin');
		await this.loadSettings();

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dice', 'Last3lier Plugin', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			new Notice('This is a notice!');
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

    this.addCommand({
      id: 'last3lier-show-file-lines',
      name: 'Shown for a fle N lines',
      callback: () => this.showFileLines('path/to/your/file.txt', 5),
    });

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
      id: 'open-last3lier-modal-simple',
      name: 'Open last3lier modal (simple)',
			callback: () => {
        new Last3lierModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
      id: 'last3lier-editor-command',
      name: 'Last3lier editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('Sample Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
      id: 'open-last3lier-modal-complex',
      name: 'Open last3lier modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
            new Last3lierModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new Last3lierSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {
    console.log('unloading plugin');
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

  async showFileLines(filePath: string, count:number) {
    const fileContent = await this.app.vault.read(filePath);
    const lines = fileContent.split('\n').slice(0, count);
    new Notice(`First ${count} lines of ${filePath}:\n${lines.join('\n')}`);
  }
}

class Last3lierModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const {contentEl} = this;
    const msg = 'Ici le test de la modale'
		contentEl.setText(msg);
	}

	onClose() {
		const {contentEl} = this;
		contentEl.empty();
	}
}

class Last3lierSettingTab extends PluginSettingTab {
  plugin: PluginLast3lier;

  constructor(app: App, plugin: PluginLast3lier) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

    new Setting(containerEl)
      .setName('Setting #1')
      .setDesc('It\'s a secret')
      .addText(text => text
        .setPlaceholder('Enter your secret')
        .setValue(this.plugin.settings.sourceFolder)
        .onChange(async (value) => {
          this.plugin.settings.sourceFolder = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Plop #1')
      .setDesc('It\'s a plop')
      .addText(text => text
        .setPlaceholder('Enter your plop')
        .setValue(this.plugin.settings.plop)
        .onChange(async (value) => {
          this.plugin.settings.sourceFolder = value;
          await this.plugin.saveSettings();
        }));
	}
}
