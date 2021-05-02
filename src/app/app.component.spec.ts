import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  describe('parseIngredients', () => {
    it('should return an array of ingredients given a string', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;
      const input = "i1, i2, i3,i4,  i5"
      const expectedOutput = ['i1', 'i2', 'i3', 'i4', 'i5']
      const output = app.parseIngredients(input)
      expect(output).toEqual(expectedOutput)
    })
  })

  describe('getIngredientOccurrences', () => {
    it('should return all ingredients and their occurrences', () => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.componentInstance;

      const testProducts = [
        {
          name: 'product 1',
          ingredients: ['i1', 'i2', 'i3', 'i4']
        },
        {
          name: 'product 2',
          ingredients: ['i5']
        },
        {
          name: 'product 3',
          ingredients: ['i1', 'i3', 'i4']
        },
        {
          name: 'product 4',
          ingredients: ['i1']
        },
      ]

      const expectedIngredientOccurrences = [
        { name: 'i1', occurrences: 3, products: ['product 1', 'product 3', 'product 4'] },
        { name: 'i2', occurrences: 1, products: ['product 1'] },
        { name: 'i3', occurrences: 2, products: ['product 1', 'product 3'] },
        { name: 'i4', occurrences: 2, products: ['product 1', 'product 3'] },
        { name: 'i5', occurrences: 1, products: ['product 2'] },
      ]

      app.products = testProducts
      const result = app.getIngredientOccurrences()
      expect(app.ingredientOccurrences).toEqual(expectedIngredientOccurrences)
    })
  })
});
