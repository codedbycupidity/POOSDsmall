-- Create the database
CREATE DATABASE IF NOT EXISTS Poosd_Contact_Manager;

-- Use the database
USE Poosd_Contact_Manager;

-- Drop existing Users and Contacts tables if they exist
DROP TABLE IF EXISTS Contacts;
DROP TABLE IF EXISTS Users;

-- Create Users Table with Email column
CREATE TABLE `Users` (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `FirstName` VARCHAR(50) NOT NULL DEFAULT '',
    `LastName` VARCHAR(50) NOT NULL DEFAULT '',
    `LoginName` VARCHAR(50) NOT NULL DEFAULT '',
    `Email` VARCHAR(100) NOT NULL DEFAULT '',
    `Password` VARCHAR(255) NOT NULL DEFAULT '',
    PRIMARY KEY (`ID`)
) ENGINE=InnoDB;

-- Create Contacts Table
CREATE TABLE `Contacts` (
    `ID` INT NOT NULL AUTO_INCREMENT,
    `FirstName` VARCHAR(50) NOT NULL DEFAULT '',
    `LastName` VARCHAR(50) NOT NULL DEFAULT '',
    `Phone` VARCHAR(50) NOT NULL DEFAULT '',
    `Email` VARCHAR(50) NOT NULL DEFAULT '',
    `UserID` INT NOT NULL DEFAULT '0',
    `Address` VARCHAR(255) NOT NULL DEFAULT '',
    PRIMARY KEY (`ID`)
) ENGINE=InnoDB;

-- Populate Users Table
INSERT INTO `Users` (`FirstName`, `LastName`, `LoginName`, `Email`, `Password`)
VALUES
    ('Rick', 'Leinecker', 'RickL', 'rick@example.com', 'COP4331'),
    ('Sam', 'Hill', 'SamH', 'sam@example.com', 'Test'),
    ('Rick', 'Leinecker', 'RickL', 'rick@secure.com', '5832a7136676809eccb7095efb774f2'),
    ('Sam', 'Hill', 'SamH', 'sam@secure.com', '0cbc6611f554fb0bd0809a388dc95a15b');