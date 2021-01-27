import {AfterViewInit, Component} from '@angular/core';
import {editor} from 'monaco-editor';
import {LocalFileCacheService} from '../services/local-file-cache.service';
import IStandaloneEditorConstructionOptions = editor.IStandaloneEditorConstructionOptions;

/**
 * Code editor component, based on Monaco Editor by Microsoft
 * https://microsoft.github.io/monaco-editor/
 */
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

  /**
   * Editor is inserted into this HTML element
   * @private
   */
  private editorElement: HTMLElement;

  /**
   * This typescript code is included into code model on editor creation
   * @private
   */
  private readonly scriptHeader = `
    declare var bot: any;
  `;

  constructor(
    private localFileCache: LocalFileCacheService,
  ) {
    // On tab change, also change editor contents
    this.localFileCache.getTabChanged().subscribe(
      (): void => {
        this.changeValue();
      });
  }

  ngAfterViewInit(): void {
    this.editorElement = document.getElementById('editor-container');
    this.subscribeToEvents();
    this.insertLoader();
  }

  /**
   * Subscribe to events to transfer data between editor HTML element and the component
   * @private
   */
  private subscribeToEvents(): void {
    this.editorElement.addEventListener('editorLoaded', () => {
      this.onEditorLoaded();
    });

    this.editorElement.addEventListener('textChanged', (e: CustomEvent) => {
      this.onTextChanged(e.detail);
    });
  }

  /**
   * Insert script 'loader.js' into the page, that loads all code editor libraries
   * @private
   */
  private insertLoader(): void {
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

  /**
   * Create an instance of Monaco Code Editor.
   * ARM version is used here, and is loaded by inserting a pure js script into the page.
   * As a consequence, there is no reference to the editor instance in the component code,
   * and all data exchange is performed through events.
   * Using ESM version would be more optimal, but I could not get it to work properly.
   * @private
   */
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

  /**
   * Change text inside the editor
   * @private
   */
  private changeValue(): void {
    if (this.editorElement) {
      this.editorElement.dispatchEvent(new CustomEvent('onFileChange', {
        detail: this.localFileCache.getCurrentContents()
      }));
    }
  }
}
