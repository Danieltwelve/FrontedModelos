import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivevideoComponent } from './livevideo.component';

describe('LivevideoComponent', () => {
  let component: LivevideoComponent;
  let fixture: ComponentFixture<LivevideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivevideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivevideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
