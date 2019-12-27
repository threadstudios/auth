-- name: createUserTable
CREATE TABLE IF NOT EXISTS user
(
    `id` varchar(36) NOT NULL,
    `email` varchar(255) NOT NULL,
    `firstName` varchar(255) NULL,
    `lastName` varchar(255) NULL,
    `state` varchar(30) NOT NULL,
    `profile` JSON,
    `password` varchar(255) NOT NULL,
    `active` int(1) NOT NULL DEFAULT 0,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
)

-- name: createUserLoginTable
CREATE TABLE IF NOT EXISTS user__login
(
    `id` int(12) NOT NULL AUTO_INCREMENT,
    `userId` varchar(36) NOT NULL,
    `success` boolean NOT NULL DEFAULT 0,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
)

-- name: createUserPasswordResetTable
CREATE TABLE IF NOT EXISTS user__resets
(
    `id` int(12) NOT NULL AUTO_INCREMENT,
    `userId` varchar(36) NOT NULL,
    `token` varchar(255) NOT NULL,
    `success` boolean NOT NULL DEFAULT 0,
    `expiry` DATETIME NOT NULL,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
)

-- name: createUserVerificationTable
CREATE TABLE IF NOT EXISTS user__verification
(
    `id` int(12) NOT NULL AUTO_INCREMENT,
    `userId` varchar(36) NOT NULL,
    `email` varchar(255) NOT NULL,
    `token` varchar(255) NOT NULL,
    `refreshes` int(4) NOT NULL,
    `success` boolean NOT NULL DEFAULT 0,
    `expiry` DATETIME NOT NULL,
    `createdAt` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
)

-- name: dropUserVerificationTable
DROP TABLE user__verification

-- name: dropUserPasswordResetTable
DROP TABLE user__resets

-- name: dropUserLoginTable
DROP TABLE user__login

-- name: dropUserTable
DROP TABLE user