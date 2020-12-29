import {Component, OnInit} from '@angular/core';
import {CodeModel} from '@ngstack/code-editor';
import {FileApiService} from '../services/file-api.service';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit {
  theme = 'vs-dark';

  readonly codeModel: CodeModel = {
    language: 'javascript',
    uri: 'editor.js',
    value: '',
  };

  options: object = {};

  constructor(
    private fileApi: FileApiService,
  ) {
  }

  ngOnInit(): void {
    this.fileApi.GetCurrentContentsObservable().subscribe(
      (contents: string): void => {
        this.codeModel.value = contents;
      });
  }

  valueChanged(event: string): void {
    console.log(event);
  }
}
