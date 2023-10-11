import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import create from "typograms/src/typograms.js";
// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	Zoom: string;

}

const DEFAULT_SETTINGS: MyPluginSettings = {
	Zoom: '0.3'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		await this.loadSettings();

		this.registerMarkdownCodeBlockProcessor("typograms", (source, el, ctx) => {
			const svg = create("\n" + source + "\n", Number(this.settings.Zoom), false);
			el.addClass("google-typogram")
			el.appendChild(svg)
		});

		this.registerMarkdownCodeBlockProcessor("typogram", (source, el, ctx) => {
			const svg = create("\n" + source + "\n", Number(this.settings.Zoom), false);
			el.addClass("google-typogram")
			el.appendChild(svg)
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));

	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}


class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Zoom')
			.setDesc('Typogram Zoom')
			.addText(text => text
				.setPlaceholder('Zoom')
				.setValue(this.plugin.settings.Zoom)
				.onChange(async (value) => {
					this.plugin.settings.Zoom = value;
					await this.plugin.saveSettings();
				}));
	}
}
