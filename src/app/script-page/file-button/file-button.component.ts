import {Component, Input, OnInit} from '@angular/core';
import {IButtonController, ButtonControllerFactory, ButtonType} from './button-controller-factory.service';

/**
 * Button component for different controllers
 */
@Component({
  selector: 'app-file-button',
  templateUrl: './file-button.component.html',
  styleUrls: ['./file-button.component.css']
})
export class FileButtonComponent implements OnInit {
  controller: IButtonController;
  @Input() type: ButtonType;

  constructor(
    private controllerFactory: ButtonControllerFactory
  ) {
  }

  ngOnInit(): void {
    this.controller = this.controllerFactory.getController(this.type);
  }
}
