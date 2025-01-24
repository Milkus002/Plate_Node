CREATE DATABASE IF NOT EXISTS plate_db;

USE plate_db;

CREATE TABLE plate (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plateNumber VARCHAR(50) NOT NULL,
    vehiceId VARCHAR(50) UNIQUE NOT NULL,
    register_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    colorCar VARCHAR(50),
    image BLOB
);

CREATE TABLE device (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    mac VARCHAR(25) NOT NULL,
    deviceName VARCHAR(50) NOT NULL,
    sn VARCHAR(25) NOT NULL
);



CREATE TABLE alarms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mac VARCHAR(25) NOT NULL,
    deviceName VARCHAR(50) NOT NULL,
    sn VARCHAR(25) NOT NULL,
    register_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(25) NOT NULL,

    eventId INT,
    targetId INT,
    status VARCHAR(50),

    alarmType VARCHAR(50),

    sex VARCHAR(10),

    enterPersonCount INT,
    leavePersonCount INT,
    existPersonCount INT,


    plateNumber VARCHAR(50),
    vehiceId VARCHAR(50) UNIQUE,
    colorCar VARCHAR(50),

    plateimage BLOB

);
