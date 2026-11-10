# Client UAT — test build

Use Chrome, Edge, or Firefox at 1280×800 and one mobile viewport. Reset browser data if a clean deterministic state is needed.

| ID | Scenario | Expected result | Status |
|---|---|---|---|
| UAT-01 | Add two different menu items and change quantity | Cart totals update; duplicates become quantity, not duplicate product lines | Ready |
| UAT-02 | Pay for a VAT+SD item | Posting preview shows gross = net + VAT + SD | Ready |
| UAT-03 | Post sale | Success state appears; MTD sales/order metrics increase; cart clears | Ready |
| UAT-04 | Turn browser offline and post a sale | Header says Offline and confirmation says queued for sync | Ready (simulation) |
| UAT-05 | Approve and reject separate requests | Status persists after refresh; pending count decreases | Ready |
| UAT-06 | Inspect stock by batch | Critical, near-expiry, and healthy batches are distinguishable | Ready |
| UAT-07 | Inspect procurement budget | Ordered, remaining, and percentage agree arithmetically | Ready |
| UAT-08 | Inspect finance journals | Debit equals credit for every displayed journal group | Ready |
| UAT-09 | Use keyboard to navigate primary controls | Visible focus, operable buttons, no keyboard trap | Ready |
| UAT-10 | Use mobile viewport | Sidebar becomes drawer; POS banner moves below the order | Ready |
| UAT-11 | Enable reduced motion | Non-essential animation and transitions stop | Ready |
| UAT-12 | Attempt API cross-outlet access | Server rejects out-of-scope records | Not implemented |
| UAT-13 | Retry same synced sale twice | One server posting only | Not implemented |
| UAT-14 | Simultaneously approve on web/mobile | Exactly one decision succeeds | Not implemented |
| UAT-15 | Clean-machine Compose bootstrap and restore | Services start; seed and backup restore are reproducible | Not verified on this machine |
