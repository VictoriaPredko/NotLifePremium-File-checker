import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotLifePremiumFileCheckerComponent } from './not-life-premium-file-checker.component';

describe('NotLifePremiumFileCheckerComponent', () => {
  let component: NotLifePremiumFileCheckerComponent;
  let fixture: ComponentFixture<NotLifePremiumFileCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotLifePremiumFileCheckerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotLifePremiumFileCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
