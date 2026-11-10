import { describe, expect, it } from 'vitest'
import { cartTotals, netOfTax, products } from './domain'

describe('configurable tax and balanced sale inputs', () => {
  it('backs VAT and SD out of an inclusive price', () => {
    expect(netOfTax(3000, .15, .05)).toBeCloseTo(2484.47, 2)
  })
  it('calculates sale, tax and immutable recipe cost', () => {
    const x = cartTotals([{...products[0], quantity:2}])
    expect(x.gross).toBe(600)
    expect(x.net + x.sd + x.vat).toBeCloseTo(x.gross, 8)
    expect(x.cogs).toBe(192)
  })
})
