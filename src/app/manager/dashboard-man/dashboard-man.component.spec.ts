import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardManComponent } from './dashboard-man.component';

describe('DashboardManComponent', () => {
  let component: DashboardManComponent;
  let fixture: ComponentFixture<DashboardManComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardManComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardManComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
