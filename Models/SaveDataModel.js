//FUNCIONES PARA YA GUARDAR EN LA BD
const {DatabaseOperations} = require("../Models/index");

class SaveData extends DatabaseOperations{
    constructor(){
        super('Alarms') //Este es la bd en donde se hara el trabajo, solo es cosa de declararlo en el "super"
    }

    /*ESTO ES LOQ UE SE OCUPARA PARA HACER LA RELACION DE MUCHOS A MUCHOS, ES DECIT LAS TABLAS RELACIONALESPARA QUE CONECTE LAS TABLAS PRINCIPALES.
    this.PROJECT = {
    table: 'projects',
    pivot: 'users_projects_pivot',
    pk: 'user_id',
    fk: 'project_id',
    fk_pivot: 'project_id',
    key: 'user_id',
    };
    */


    saveData(plateNumber, vehiceId, colorCar, plateimage) {
        const query = `INSERT INTO plate (plate, ID_car, car_color, image) VALUES (?, ?, ?, ?)`;

        let imageBuffer = null;
        if (plateimage) {
            imageBuffer = Buffer.from(plateimage, 'base64');
        }

        pool.query(query, [plateNumber, vehiceId, colorCar, imageBuffer], (err, results) => {
            if (err) {
                console.error('Error guardando en la base de datos:', err);
            } else {
                console.log('Datos guardados correctamente:', results);
            }
        });
    }

    saveOSC(mac, deviceName, sn, type, eventId, targetId, status) {
        const query = `INSERT INTO alarms (mac, deviceName, sn, type, eventId, targetId, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        pool.query(query, [mac, deviceName, sn, type, eventId, targetId, status], (err, results) => {
            if (err) {
                console.error('Error guardando OSC en la base de datos:', err);
            } else {
                console.log('Datos guardados OSC correctamente:', results);
            }
        });
    }

    saveAVD(mac, deviceName, sn, type, eventId, status, alarmType) {
        const query = `INSERT INTO alarms (mac, deviceName, sn, type, eventId, status, alarmType) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        pool.query(query, [mac, deviceName, sn, type, eventId, status, alarmType], (err, results) => {
            if (err) {
                console.error('Error guardando AVD en la base de datos:', err);
            } else {
                console.log('Datos AVD guardados correctamente:', results);
            }
        });
    }

    savePEA(mac, deviceName, sn, type, eventId, targetId, status, image) {
        const query = `INSERT INTO alarms (mac, deviceName, sn, type, eventId, targetId, status, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        let imageBuffer = null;
        if (image) {
            imageBuffer = Buffer.from(image, 'base64');
        }

        pool.query(query, [mac, deviceName, sn, type, eventId, targetId, status, imageBuffer], (err, results) => {
            if (err) {
                console.error('Error guardando en la base de datos:', err);
            } else {
                console.log('Datos guardados correctamente:', results);
            }
        });
    }

    saveObjectCounting(mac, deviceName, sn, type, eventId, targetId, status, image, enterPersonCount, leavePersonCount, existPersonCount) {
        const query = `INSERT INTO alarms (mac, deviceName, sn, type, eventId, targetId, status, image, enterPersonCount, leavePersonCount, existPersonCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        let imageBuffer = null;
        if (image) {
            imageBuffer = Buffer.from(image, 'base64');
        }

        pool.query(query, [mac, deviceName, sn, type, eventId, targetId, status, imageBuffer, enterPersonCount, leavePersonCount, existPersonCount], (err, results) => {
            if (err) {
                console.error('Error guardando en la base de datos:', err);
            } else {
                console.log('Datos guardados correctamente:', results);
            }
        });
    }

    saveVFD(mac, deviceName, sn, type, targetId, sex, image) {
        const query = `INSERT INTO alarms (mac, deviceName, sn, type, targetId, sex, image) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        let imageBuffer = null;
        if (image) {
            imageBuffer = Buffer.from(image, 'base64');
        }

        pool.query(query, [mac, deviceName, sn, type, targetId, sex, imageBuffer], (err, results) => {
            if (err) {
                console.error('Error guardando en la base de datos:', err);
            } else {
                console.log('Datos guardados correctamente:', results);
            }
        });
    }

    saveVSDCar(mac, deviceName, sn, type, eventId, targetId, color, image) {
        const query = `INSERT INTO alarms (mac, deviceName, sn, type, eventId, targetId, car_color, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        let imageBuffer = null;
        if (image) {
            imageBuffer = Buffer.from(image, 'base64');
        }

        pool.query(query, [mac, deviceName, sn, type, eventId, targetId, color, imageBuffer], (err, results) => {
            if (err) {
                console.error('Error guardando en la base de datos:', err);
            } else {
                console.log('Datos guardados correctamente:', results);
            }
        });
    }

    saveVSDPerson(mac, deviceName, sn, type, eventId, targetId, sex, image) {
        const query = `INSERT INTO alarms (mac, deviceName, sn, type, eventId, targetId, sex, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        let imageBuffer = null;
        if (image) {
            imageBuffer = Buffer.from(image, 'base64');
        }

        pool.query(query, [mac, deviceName, sn, type, eventId, targetId, sex, imageBuffer], (err, results) => {
            if (err) {
                console.error('Error guardando en la base de datos:', err);
            } else {
                console.log('Datos guardados correctamente:', results);
            }
        });
    }

    saveLPR(mac, deviceName, sn, type, plate, carId, car_color, image) {
        const query = `INSERT INTO alarms (mac, deviceName, sn, type, plate, carId, car_color, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        let imageBuffer = null;
        if (image) {
            imageBuffer = Buffer.from(image, 'base64');
        }

        pool.query(query, [mac, deviceName, sn, type, plate, carId, car_color, imageBuffer], (err, results) => {
            if (err) {
                console.error('Error guardando en la base de datos:', err);
            } else {
                console.log('Datos guardados correctamente:', results);
            }
        });
    }
}
export { saveData, savePEA, saveRect, saveAVD, saveOSC, saveObjectCounting, saveVFD, saveLPR, saveVSDCar, saveVSDPerson};

/*function saveRect(x1, y1, x2, y2){
    const query = `INSERT INTO rect (x1, y1, x2, y2) VALUES (?, ?, ?, ?)`;
    pool.query(query, [x1, y1, x2, y2], (err, results) =>{
        if(err)
        {
            console.error('Error gurdando RECT en la base de datos: ', err);
        }else{
            console.log('Datos de RECT guardados correctamente: ', results);
        }
    });

}*/