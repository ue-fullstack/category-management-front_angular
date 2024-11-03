import { ComponentFixture, TestBed } from '@angular/core/testing';

import { error404Component } from './404.component';

describe('404Component', () => {
  let component: error404Component;
  let fixture: ComponentFixture<error404Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [error404Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(error404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
