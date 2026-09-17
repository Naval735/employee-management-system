-- ====================================================================
-- Employee Management System - Database Schema Script (MySQL)
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `employeemanagement` 
DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `employeemanagement`;

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS `Departments` (
    `Id` INT AUTO_INCREMENT PRIMARY KEY,
    `Code` VARCHAR(20) NOT NULL UNIQUE,
    `Name` VARCHAR(100) NOT NULL,
    `Description` VARCHAR(255) NULL,
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX `IX_Departments_Name` (`Name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Employees Table
CREATE TABLE IF NOT EXISTS `Employees` (
    `Id` INT AUTO_INCREMENT PRIMARY KEY,
    `EmployeeCode` VARCHAR(20) NOT NULL UNIQUE,
    `FirstName` VARCHAR(50) NOT NULL,
    `LastName` VARCHAR(50) NOT NULL,
    `Email` VARCHAR(100) NOT NULL UNIQUE,
    `Phone` VARCHAR(20) NOT NULL,
    `DateOfBirth` DATE NOT NULL,
    `Gender` VARCHAR(20) NOT NULL,
    `Address` VARCHAR(255) NOT NULL,
    `DepartmentId` INT NOT NULL,
    `Designation` VARCHAR(100) NOT NULL,
    `JoiningDate` DATE NOT NULL,
    `Salary` DECIMAL(12, 2) NOT NULL,
    `EmploymentStatus` VARCHAR(30) NOT NULL DEFAULT 'FullTime',
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT `FK_Employees_Departments` FOREIGN KEY (`DepartmentId`) REFERENCES `Departments` (`Id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Users Table
CREATE TABLE IF NOT EXISTS `Users` (
    `Id` INT AUTO_INCREMENT PRIMARY KEY,
    `Username` VARCHAR(50) NOT NULL UNIQUE,
    `Email` VARCHAR(100) NOT NULL UNIQUE,
    `PasswordHash` VARCHAR(255) NOT NULL,
    `Role` VARCHAR(20) NOT NULL DEFAULT 'HR',
    `EmployeeId` INT NULL,
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT `FK_Users_Employees` FOREIGN KEY (`EmployeeId`) REFERENCES `Employees` (`Id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Attendance Table
CREATE TABLE IF NOT EXISTS `Attendance` (
    `Id` INT AUTO_INCREMENT PRIMARY KEY,
    `EmployeeId` INT NOT NULL,
    `Date` DATE NOT NULL,
    `Status` VARCHAR(20) NOT NULL,
    `Remarks` VARCHAR(255) NULL,
    `CreatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    CONSTRAINT `FK_Attendance_Employees` FOREIGN KEY (`EmployeeId`) REFERENCES `Employees` (`Id`) ON DELETE CASCADE,
    UNIQUE KEY `UQ_Attendance_Employee_Date` (`EmployeeId`, `Date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
