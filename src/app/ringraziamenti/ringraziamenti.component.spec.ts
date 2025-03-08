import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RingraziamentiComponent } from './ringraziamenti.component';

describe('RingraziamentiComponent', () => {
  let component: RingraziamentiComponent;
  let fixture: ComponentFixture<RingraziamentiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RingraziamentiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RingraziamentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
