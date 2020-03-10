import { UsPhoneNumberPipe } from './us-phone-number.pipe';

describe('UsPhoneNumberPipe', () => {
  it('create an instance', () => {
    const pipe = new UsPhoneNumberPipe();
    expect(pipe).toBeTruthy();
  });
});
