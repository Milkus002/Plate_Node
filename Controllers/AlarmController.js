import mysql from 'mysql2'
import { parseString } from "xml2js";
import { parseStringPromise } from 'xml2js'; 
import xml2js from 'xml2js';

import express from 'express';
import bodyParser from 'body-parser';

import AlarmModel from '../Models/AlarmModel.js'; // Importa la clase AlarmModel
import fs from 'fs'; // Importa fs usando la sintaxis de ES6

const alarmModel = new AlarmModel();

const app = express();

app.use(bodyParser.text({ type: 'application/xml', limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));



// Define the endpoint to receive XML
app.post('/SendAlarmData', (req, res) => {
    console.log('ENTRO');
    const xmlData = req.body; // The raw XML string from the request body
    console.log('¡Se detecto algo!');
    console.log('Solicitud recibida en /SendAlarmData:');
    //console.log('Solicitud recibida en /SendAlarmData:', req.body);

    //console.log(xmlData);
    //fs.writeFileSync("xmlData.txt",xmlData );
    
    parseString(xmlData, function (err, results) {
        if (err) {
            console.error("Error al parsear XML:", err);
        } else {
            // Convertir a JSON
            let data = JSON.stringify(results, null, 2);

            // Opcional: Guardar en un archivo JSON
           // fs.writeFileSync("output2.json", data);
           /*let mac, sn, deviceName = getDeviceInfo(results);
           let device = {
            'mac': mac,
            'sn':sn,
            'deviceName':deviceName
           }*/

           let type = '';
            // Checamos la alarma recibida
            const smartType = results?.config?.smartType?.[0]?._ || null; 
            console.log("Smart type: "+smartType);
            switch(smartType){
                //NUNCA RECIBIMOS MITOIN NI OSC
                case "MOTION":
                    console.log("MOTION alarm received: 3.3 ");
                    console.log("Resultados JSON:\n", data);
                    break;
                case "OSC":
                    console.log("OSC message received: 3.4 Item monitoring alarm");
                    console.log("Resultados JSON:\n", data);
                    break;
                
                case "AVD":
                    type = "Tampering alarm";
                    console.log("AVD alarm recieved:3.5 Tampering/Scene change/shifting alarm");
                    console.log("Resultados JSON:\n", data);
                    alarmModel.processAVD(results, type);
                    break;
                case "PEA":
                    type = "Line Crossing"
                    console.log("PEA alarm recieved: 3.6 Tripwire / line crossing alarm");
                  
                    console.log("Resultados JSON:\n", data);
                    //processPEA(results, type);
                    break;
                case "AOIENTRY":
                    type = "Area Entry alarm"
                    console.log("AOIENTRY alarm recieved:3.7 Area Entry alarm");
                    
                    console.log("Resultados JSON:\n", data);
                    //processAOIENTRY(results, type);
                    break;
                case "AOILEAVE":
                    type = "Area Exit alarm"
                    console.log("AOILEAVE alarm recieved:3.8 Area Exit alarm");
                    
                    console.log("Resultados JSON:\n", data);
                   // processAOILEAVE(results, type);
                    break;
                case "PASSLINECOUNT":
                    type = "Passline Count"
                    console.log("PASSLINECOUNT alarm recieved:3.9 Object counting - line (Passline)");
                    
                    console.log("Resultados JSON:\n", data);
                   // processPassline(results, type);
                    break;
                case "TRAFFIC":
                    type = "Area (Traffic)"
                    console.log("TRAFFIC alarm recieved:3.10 Object counting – area (Traffic)");
                    
                    console.log("Resultados JSON:\n", data);
                   // processTraffic(results, type);
                    break;
                case "VFD":
                    type = "Video Face Detection";
                    console.log("VFD alarm recieved:3.12 Video face detection");
                    
                    console.log("Resultados JSON:\n", data);
                    
                    alarmModel.processVFD(results, type);
                    break;
                case "VSD":
                    type = "Meta Data";
                    console.log("VSD alarm recieved:Meta Data");
                    
                    console.log("Resultados JSON:\n", data);
                    
                    alarmModel.processVSD(results, type);
                    break;

                case "VEHICE":
                    type = "License Plate Recognition";
                    console.log("LICENSE PLATE RECEIVED")
                    //console.log("Resultados JSON:\n", data);
                    //
                    //processResults(results);
                    alarmModel.processLPR(results, type);
                    break;
            }
        }
    });
    // Respond to the sender
    res.send('XML received successfully');
});

const IP_ADDRESS = '0.0.0.0';
const PORT = 3000;
app.listen(PORT, IP_ADDRESS, () => {
    console.log(`Servidor corriendo en http://${IP_ADDRESS}:${PORT}/SendAlarmData`);
});
