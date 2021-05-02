import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface Product {
  name: string;
  ingredients: string[]
}

export enum FormMode {
  CREATING = 'creating',
  UPDATING = 'updating'
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  products: Product[] = []

  ingredientOccurrences: any = []

  activeProductName: string | null = null
  FormMode = FormMode
  formMode: FormMode = FormMode.CREATING

  addProductForm: FormGroup = new FormGroup({})

  ngOnInit(): void {
    this.addProductForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      ingredients: new FormControl('', [Validators.required])
    })

    this.addProductForm.valueChanges.subscribe(() => {
      this.getIngredientOccurrences()
    })
  }

  getProductFromForm(): Product {
    return {
      name: this.addProductForm.get('name')?.value.toLowerCase(),
      ingredients: this.parseIngredients(this.addProductForm.get('ingredients')?.value.toLowerCase() || '')
    }
  }

  parseIngredients(input: string | string[]): string[] {
    return typeof input == 'string' ?
    input.split(',').map((s) => s.trim().toLowerCase()) : input
  }

  addProduct(): void {
    console.log('add product');
    const product: Product = this.getProductFromForm()
    this.products.push(product)
    this.addProductForm.reset()
  }

  updateProduct(): void {
    const product: Product = this.getProductFromForm()
    const products = [...this.products]

    const productIndex = products.findIndex((p) => p.name.toLowerCase() === product.name.toLowerCase())
    if(productIndex < 0) return console.error('Failed to update product!')
    
    products[productIndex] = product
    this.products = products
    this.setFormMode(FormMode.CREATING)
  }

  deleteProduct(): void {
    const product: Product = this.getProductFromForm()
    const products = [...this.products]

    const productIndex = products.findIndex((p) => p.name.toLowerCase() === product.name.toLowerCase())
    if(productIndex < 0) return console.error('Failed to delete product!')

    products.splice(productIndex, 1)
    this.products = products

    this.setFormMode(FormMode.CREATING)
  }

  cancelUpdate(): void {
    this.setFormMode(FormMode.CREATING)
  }

  viewProductInForm(productName: string): void {
    this.setFormMode(FormMode.UPDATING)
    const product = this.products.find((p) => p.name.toLowerCase() === productName.toLowerCase()) as Product
    this.addProductForm.patchValue({ name: product.name.toLowerCase() })
    this.addProductForm.patchValue({ ingredients: product.ingredients })
    this.activeProductName = product.name.toLowerCase()
  }

  setFormMode(mode: FormMode): void {
    if(mode === FormMode.UPDATING) {
      this.addProductForm.controls['name'].disable()
    } else {
      this.addProductForm.controls['name'].enable()
    }

    this.activeProductName = null
    this.formMode = mode
    this.addProductForm.reset()
  }

  isActiveProduct(productName: string): boolean {
    return productName === this.activeProductName
  }

  getIngredientOccurrences() {
    const x: any = []

    this.products.forEach((p) => {
      p.ingredients.forEach((i)=> {
        const existsAt = x.findIndex((j: any) => j.name.toLowerCase() === i.toLowerCase())
        if(existsAt >= 0) {
          const curr = x[existsAt]

          const updatedProductList: string[] = curr.products.includes(p.name.toLowerCase()) ? curr.products : [...curr.products, p.name.toLowerCase()]
          x[existsAt] = {
            name: curr.name.toLowerCase(),
            occurrences: curr.occurrences += 1,
            products: updatedProductList
          }
        } else {
          x.push({
            name: i.toLowerCase(),
            occurrences: 1,
            products: [p.name.toLowerCase()]
          })
        }
      })
    })

   this.ingredientOccurrences = x.sort((a: any, b: any) => b.occurrences - a.occurrences )
  }
}
