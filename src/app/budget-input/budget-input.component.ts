import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';

import { ExpenseService } from '../services/expense.service';
import { Budget } from '../budget-input/budget.model';
import { UserService } from '../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-budget-input',
  templateUrl: './budget-input.component.html',
  styleUrls: ['./budget-input.component.css']
})
export class BudgetInputComponent implements OnInit {

  value;
  period;
  message: any = null;
  userSub: Subscription;
  hasValue = false;

  constructor( private expenseService: ExpenseService, private userService: UserService ) {
    this.expenseService.budgetUpdated.subscribe( () => {
      if (this.expenseService.getBudget() != null) {
        this.hasValue = true; // set for form (update or add new)
      }
      this.value = this.expenseService.getBudgetValue();
      this.period = this.expenseService.getBudgetPeriod();
    });

  }

  ngOnInit() {
    // tslint:disable-next-line:prefer-const
    this.message = this.expenseService.getBudgetNotify();
    if (this.expenseService.getBudget() != null) {
      this.hasValue = true; // set for form (update or add new)
    }
    this.value = this.expenseService.getBudgetValue();
    this.period = this.expenseService.getBudgetPeriod();
  }

  onAddBudget(form: NgForm) {
    // const id = ((new Date().getMonth() + 1).toString()) + ((new Date().getDate()).toString()) + form.value.period + this.userId;
    if (form.invalid) {
      return;
    }
    const budget: Budget = { amount: form.value.amount, period: form.value.period, date: new Date()};
    this.message = this.expenseService.getBudgetValue();
    this.expenseService.budgetInput.next(this.expenseService.hasBudget());

    this.expenseService.addBudget(budget);
  }

  onUpdateBudget(form: NgForm) {
    const budget: Budget = { amount: form.value.amount, period: form.value.period, date: new Date()};
    this.message = this.expenseService.getBudgetValue();
    this.expenseService.budgetInput.next(this.expenseService.hasBudget());

    this.expenseService.updateBudget(budget, this.expenseService.getBudgetId() );
  }
}
