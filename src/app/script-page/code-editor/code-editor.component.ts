import {AfterViewInit, Component} from '@angular/core';
import {editor} from 'monaco-editor';
import IStandaloneEditorConstructionOptions = editor.IStandaloneEditorConstructionOptions;
import {LocalFileCacheService} from '../services/local-file-cache.service';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements AfterViewInit {
  private readonly constructorOptions: IStandaloneEditorConstructionOptions = {
    theme: 'vs-dark',
    language: 'typescript',
    value: '',
    automaticLayout: true,
  };

  private editorElement: HTMLElement;

  private readonly scriptHeader = `
    declare var bot: any;
  `;

  constructor(
    private localFileCache: LocalFileCacheService,
  ) {
    this.localFileCache.GetTabChangedObservable().subscribe(
      (): void => {
        this.changeValue();
      });
  }

  ngAfterViewInit(): void {
    this.editorElement = document.getElementById('editor-container');

    this.editorElement.addEventListener('editorLoaded', () => {
      this.onEditorLoaded();
    });

    this.editorElement.addEventListener('textChanged', (e: CustomEvent) => {
      this.onTextChanged(e.detail);
    });

    const loaderScript = document.createElement('script');
    loaderScript.type = 'text/javascript';
    loaderScript.src = './assets/monaco/vs/loader.js';
    loaderScript.addEventListener('load', () => {
      this.initMonaco();
    });
    document.head.appendChild(loaderScript);
  }

  private onEditorLoaded(): void {
    this.changeValue();
  }

  private onTextChanged(newText: string): void {
    this.localFileCache.updateContents(newText);
  }

  private initMonaco(): void {
    const initScript = document.createElement('script');
    initScript.type = 'text/javascript';
    initScript.innerText =
      `require.config({
        paths: {
          'vs': './assets/monaco/vs',
        },
      });
      require(['vs/editor/editor.main'], function() {
        let elem = document.getElementById('editor-container');
        monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
          allowNonTsExtensions: true
        });
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          '${this.scriptHeader}',
        );

        let editor = monaco.editor.create(
          document.getElementById('editor-container'),
          ${JSON.stringify(this.constructorOptions)}
        );

        editor.getModel().onDidChangeContent(() => {
          elem.dispatchEvent(new CustomEvent('textChanged', {
            detail: editor.getModel().getValue()
          }));
        });

        elem.addEventListener(
          'onFileChange',
          function(e) {
            editor.setValue(e.detail);
          },
          false,
        );
        elem.dispatchEvent(new Event('editorLoaded'));
      });`.replace(/\s+/g, ' ');
    document.head.appendChild(initScript);

    // this.editorInstance = monaco.editor.create(
    //   document.getElementById('editor-container'),
    //   this.constructorOptions,
    // );
  }

  private changeValue(): void {
    if (this.editorElement) {
      this.editorElement.dispatchEvent(new CustomEvent('onFileChange', {
        detail: this.localFileCache.getCurrentContents()
      }));
    }
  }
}
