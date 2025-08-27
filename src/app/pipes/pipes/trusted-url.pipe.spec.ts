import { TrustedUrlPipe } from './trusted-url.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';

describe('TrustedUrlPipe', () => {
  let pipe: TrustedUrlPipe;
  let sanitizer: DomSanitizer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    sanitizer = TestBed.inject(DomSanitizer);
    pipe = new TrustedUrlPipe(sanitizer);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform a URL into SafeResourceUrl', () => {
    const url = 'https://example.com/video.mp4';
    const result = pipe.transform(url);
    expect(result).toBeTruthy();
  });
});
