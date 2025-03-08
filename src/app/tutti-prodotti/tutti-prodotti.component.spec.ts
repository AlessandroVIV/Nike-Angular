import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TuttiProdottiComponent } from './tutti-prodotti.component';

describe('TuttiProdottiComponent', () => {
  let component: TuttiProdottiComponent;
  let fixture: ComponentFixture<TuttiProdottiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TuttiProdottiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TuttiProdottiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
