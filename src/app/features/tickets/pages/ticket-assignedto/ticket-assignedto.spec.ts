import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketAssignedto } from './ticket-assignedto';

describe('TicketAssignedto', () => {
  let component: TicketAssignedto;
  let fixture: ComponentFixture<TicketAssignedto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketAssignedto],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketAssignedto);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
