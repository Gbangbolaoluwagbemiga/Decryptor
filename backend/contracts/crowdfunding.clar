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
        )
        (asserts! (< block-height (get deadline campaign)) err-deadline-passed)
        (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
        (map-set pledges { campaign-id: campaign-id, backer: tx-sender }
            { amount: (+ amount (get amount backer-pledge)) }
        )
        (map-set campaigns campaign-id
            (merge campaign { pledged: (+ current-pledged amount) })
        )
        (ok true)
    )
)

;; read only functions
;;

;; private functions
;;

