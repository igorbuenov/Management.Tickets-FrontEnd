import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsByUserid } from './tickets-by-userid';

describe('TicketsByUserid', () => {
  let component: TicketsByUserid;
  let fixture: ComponentFixture<TicketsByUserid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsByUserid],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketsByUserid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
