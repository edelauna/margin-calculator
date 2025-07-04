import { describe, it, expect, vi } from 'vitest';
import { fetchPrimeRate } from '../src/utils/bankApi';


describe('fetchPrimeRate', () => {
  it('should fetch and return the prime rate from Bank of Canada API', async () => {
    globalThis.fetch = vi.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        observations: [{ V80691311: { v: "4.95" } }]
      })
    })) as any;

    const rate = await fetchPrimeRate();
    expect(rate).toBeCloseTo(4.95);
  });
});