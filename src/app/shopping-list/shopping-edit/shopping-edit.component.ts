import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit {

  addItemForm: FormGroup;
  subscription: Subscription;
  editedItemIndex: number;
  editMode: boolean =  false;
  editedItem: Ingredient;

  constructor(private slService: ShoppingListService) { }

  ngOnInit() {
    this.addItemForm = new FormGroup({
      'name': new FormControl(null, [Validators.required]),
      'amount': new FormControl(null, [Validators.required, Validators.pattern("^[1-9]+[0-9]*$")])
    })

    this.subscription = this.slService.startedEditing
      .subscribe((index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.slService.getIngredient(index);
        this.addItemForm.setValue({
          'name': this.editedItem.name,
          'amount': this.editedItem.amount
        })
      })
  }

  onSubmit() {
    console.log(this.addItemForm);
    const value = this.addItemForm.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if(this.editMode){
      this.slService.updateIngredient(this.editedItemIndex, newIngredient);
    }
    else {
      this.slService.addIngredient(newIngredient);
    }
    this.addItemForm.reset();
    this.editMode = false;
  }
  
  onClear() {
    this.addItemForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.slService.deleteIngredient(this.editedItemIndex);
    this.onClear();    
  }

}
