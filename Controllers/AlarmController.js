import mysql from 'mysql2'
import { parseString } from "xml2js";
import { parseStringPromise } from 'xml2js'; 
import xml2js from 'xml2js';

import express from 'express';
import bodyParser from 'body-parser';

import AlarmModel from '../Models/AlarmModel.js'; // Importa la clase AlarmModel
import XMLservice from '../Services/XmlService.js';
import DeviceService from '../Services/DeviceService.js';
import AlarmService from '../Services/AlarmService.js';

import fs from 'fs'; // Importa fs usando la sintaxis de ES6

const alarmModel = new AlarmModel();

//---SERVICIOS---
const xmlService = new XMLservice();
//const deviceService = new DeviceService();
//const alarmService = new AlarmService()

const app = express();

app.use(bodyParser.text({ type: 'application/xml', limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



app.post('/SendAlarmData', async (req, res) => {
    console.log('ENTRO');
    const xmlData = req.body; // The raw XML string from the request body
 //   console.log('¡Se detecto algo!');
   // console.log('Solicitud recibida en /SendAlarmData:');
     console.log('Solicitud recibida en /SendAlarmData:', req.body);

    try {
        const result = await processData(xmlData);  
        const SmartType = xmlService.getSmartType(result);
        const mac = result?.config?.sn?.[0]?._ || null;
        //console.log("mac value:", mac);  

        allAlarms(result, SmartType);

        res.send('XML received successfully');
    } catch (error) {
        console.error("Error al procesar los datos:", error);
        res.status(500).send('Error al procesar el XML');
    }
});



async function allAlarms(data, SmartType){
    //llamar a funcion getDevice, PD: esta abajo de esta funcion
    const device= await DeviceService.getDeviceInfo(data);

    //Si eciste el device, se retorna el id, CASO CONTRARIO, se crea el registro e igual se retorna el id
    const id_device = await DeviceService.CreateOrGetDevice(device);
    console.log("id_device", id_device);
    const id_type = await AlarmService.getTypeId(SmartType); // Llamada directa a la función estática
    console.log("IDIDIDIDIIDID", id_type);

    let alarm_info = {
        'id_device': id_device,
        'id_type': id_type,
    };

    const id_alarm = await AlarmService.createAlarm(alarm_info);
    console.log("id Alarma Final:", id_alarm);
   // const id_alarm = await AlarmService.getAlarmId(alarm);
    //console.log("FINALLL UWUWUWUUWUWUW", id_alarm)

    switch(SmartType){
        case "AVD":
            console.log("AVD alarm recieved:3.5 Tampering/Scene change/shifting alarm");
            AlarmService.processAVD(data, id_alarm);
            break;
        case "PEA":
            console.log("PEA alarm recieved: 3.6 Tripwire / line crossing alarm")

            //AlarmService.processPEAresults, type, infoItems);
            break;
        case "AOIENTRY":
            type = "Area Entry alarm"
            console.log("Resultados JSON:\n", data);
            //AlarmService.processAOIENTRY(results, type, infoItems);
            break;
        case "AOILEAVE":
            console.log("AOILEAVE alarm recieved:3.8 Area Exit alarm");
            //AlarmService.processAOILEAVE(results, type, infoItems);
            break;
        case "PASSLINECOUNT":
            console.log("PASSLINECOUNT alarm recieved:3.9 Object counting - line (Passline)");
            //AlarmService.processPASSLINECOUNT(results, type, keyword, infoItems);
            break;
        case "TRAFFIC":
            console.log("TRAFFIC alarm recieved:3.10 Object counting area (Traffic)");
            //AlarmService.processTRAFFIC(results, type, keyword, infoItems);
            break;
        case "VFD":
            console.log("VFD alarm recieved:3.12 Video face detection");            
            AlarmService.processVFD(data, id_alarm);
            break;
        case "VSD":
            console.log("VSD alarm recieved:Meta Data");            
           // AlarmService.processVSD(results, type);
            break;

        case "VEHICE":
            console.log("LICENSE PLATE RECEIVED")
            AlarmService.processVEHICE(data, id_alarm);
            break;
    }


}  



async function processData(xmlData) {
    try {
        const result = await xmlService.convertXMLToJSON(xmlData);  

        const SmartType = xmlService.getSmartType(result); 

        return result; 
    } catch (err) {
        console.error("Error processing XML:", err);
        throw err; 
    }
}



const IP_ADDRESS = '0.0.0.0';
const PORT = 3000;
app.listen(PORT, IP_ADDRESS, () => {
    console.log(`Servidor corriendo en http://${IP_ADDRESS}:${PORT}/SendAlarmData`);
});