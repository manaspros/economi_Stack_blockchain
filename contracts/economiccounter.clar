;; Economic Counter - Level 5
;; Pay STX to increment counter with escalating costs
;; Earn rewards for reaching milestones
;; Counter marketplace for buying/selling counter values

;; Constants
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_NOT_AUTHORIZED u100)
(define-constant ERR_INSUFFICIENT_FUNDS u101)
(define-constant ERR_COUNTER_NOT_EXISTS u102)
(define-constant ERR_COUNTER_NOT_FOR_SALE u103)
(define-constant ERR_INVALID_PRICE u104)
(define-constant ERR_CANNOT_BUY_OWN_COUNTER u105)

;; Base cost for first increment (1 STX = 1,000,000 microSTX)
(define-constant BASE_INCREMENT_COST u1000000)

;; Milestone rewards
(define-constant MILESTONE_10_REWARD u500000)
(define-constant MILESTONE_50_REWARD u2500000)
(define-constant MILESTONE_100_REWARD u10000000)
(define-constant MILESTONE_500_REWARD u75000000)
(define-constant MILESTONE_1000_REWARD u200000000)

;; Data variables
(define-data-var next-counter-id uint u1)
(define-data-var contract-balance uint u0)

;; Data maps
(define-map counters 
  { counter-id: uint }
  { 
    owner: principal,
    value: uint,
    total-spent: uint,
    milestone-rewards-claimed: (list 5 uint),
    for-sale: bool,
    sale-price: uint
  }
)

(define-map user-counters
  { user: principal }
  { counter-ids: (list 100 uint) }
)

;; Public functions

;; Create a new counter for the caller
(define-public (create-counter)
  (let 
    (
      (counter-id (var-get next-counter-id))
      (caller tx-sender)
    )
    (map-set counters 
      { counter-id: counter-id }
      {
        owner: caller,
        value: u0,
        total-spent: u0,
        milestone-rewards-claimed: (list),
        for-sale: false,
        sale-price: u0
      }
    )
    (map-set user-counters
      { user: caller }
      { counter-ids: (unwrap-panic (as-max-len? (append (get counter-ids (default-to { counter-ids: (list) } (map-get? user-counters { user: caller }))) counter-id) u100)) }
    )
    (var-set next-counter-id (+ counter-id u1))
    (ok counter-id)
  )
)

;; Increment a counter by paying STX (cost increases exponentially)
(define-public (increment-counter (counter-id uint))
  (let 
    (
      (counter-data (unwrap! (map-get? counters { counter-id: counter-id }) (err ERR_COUNTER_NOT_EXISTS)))
      (caller tx-sender)
      (current-value (get value counter-data))
      (increment-cost (calculate-increment-cost current-value))
    )
    (asserts! (is-eq caller (get owner counter-data)) (err ERR_NOT_AUTHORIZED))
    
    ;; Transfer STX to contract
    (try! (stx-transfer? increment-cost caller (as-contract tx-sender)))
    
    ;; Update counter
    (map-set counters 
      { counter-id: counter-id }
      (merge counter-data {
        value: (+ current-value u1),
        total-spent: (+ (get total-spent counter-data) increment-cost)
      })
    )
    
    ;; Update contract balance
    (var-set contract-balance (+ (var-get contract-balance) increment-cost))
    
    ;; Check and award milestone rewards
    (try! (check-and-award-milestone counter-id (+ current-value u1)))
    
    (ok (+ current-value u1))
  )
)

;; List counter for sale
(define-public (list-counter-for-sale (counter-id uint) (price uint))
  (let 
    (
      (counter-data (unwrap! (map-get? counters { counter-id: counter-id }) (err ERR_COUNTER_NOT_EXISTS)))
      (caller tx-sender)
    )
    (asserts! (is-eq caller (get owner counter-data)) (err ERR_NOT_AUTHORIZED))
    (asserts! (> price u0) (err ERR_INVALID_PRICE))
    
    (map-set counters 
      { counter-id: counter-id }
      (merge counter-data {
        for-sale: true,
        sale-price: price
      })
    )
    (ok true)
  )
)

;; Remove counter from sale
(define-public (unlist-counter (counter-id uint))
  (let 
    (
      (counter-data (unwrap! (map-get? counters { counter-id: counter-id }) (err ERR_COUNTER_NOT_EXISTS)))
      (caller tx-sender)
    )
    (asserts! (is-eq caller (get owner counter-data)) (err ERR_NOT_AUTHORIZED))
    
    (map-set counters 
      { counter-id: counter-id }
      (merge counter-data {
        for-sale: false,
        sale-price: u0
      })
    )
    (ok true)
  )
)

;; Buy a counter from marketplace
(define-public (buy-counter (counter-id uint))
  (let 
    (
      (counter-data (unwrap! (map-get? counters { counter-id: counter-id }) (err ERR_COUNTER_NOT_EXISTS)))
      (caller tx-sender)
      (current-owner (get owner counter-data))
      (sale-price (get sale-price counter-data))
    )
    (asserts! (get for-sale counter-data) (err ERR_COUNTER_NOT_FOR_SALE))
    (asserts! (not (is-eq caller current-owner)) (err ERR_CANNOT_BUY_OWN_COUNTER))
    
    ;; Transfer STX to current owner
    (try! (stx-transfer? sale-price caller current-owner))
    
    ;; Update counter ownership
    (map-set counters 
      { counter-id: counter-id }
      (merge counter-data {
        owner: caller,
        for-sale: false,
        sale-price: u0
      })
    )
    
    ;; Update user-counters maps
    (unwrap-panic (remove-counter-from-user current-owner counter-id))
    (unwrap-panic (add-counter-to-user caller counter-id))
    
    (ok true)
  )
)

;; Read-only functions

;; Get counter details
(define-read-only (get-counter (counter-id uint))
  (map-get? counters { counter-id: counter-id })
)

;; Get user's counters
(define-read-only (get-user-counters (user principal))
  (get counter-ids (default-to { counter-ids: (list) } (map-get? user-counters { user: user })))
)

;; Calculate increment cost based on current value
(define-read-only (calculate-increment-cost (current-value uint))
  (+ BASE_INCREMENT_COST (* BASE_INCREMENT_COST current-value current-value))
)

;; Get next milestone for a given value
(define-read-only (get-next-milestone (value uint))
  (if (< value u10) u10
    (if (< value u50) u50
      (if (< value u100) u100
        (if (< value u500) u500
          (if (< value u1000) u1000
            u0
          )
        )
      )
    )
  )
)

;; Check if milestone reward has been claimed
(define-read-only (milestone-claimed? (counter-id uint) (milestone uint))
  (match (map-get? counters { counter-id: counter-id })
    counter-data 
      (is-some (index-of (get milestone-rewards-claimed counter-data) milestone))
    false
  )
)

;; Get contract balance
(define-read-only (get-contract-balance)
  (var-get contract-balance)
)

;; Private functions

;; Check and award milestone rewards
(define-private (check-and-award-milestone (counter-id uint) (new-value uint))
  (let 
    (
      (counter-data (unwrap-panic (map-get? counters { counter-id: counter-id })))
      (owner (get owner counter-data))
      (claimed-milestones (get milestone-rewards-claimed counter-data))
    )
    (if (and (>= new-value u10) (not (milestone-claimed? counter-id u10)))
      (begin
        (try! (as-contract (stx-transfer? MILESTONE_10_REWARD tx-sender owner)))
        (map-set counters { counter-id: counter-id }
          (merge counter-data { 
            milestone-rewards-claimed: (unwrap-panic (as-max-len? (append claimed-milestones u10) u5))
          })
        )
        (var-set contract-balance (- (var-get contract-balance) MILESTONE_10_REWARD))
      )
      true
    )
    
    (if (and (>= new-value u50) (not (milestone-claimed? counter-id u50)))
      (begin
        (try! (as-contract (stx-transfer? MILESTONE_50_REWARD tx-sender owner)))
        (map-set counters { counter-id: counter-id }
          (merge counter-data { 
            milestone-rewards-claimed: (unwrap-panic (as-max-len? (append (get milestone-rewards-claimed (unwrap-panic (map-get? counters { counter-id: counter-id }))) u50) u5))
          })
        )
        (var-set contract-balance (- (var-get contract-balance) MILESTONE_50_REWARD))
      )
      true
    )
    
    (if (and (>= new-value u100) (not (milestone-claimed? counter-id u100)))
      (begin
        (try! (as-contract (stx-transfer? MILESTONE_100_REWARD tx-sender owner)))
        (map-set counters { counter-id: counter-id }
          (merge counter-data { 
            milestone-rewards-claimed: (unwrap-panic (as-max-len? (append (get milestone-rewards-claimed (unwrap-panic (map-get? counters { counter-id: counter-id }))) u100) u5))
          })
        )
        (var-set contract-balance (- (var-get contract-balance) MILESTONE_100_REWARD))
      )
      true
    )
    
    (if (and (>= new-value u500) (not (milestone-claimed? counter-id u500)))
      (begin
        (try! (as-contract (stx-transfer? MILESTONE_500_REWARD tx-sender owner)))
        (map-set counters { counter-id: counter-id }
          (merge counter-data { 
            milestone-rewards-claimed: (unwrap-panic (as-max-len? (append (get milestone-rewards-claimed (unwrap-panic (map-get? counters { counter-id: counter-id }))) u500) u5))
          })
        )
        (var-set contract-balance (- (var-get contract-balance) MILESTONE_500_REWARD))
      )
      true
    )
    
    (if (and (>= new-value u1000) (not (milestone-claimed? counter-id u1000)))
      (begin
        (try! (as-contract (stx-transfer? MILESTONE_1000_REWARD tx-sender owner)))
        (map-set counters { counter-id: counter-id }
          (merge counter-data { 
            milestone-rewards-claimed: (unwrap-panic (as-max-len? (append (get milestone-rewards-claimed (unwrap-panic (map-get? counters { counter-id: counter-id }))) u1000) u5))
          })
        )
        (var-set contract-balance (- (var-get contract-balance) MILESTONE_1000_REWARD))
      )
      true
    )
    
    (ok true)
  )
)

;; Remove counter from user's list
(define-private (remove-counter-from-user (user principal) (counter-id uint))
  (begin
    (var-set counter-to-remove counter-id)
    (let 
      (
        (current-counters (get-user-counters user))
        (filtered-counters (filter remove-counter-filter current-counters))
      )
      (map-set user-counters
        { user: user }
        { counter-ids: filtered-counters }
      )
      (ok true)
    )
  )
)

;; Helper variable for filtering
(define-data-var counter-to-remove uint u0)

;; Helper function for removing counter from list
(define-private (remove-counter-filter (id uint))
  (not (is-eq id (var-get counter-to-remove)))
)

;; Add counter to user's list
(define-private (add-counter-to-user (user principal) (counter-id uint))
  (let 
    (
      (current-counters (get-user-counters user))
    )
    (map-set user-counters
      { user: user }
      { counter-ids: (unwrap-panic (as-max-len? (append current-counters counter-id) u100)) }
    )
    (ok true)
  )
)

