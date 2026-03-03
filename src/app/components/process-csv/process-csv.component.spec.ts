import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessCsv } from './process-csv.component';

describe('ProcessCsv', () => {
  let component: ProcessCsv;
  let fixture: ComponentFixture<ProcessCsv>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessCsv],
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessCsv);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
