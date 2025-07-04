import { vi, describe, it, expect } from 'vitest';
import CTAButton from '../src/components/CTAButton';

describe('CTAButton Component', () => {
  it('should open the referral link in a new tab', () => {
    const button = CTAButton();
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    button.openReferralLink();
    expect(windowOpenSpy).toHaveBeenCalledWith(button.referralUrl, '_blank');
    windowOpenSpy.mockRestore();
  });
});