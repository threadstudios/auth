-- name: getByEmail
SELECT * FROM user
WHERE email = :email

-- name: getById
SELECT * FROM user
WHERE id = :id

-- name: register
INSERT INTO user (id, email, firstName, lastName, password, profile, state, active)
VALUES (:id, :email, :firstName, :lastName, :password, :profile, 'unverified', 1)

-- name: createVerification
INSERT INTO user__verification (userId, email, token, expiry, refreshes)
VALUES (:userId, :email, :token, :expiry, 0)

-- name: getVerificationById
SELECT * from user__verification
WHERE id = :id

-- name: getVerificationByToken
SELECT * FROM user__verification
WHERE token = :token

-- name: setVerificationComplete
UPDATE user__verification
SET success = 1
WHERE id = :id

-- name: setUserVerified
UPDATE user
SET state = 'verified'
WHERE id = :id