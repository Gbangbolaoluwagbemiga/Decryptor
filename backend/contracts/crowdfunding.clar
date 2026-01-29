;; title: crowdfunding
;; version:
;; summary:
;; description:

;; traits
;;

;; token definitions
;;

;; constants
(define-constant err-not-found (err u404))
(define-constant err-already-exists (err u409))
(define-constant err-forbidden (err u403))
(define-constant err-goal-not-met (err u400))
(define-constant err-deadline-not-passed (err u401))
(define-constant err-already-claimed (err u402))
(define-constant err-deadline-passed (err u405))

;; data vars
(define-data-var next-campaign-id uint u1)

;; data maps
(define-map campaigns
    uint 
    {
        owner: principal,
        title: (string-ascii 50),
        goal: uint,
        deadline: uint,
        pledged: uint,
        claimed: bool
    }
)

(define-map pledges
    { campaign-id: uint, backer: principal }
    { amount: uint }
)

;; public functions
(define-public (create-campaign (title (string-ascii 50)) (goal uint) (deadline uint))
    (let
        (
            (campaign-id (var-get next-campaign-id))
        )
        (map-set campaigns campaign-id {
            owner: tx-sender,
            title: title,
            goal: goal,
            deadline: deadline,
            pledged: u0,
            claimed: false
        })
        (var-set next-campaign-id (+ campaign-id u1))
        (ok campaign-id)
    )
)

(define-public (pledge (campaign-id uint) (amount uint))
    (let
        (
            (campaign (unwrap! (map-get? campaigns campaign-id) err-not-found))
            (current-pledged (get pledged campaign))
            (backer-pledge (default-to { amount: u0 } (map-get? pledges { campaign-id: campaign-id, backer: tx-sender })))
            (contract-principal (as-contract tx-sender))
        )
        (asserts! (< block-height (get deadline campaign)) err-deadline-passed)
        (try! (stx-transfer? amount tx-sender contract-principal))
        (map-set pledges { campaign-id: campaign-id, backer: tx-sender }
            { amount: (+ amount (get amount backer-pledge)) }
        )
        (map-set campaigns campaign-id
            (merge campaign { pledged: (+ current-pledged amount) })
        )
        (ok true)
    )
)

(define-public (claim-funds (campaign-id uint))
    (let
        (
            (campaign (unwrap! (map-get? campaigns campaign-id) err-not-found))
            (pledged-amount (get pledged campaign))
        )
        (asserts! (is-eq (get owner campaign) tx-sender) err-forbidden)
        (asserts! (>= pledged-amount (get goal campaign)) err-goal-not-met)
        (asserts! (not (get claimed campaign)) err-already-claimed)
        (try! (as-contract (stx-transfer? pledged-amount tx-sender (get owner campaign))))
        (map-set campaigns campaign-id (merge campaign { claimed: true }))
        (ok true)
    )
)

(define-public (refund (campaign-id uint))
    (let
        (
            (campaign (unwrap! (map-get? campaigns campaign-id) err-not-found))
            (pledged-amount (get pledged campaign))
            (backer-pledge (unwrap! (map-get? pledges { campaign-id: campaign-id, backer: tx-sender }) err-not-found))
        )
        (asserts! (>= block-height (get deadline campaign)) err-deadline-not-passed)
        (asserts! (< pledged-amount (get goal campaign)) err-goal-not-met)
        (try! (as-contract (stx-transfer? (get amount backer-pledge) tx-sender tx-sender)))
        (map-delete pledges { campaign-id: campaign-id, backer: tx-sender })
        (ok true)
    )
)

;; read only functions
(define-read-only (get-campaign (campaign-id uint))
    (map-get? campaigns campaign-id)
)

(define-read-only (get-pledge (campaign-id uint) (backer principal))
    (map-get? pledges { campaign-id: campaign-id, backer: backer })
)

;; private functions
;;

