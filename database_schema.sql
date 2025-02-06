CREATE DATABASE IF NOT EXISTS plate_db;

USE plate_db;



CREATE TABLE Devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mac VARCHAR(25) UNIQUE NOT NULL,
    device_name VARCHAR(50) NOT NULL,
    sn VARCHAR(25) UNIQUE NOT NULL
);


CREATE TABLE AlarmTypes(
    id INT AUTO_INCREMENT PRIMARY KEY,
    smart_type VARCHAR(25) NOT NULL,
    description VARCHAR(25) NOT NULL
);

INSERT INTO AlarmTypes (smart_type, description) VALUES 
    ('AVD', 'Tampering Alarm'),
    ('PEA', 'Line Crossing'),
    ('PEA2', 'Sterile Alarm'),
    ('AOIENTRY', 'Area Entry Alarm'),
    ('AOILEAVE', 'Area Exit Alarm'),
    ('PASSLINECOUNT', 'Passline Count'),
    ('TRAFFIC', 'Area (Traffic)'),
    ('VFD', 'Video Face Detection'),
    ('VSD', 'Meta Data'),
    ('VEHICE', 'License Plate Recognition');


CREATE TABLE Alarms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_device INT NOT NULL,
    id_type INT NOT NULL,
    register_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_device) REFERENCES Devices(id),
    FOREIGN KEY (id_type) REFERENCES AlarmTypes(id)
    
);


CREATE TABLE VEHICE (
    id INT AUTO_INCREMENT UNIQUE PRIMARY KEY,
    id_alarm INT ,
    plate_number VARCHAR(50),
    id_car VARCHAR(50),
    car_color VARCHAR(50),
    image BLOB,
    FOREIGN KEY (id_alarm) REFERENCES Alarms(id)
);

CREATE TABLE VFD (
    id INT AUTO_INCREMENT UNIQUE PRIMARY KEY,
    id_alarm INT ,
    id_target INT,
    sex VARCHAR(50),
    age VARCHAR(50),
    image BLOB,
    FOREIGN KEY (id_alarm) REFERENCES Alarms(id)
);
CREATE TABLE AVD (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_alarm INT,
    id_event INT,
    status VARCHAR(50),
    alarm_type VARCHAR(50),
    FOREIGN KEY (id_alarm) REFERENCES Alarms(id)
);

CREATE TABLE General (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_alarm INT,
    id_event INT,
    id_target INT,
    status VARCHAR(50),
    image BLOB,
    FOREIGN KEY (id_alarm) REFERENCES Alarms(id)
);

CREATE TABLE ObjectCounting (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_general INT,
    enter_car_count INT,
    enter_person_count INT,
    enter_bike_count INT,
    leave_car_count INT,
    leave_person_count INT,
    leave_bike_count INT,
    exist_car_count INT,
    exist_person_count INT,
    exist_bike_count INT,
    FOREIGN KEY (id_general) REFERENCES General(id)
);

CREATE TABLE TargetTypes(
    id INT AUTO_INCREMENT PRIMARY KEY,
    target_type VARCHAR(25) NOT NULL
);

INSERT INTO TargetTypes (target_type) VALUES 
    ('person'),
    ('car'),
    ('bike');

CREATE TABLE VSD (
    id INT AUTO_INCREMENT UNIQUE PRIMARY KEY,
    id_alarm INT ,
    id_event INT,
    id_target INT,
    id_target_type INT,
    image BLOB,
    FOREIGN KEY (id_alarm) REFERENCES Alarms(id),
    FOREIGN KEY (id_target_type) REFERENCES TargetTypes(id)
);

CREATE TABLE VSDCar (
    id INT AUTO_INCREMENT UNIQUE PRIMARY KEY,
    id_vsd INT ,
    year INT,
    car_type VARCHAR(50),
    car_color VARCHAR(50),
    brand VARCHAR(50),
    model VARCHAR(50),
    FOREIGN KEY (id_vsd) REFERENCES VSD(id)
);

CREATE TABLE VSDPerson (
    id INT AUTO_INCREMENT UNIQUE PRIMARY KEY,
    id_vsd INT,
    upper_length VARCHAR(50),
    upper_color VARCHAR(50),
    skirt VARCHAR(50),
    shoulderbag VARCHAR(50),
    sex VARCHAR(50),
    mask VARCHAR(50),
    hat VARCHAR(50),
    glasses VARCHAR(50),
    backpack VARCHAR(50),
    age VARCHAR(50),
    FOREIGN KEY (id_vsd) REFERENCES VSD(id)
);