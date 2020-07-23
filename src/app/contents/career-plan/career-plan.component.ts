import { Component, OnInit } from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'app-career-plan',
  templateUrl: './career-plan.component.html',
  styleUrls: ['./career-plan.component.styl']
})
export class CareerPlanComponent implements OnInit {

  na = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]

  selection = new SelectionModel<number>(true, []);

  constructor() { }

  ngOnInit(): void {
  }

}
