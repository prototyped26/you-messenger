import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePage } from './liste.page';

describe('ListePage', () => {
  let component: ListePage;
  let fixture: ComponentFixture<ListePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
