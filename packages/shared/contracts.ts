export type Money = { amount: string; currency: 'BDT' }
export type DocumentStatus = 'draft'|'submitted'|'approved'|'rejected'|'posted'|'reversed'
export type ApprovalDecision = { approvalId: string; version: number; decision: 'approve'|'reject'|'return'; comment: string; deviceId: string }
export type JournalLine = { accountId: string; debit: Money; credit: Money; outletId: string; costCentreId: string }
export type SyncEnvelope<T> = { idempotencyKey: string; deviceId: string; occurredAt: string; payload: T }
