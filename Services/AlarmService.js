import AlarmModel from '../Models/AlarmModel.js';
import TypeModel from '../Models/TypeModel.js';
import VehiceModel from '../Models/TypeAlarmsModels/VEHICE.js';
import AVDModel from '../Models/TypeAlarmsModels/AVD.js';
import VFDModel from '../Models/TypeAlarmsModels/VFD.js';
import { isNull } from 'util';
import fs from 'fs'; // Importa fs usando la sintaxis de ES6
import path from 'path';

class AlarmService {
    // Función estática para crear una alarma
    static createAlarm(alarm_info) {
        const alarm = new AlarmModel();
         
        let result = alarm.CreateAlarm(alarm_info);

        return result;
    }

    // Función estática para obtener el tipo de alarma
    static async getTypeId(SmartType) {
        const typeModel = new TypeModel();
        //console.log("GET TYPEID", SmartType);
    
        let query = { where: { smart_type: SmartType } };
    
        try {
            let result = await typeModel.searchTypeId(query); 
            //console.log("ALARM SERVICE ID   :", result);
            return result;
        } catch (err) {
            //console.error("Error al obtener el tipo de alarma:", err);
            throw err;
        }
    }
    
    static async getAlarmId(alarm) {
        const alarmModel = new AlarmModel();
       //console.log("GET TYPEID", alarm);
    
        let query = { where: { id_device: alarm.id_device , id_type:alarm.id_type, register_at: alarm.register_at}};
    
        try {
            let result = await alarmModel.searchAlarmId(query); 
            //console.log("ALARM SERVICE ID   :", result);
            return result;
        } catch (err) {
            //console.error("Error al obtener el tipo de alarma:", err);
            throw err;
        }
    }

    static async processVEHICE(data, id_alarm) {
        console.log("Process VEHICE", data);
    
        // Obtener el array de items
        const items = Array.isArray(data?.config?.listInfo?.[0]?.item)
            ? data.config.listInfo[0].item
            : data?.config?.listInfo?.[0]?.item ? [data.config.listInfo[0].item] : [];
    
        if (items.length === 0) {
            return;
        }
    
        const item2 = items[1];
        if (!item2) {
            return;
        }
        const imagePath = await this.getImage(item2); 
        if (!imagePath) {
            console.log("No se encontró imagen para guardar.");
            return;
        }
        const itemsData = {
            id_alarm: id_alarm,
            plate_number: item2?.plateNumber?.[0]?._ || null,
            id_car: item2?.vehiceId?.[0]?._ || null,
            car_color: item2?.carAttr?.[0]?.color?.[0]?._ || null,
            image: imagePath
        };

        const vehiceModel = new VehiceModel();
        try {
            await vehiceModel.createVEHICE(itemsData);
            console.log("Datos del item 2 guardados correctamente:", itemsData);
        } catch (error) {
            console.error("Error al guardar la alarma:", error.message);
            console.debug("Datos que fallaron:", itemsData);
        }
    }


    static async processAVD(data, id_alarm) {
        console.log("Process AVD aiaiiaia", data);
    
        // Obtener el array de items
        const items = Array.isArray(data?.config?.listInfo?.[0]?.item)
            ? data.config.listInfo[0].item
            : data?.config?.listInfo?.[0]?.item ? [data.config.listInfo[0].item] : [];
    
            console.log()
   
        const itemsData = {
            id_alarm: id_alarm,
            id_event: items?.eventId?.[0]?._ || null,
            status: items?.status?.[0]?._ || null,
            alarm_type: items?.alarmType?.[0]?._ || null
        };

        console.log("itemsmmssm dataaaa", itemsData);
        if(itemsData.id_event === null || itemsData.status===null || itemsData.alarm_type ===null ){
            console.log("No contiene datos, no se guarda la alarma :( xd");
        }else{
            const avdModel = new AVDModel();
            await avdModel.createADV(itemsData);
            console.log("Si contiene datos el nene, xdddddd, esto es lo que se guardo:", itemsData);            
        }

    }
    

    
    static getImage(item2) {
        const __dirname = path.dirname(new URL(import.meta.url).pathname);
        let image = null;
        let plateimage = null;
    
        if (Array.isArray(item2.targetImageData?.[0]?.targetBase64Data) && item2.targetImageData[0].targetBase64Data[0]?._) {
            plateimage = item2.targetImageData[0].targetBase64Data[0]._;
            const id_car = item2?.vehiceId?.[0]?._; 
    
            if (typeof plateimage === 'string') {
                plateimage = plateimage.replace(/[\r\n]/g, '').trim();
    
                const imageBuffer = Buffer.from(plateimage, 'base64'); 
    
                const imagePath = id_car 
                    ? path.join(__dirname, 'storage', 'app', 'public', 'images', `vfd_${id_car}.jpg`) 
                    : null;
    
                if (imagePath) {
                    const dir = path.dirname(imagePath);
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });  
                    }
    
                    fs.writeFileSync(imagePath, imageBuffer);
                    console.log(`Imagen guardada correctamente en: ${imagePath}`);
    
                    return imagePath;  
                } else {
                    console.log("No se pudo generar la ruta de la imagen.");
                }
            }
        } else {
            console.log(`Imagen no encontrada`);
        }
    
        image = plateimage;
        return image;
    }
    
    

    processObjectCounting(results, type, keyword, infoItems) {
        const mac = results?.config?.mac?.[0]?._ ;
        const sn =  results?.config?.sn?.[0]?._ ;
        const device_name =  results?.config?.device_name?.[0]?._ || null;

        console.log("All good here 1")
        const enter_car_count =  results?.config?.keyword?.[0]?.enter_car_count?.[0]?._ || null;
        const enter_person_count =  results?.config?.keyword?.[0]?.enter_person_count?.[0]?._ || null;
        const enter_bike_count =  results?.config?.keyword?.[0]?.enter_bike_count?.[0]?._ || null;

        const leave_car_count =  results?.config?.keyword?.[0]?.leave_car_count?.[0]?._ || null;
        const leave_person_count =  results?.config?.keyword?.[0]?.leave_person_count?.[0]?._ || null;
        const leave_bike_count =  results?.config?.keyword?.[0]?.leave_bike_count?.[0]?._ || null;

        const exist_car_count =  results?.config?.keyword?.[0]?.exist_car_count?.[0]?._ || null;
        const exist_person_count =  results?.config?.keyword?.[0]?.exist_person_count?.[0]?._ || null;
        const exist_bike_count =  results?.config?.keyword?.[0]?.exist_bike_count?.[0]?._ || null;
        console.log("Enter person count: ", enter_person_count);

    
        const processedData = [];

        let id_event =null;
        let id_target = null;
        let status = null;
        let currentDate = null;
        infoItems.forEach((item) => {
            id_event = item.id_event?.[0]?._ || null;
            id_target = item.id_target?.[0]?._ || null;
            status = item.status?.[0]?._ || null;

            currentDate = new Date();
            console.log("id_target")

        });

        const items = Array.isArray(results?.config?.listInfo?.[0]?.item)
        ? results.config.listInfo[0].item
        : results?.config?.listInfo?.[0]?.item ? [results.config.listInfo[0].item] : [];

            if (items.length === 0) {
                console.log("No se encontró object passline count FOR IMAGE.");
                return;
            }

            

                image = getImage(results);

                console.log("An image should have be.....somwhere")

                saveObjectCounting(mac, device_name, sn, type, id_event, id_target, status, image, enter_person_count, leave_person_count, exist_person_count);
                this.save({
                    mac,
                    device_name,
                    sn,
                    type,
                    id_event,
                    id_target,
                    status,
                    image,
                    enter_person_count,
                    leave_person_count,
                    exist_person_count
                })
                processedData.push({
                    'Mac': mac || null,
                    'Sn': sn || null,
                    'Device Name': device_name|| null,
                    'Type': type,
                    'Event ID': id_event.trim(),
                    'Target ID':id_target.trim() || null,
                    'Status': status || null,
                    'Fecha y hora' : currentDate.toLocaleString(),
                    'enter_car_count':enter_car_count || null,
                    'enter_person_count':enter_person_count || null,
                    'enter_bike_count':enter_bike_count || null,
                    'leave_car_count':leave_car_count || null,
                    'leave_person_count':leave_person_count || null,
                    'leave_bike_count':leave_bike_count || null,
                    'exist_car_count':exist_car_count || null,
                    'exist_person_count':exist_person_count || null,
                    'exist_bike_count':exist_bike_count || null,
                    'Imagen': image ? `Archivo guardado en target.jpg` : null,
                });
            

        if (processedData && processedData.length > 0) {
            console.log("Datos procesados:", processedData);
        } else {
            console.log("No se pudo procesar información de passline count");
        }
    }

    processGeneralAlarm(results, type, infoItems) {
        const mac = results?.config?.mac?.[0]?._ ;
        const sn =  results?.config?.sn?.[0]?._ ;
        const device_name =  results?.config?.device_name?.[0]?._ || null;


        const processedData = [];
        let id_event = null;
        let id_target = null;
        let status = null;
        let boundary = null;
        let currentDate = null;

        infoItems.forEach((item) => {
            id_event = item.id_event?.[0]?._ || null;
            id_target = item.id_target?.[0]?._ || null;
            status = item.status?.[0]?._ || null;

            boundary = item.boundary?.[0]?.$?.[0]?.count || null;
            console.log("Boundary: ", boundary);

            currentDate = new Date();
        
        });

        const items = Array.isArray(results?.config?.listInfo?.[0]?.item)
        ? results.config.listInfo[0].item
        : results?.config?.listInfo?.[0]?.item ? [results.config.listInfo[0].item] : [];

        if (items.length === 0) {
            console.log("No se encontró object passline count FOR IMAGE.");
            return;
        }

        image = getImage(results);


            //savePEA(mac, device_name, sn, type, id_event, id_target, status, image);

            this.save({
                mac, 
                device_name,
                sn,
                type,
                id_event,
                id_target,
                status,
                image
            })
        

            processedData.push({
                'Mac': mac || null,
                'Sn': sn || null,
                'Device Name': device_name|| null,
                'Event ID': id_event.trim(),
                'Target ID':id_target.trim() || null,
                'Status': status || null,
                'Fecha y hora' : currentDate.toLocaleString(),
                'Type': type,
                'Imagen': image ? `Archivo guardado en target_${id_target.trim().replace(/\s+/g, '_')}..jpg` : null,
            });
        
      

        if (processedData && processedData.length > 0) {
            console.log("Datos procesados:", processedData);
        } else {
            console.log("No se pudo procesar información de cruce de línea.");
        }
    }

    //ESTA SE CONSERVA
    processVSD(results, type) {
        const mac = results?.config?.mac?.[0]?._ ;
        const sn =  results?.config?.sn?.[0]?._ ;
        const device_name =  results?.config?.device_name?.[0]?._ || null;

        let infoItems = null;
        infoItems = Array.isArray(results?.config?.vsd?.[0]?.vsdInfo?.[0]?.item)
            ? results.config.vsd[0].vsdInfo[0].item
            : results?.config?.vsd?.[0]?.vsdInfo?.[0]?.item ? [results.config.vsd[0].vsdInfo[0].item] : [];

        if (infoItems.length === 0) {
            console.log("No se encontró información de cruce de línea para TRESPASSING.");
            return;
        
        }

        const processedData = [];
        let id_event = null;
        let id_target = null;
        let boundary = null;
        let currentDate = null;
        infoItems.forEach((item) => {
            id_event = item.id_event?.[0]?._ || null;
            id_target = item.id_target?.[0]?._ || null;
            boundary = item.boundary?.[0]?.$?.[0]?.count || null;
            currentDate = new Date();
        
        });

        image = getImage(results);

        
        let items = null;
        const target_type = results?.config?.vsd?.[0]?.targetImageData?.[0]?.target_type?.[0]?._ || null;
        console.log("This is before checking out what it detected");
        console.log("Target type: ", target_type);
        if(target_type == "person"){
            console.log("That's rigth, i am a person");

            items = Array.isArray(results?.config?.vsd?.[0]?.targetImageData?.[0]?.personAttr)
            ? results.config.vsd[0].targetImageData[0].personAttr
            : results?.config?.vsd?.[0]?.targetImageData?.[0]?.personAttr ? [results.config.vsd[0].targetImageData[0].personAttr] : [];

            if (items.length === 0) {
                console.log("No se encontró object passline count FOR IMAGE.");
                return;
            }
        
            items.forEach((item) => {
        
                let age = item.age?.[0]?._ || null;
                let backpack = item.backpack?.[0]?._ || null;
                let glasses = item.glasses?.[0]?._ || null;
                let hat = item.hat?.[0]?._ || null;
                let mask = item.mask?.[0]?._ || null;
                let sex = item.sex?.[0]?._ || null;
        
                let shoulderbag = item.shoulderbag?.[0]?._ || null;
                let skirt = item.skirt?.[0]?._ || null;
                let upper_color = item.upper_color?.[0]?._ || null;
                let upper_length = item.upper_length?.[0]?._ || null;
        
                this.save({
                    mac, 
                    device_name, 
                    sn, 
                    type,
                    id_event, 
                    id_target, 
                    sex, 
                    image

                });        
            });

        }
        console.log("WATDUSMINNN CON CAR Y PERSONNN");
        if(target_type == "car"){
            console.log("Vroom vroom, this is a car");

            items = Array.isArray(results?.config?.vsd?.[0]?.targetImageData?.[0]?.carAttr)
            ? results.config.vsd[0].targetImageData[0].carAttr
            : results?.config?.vsd?.[0]?.targetImageData?.[0]?.carAttr ? [results.config.vsd[0].targetImageData[0].carAttr] : [];

            if (items.length === 0) {
                console.log("No se encontró object passline count FOR IMAGE.");
                return;
            }
        
            items.forEach((item) => {
        
                let year = item.year?.[0]?._ || null;
                let car_type = item.type?.[0]?._ || null;
                let color = item.color?.[0]?._ || null;
                let brand = item.brand?.[0]?._ || null;
                let model = item.model?.[0]?._ || null;

                this.save({
                    mac, 
                    device_name, 
                    sn, 
                    type, 
                    id_event,
                    id_target, 
                    color, 
                    image
                });
            
            });
        }
        
        

        if (processedData && processedData.length > 0) {
            console.log("Datos procesados:", processedData);
        } else {
            console.log("No se pudo procesar información de cruce de línea.");
        }
    }

    //ESTA SE CONSERVA
    static async processVFD(data, id_alarm) {

        const items = Array.isArray(data?.config?.listInfo?.[0]?.item)
            ? data.config.listInfo[0].item
            : data?.config?.listInfo?.[0]?.item ? [data.config.listInfo[0].item] : [];
    

        if (items.length === 0) {
            console.log("No se encontró ninguna cara/persona.");
            return;
        }

        const itemsData = items.map((item) => ({
            id_target: item?.id_target?.[0]?._ || null,
            age: item?.age?.[0]?._ || null,
            sex: item?.sex?.[0]?._ || null,
            image: getImage(item), // Función personalizada para obtener imagen
            timestamp: new Date(), // Marca de tiempo actual
            id_alarm: id_alarm, // Asociar con la alarma
        }));

        if (itemsData.length === 0) {
            console.log("No se pudo procesar información de VFD.");
            return;
        }
    
        console.log("Items procesados:", itemsData);
    
        // Guardar datos en la base de datos
        try {
            const vfdModel = new VfdModel();
            await vfdModel.createVFD(itemsData); // Asumimos que `createVFD` guarda los datos
            console.log("Información de VFD guardada correctamente.");
        } catch (error) {
            console.error("Error al guardar información de VFD:", error);
        }
    }

    //ESTA SE CONSERVA
    processAVD(results, type) {
        const mac = results?.config?.mac?.[0]?._ ;
        const sn =  results?.config?.sn?.[0]?._ ;
        const device_name =  results?.config?.device_name?.[0]?._ || null;

        const infoItems = Array.isArray(results?.config?.listInfo?.[0]?.item)
        ? results.config.listInfo[0].item
        : results?.config?.listInfo?.[0]?.item ? [results.config.listInfo[0].item] : [];

        if (infoItems.length === 0) {
            console.log("No se encontró ningun item en AVD");
            return;
        }

        const processedData = [];
        infoItems.forEach((item) => {
            const id_event = item.id_event?.[0]?._ || null;
            const alarm_type = item.alarm_type?.[0]?._ || null;
            const status = item.status?.[0]?._ || null;
            const currentDate = new Date();
            
            processedData.push({
            'Mac': mac || null,
            'Sn': sn || null,
            'Device Name': device_name|| null,
            'Event ID': id_event.trim(),
            'Alarm type':alarm_type.trim() || null,
            'Status': status || null,
            'Fecha y hora' : currentDate.toLocaleString(),
            'Type': type
            });

            //saveAVD(mac, device_name, sn, type, id_event, status, alarm_type) 

            /*this.save({
                mac,
                device_name,
                sn,
                type,
                id_event,
                status,
                alarm_type
            })*/
        });

        const data = new AdvModel();
        data.createADV(processedData);

        if (processedData && processedData.length > 0) {
            console.log("Datos procesados:", processedData);
        } else {
            console.log("No se pudo procesar información de cruce de línea.");
        }
    }

    //ESTA SE CONSERVA
    processLPR(results, type) {
        console.log("ENTRO A ALARM MODEL");
        const mac = results?.config?.mac?.[0]?._ ;
        const sn =  results?.config?.sn?.[0]?._ ;
        const device_name =  results?.config?.device_name?.[0]?._ || null;


        const items = Array.isArray(results?.config?.listInfo?.[0]?.item)
            ? results.config.listInfo[0].item
            : results?.config?.listInfo?.[0]?.item ? [results.config.listInfo[0].item] : [];

        if (items.length === 0) {
            console.log("No se encontró ninguna matrícula.");
            return;
        }

        const itemsData = [];
        items.forEach((item) => {
            const plate_number = item.plate_number?.[0]?._ || null; 
            const id_car = item.id_car?.[0]?._ || null; 
            const car_color = item.carAttr?.color?.[0]?._ || null; 
            const currentDate = new Date();

            image = getImage(results);

            if (plate_number && plate_number.trim()) {
                itemsData.push({
                    'Mac': mac || null,
                    'Sn': sn || null,
                    'Device Name': device_name|| null,
                    'Type': type,
                    'Plate number': plate_number.trim(),
                    'Id carro': id_car?.trim() || null,
                    'Fecha y hora' : currentDate.toLocaleString(),
                    'Color carro': car_color || null,
                    'Imagen': plateimage ? `Archivo guardado en placa_${plate_number.trim().replace(/\s+/g, '_')}.jpg` : null
                });




                /*this.save({
                    mac, 
                    device_name,
                    sn, 
                    type, 
                    plate_number, 
                    id_car, 
                    car_color,
                    plateimage
                })*/
            }

                const data = new VehiceModel();
                data.createVEHICE(itemsData);
        });

        if (itemsData && itemsData.length > 0) {
            console.log("Items Data:", itemsData);
        } else {
        }  
    }
}

export default AlarmService;

    /*SEGUN YO ESTA ES LA REPETIDA
    
    processPassline(results, type) {
        const mac = results?.config?.mac?.[0]?._ ;
        const sn =  results?.config?.sn?.[0]?._ ;
        const device_name =  results?.config?.device_name?.[0]?._ || null;

        console.log("All good here 1")
        const enter_car_count =  results?.config?.passLineCount?.[0]?.enter_car_count?.[0]?._ || null;
        const enter_person_count =  results?.config?.passLineCount?.[0]?.enter_person_count?.[0]?._ || null;
        const enter_bike_count =  results?.config?.passLineCount?.[0]?.enter_bike_count?.[0]?._ || null;

        const leave_car_count =  results?.config?.passLineCount?.[0]?.leave_car_count?.[0]?._ || null;
        const leave_person_count =  results?.config?.passLineCount?.[0]?.leave_person_count?.[0]?._ || null;
        const leave_bike_count =  results?.config?.passLineCount?.[0]?.leave_bike_count?.[0]?._ || null;

        const exist_car_count =  results?.config?.passLineCount?.[0]?.exist_car_count?.[0]?._ || null;
        const exist_person_count =  results?.config?.passLineCount?.[0]?.exist_person_count?.[0]?._ || null;
        const exist_bike_count =  results?.config?.passLineCount?.[0]?.exist_bike_count?.[0]?._ || null;
        console.log("Enter person count: ", enter_person_count);

        
        const infoItems = Array.isArray(results?.config?.passLineCount?.[0]?.passLineCountInfo?.[0]?.item)
            ? results.config.passLineCount[0].passLineCountInfo[0].item
            : results?.config?.passLineCount?.[0]?.passLineCountInfo?.[0]?.item ? [results.config.passLineCount[0].passLineCountInfo[0].item] : [];

        if (infoItems.length === 0) {
            console.log("No se encontró información de passline count.");
            return;
        }
        const processedData = [];

        let id_event =null;
        let id_target = null;
        let status = null;
        let currentDate = null;
        infoItems.forEach((item) => {
            id_event = item.id_event?.[0]?._ || null;
            id_target = item.id_target?.[0]?._ || null;
            status = item.status?.[0]?._ || null;

            currentDate = new Date();
            console.log("id_target")

        });

        const items = Array.isArray(results?.config?.listInfo?.[0]?.item)
        ? results.config.listInfo[0].item
        : results?.config?.listInfo?.[0]?.item ? [results.config.listInfo[0].item] : [];

            if (items.length === 0) {
                console.log("No se encontró object passline count FOR IMAGE.");
                return;
            }

            

                image = getImage(results);

                console.log("An image should have be.....somwhere")

                saveObjectCounting(mac, device_name, sn, type, id_event, id_target, status, image, enter_person_count, leave_person_count, exist_person_count);
                
                let some= {
                    'Mac': mac || null,
                    'Sn': sn || null,
                    'Device Name': device_name|| null,
                    'Type': type,
                    'Event ID': id_event.trim(),
                    'Target ID':id_target.trim() || null,
                    'Status': status || null,
                    'Fecha y hora' : currentDate.toLocaleString(),
                    'enter_car_count':enter_car_count || null,
                    'enter_person_count':enter_person_count || null,
                    'enter_bike_count':enter_bike_count || null,
                    'leave_car_count':leave_car_count || null,
                    'leave_person_count':leave_person_count || null,
                    'leave_bike_count':leave_bike_count || null,
                    'exist_car_count':exist_car_count || null,
                    'exist_person_count':exist_person_count || null,
                    'exist_bike_count':exist_bike_count || null,
                    'Imagen': image ? `Archivo guardado en target.jpg` : null,
                };
                
                console.log("COME OOOOOOON --- Datos procesados:", some);
                
                processedData.push({
                    'Mac': mac || null,
                    'Sn': sn || null,
                    'Device Name': device_name|| null,
                    'Type': type,
                    'Event ID': id_event.trim(),
                    'Target ID':id_target.trim() || null,
                    'Status': status || null,
                    'Fecha y hora' : currentDate.toLocaleString(),
                    'enter_car_count':enter_car_count || null,
                    'enter_person_count':enter_person_count || null,
                    'enter_bike_count':enter_bike_count || null,
                    'leave_car_count':leave_car_count || null,
                    'leave_person_count':leave_person_count || null,
                    'leave_bike_count':leave_bike_count || null,
                    'exist_car_count':exist_car_count || null,
                    'exist_person_count':exist_person_count || null,
                    'exist_bike_count':exist_bike_count || null,
                    'Imagen': image ? `Archivo guardado en target.jpg` : null,
                });
            

        if (processedData && processedData.length > 0) {
            console.log("Datos procesados:", processedData);
        } else {
            console.log("No se pudo procesar información de passline count");
        }
    }
    processAOIENTRY(results, type) {
        const mac = results?.config?.mac?.[0]?._ ;
        const sn =  results?.config?.sn?.[0]?._ ;
        const device_name =  results?.config?.device_name?.[0]?._ || null;

        const processedData = [];
        let id_event = null;
        let id_target = null;
        let status = null;
        let boundary = null;
        let currentDate = null;

        infoItems.forEach((item) => {
            id_event = item.id_event?.[0]?._ || null;
            id_target = item.id_target?.[0]?._ || null;
            status = item.status?.[0]?._ || null;

            boundary = item.boundary?.[0]?.$?.[0]?.count || null;

            currentDate = new Date();
        
        });

        const items = Array.isArray(results?.config?.listInfo?.[0]?.item)
        ? results.config.listInfo[0].item
        : results?.config?.listInfo?.[0]?.item ? [results.config.listInfo[0].item] : [];

        if (items.length === 0) {
            console.log("No se encontró object passline count FOR IMAGE.");
            return;
        }

        image = getImage(results);
    

            processedData.push({
                'Mac': mac || null,
                'Sn': sn || null,
                'Device Name': device_name|| null,
                'Event ID': id_event.trim(),
                'Target ID':id_target.trim() || null,
                'Status': status || null,
                'Fecha y hora' : currentDate.toLocaleString(),
                'Type': type,
                'Imagen': image ? `Archivo guardado en target_${id_target.trim().replace(/\s+/g, '_')}..jpg` : null,
            });
        

        if (processedData && processedData.length > 0) {
            console.log("Datos procesados:", processedData);
        } else {
            console.log("No se pudo procesar información de cruce de línea.");
        }
    }

    processPEA(results, type) {
        const mac = results?.config?.mac?.[0]?._ ;
        const sn =  results?.config?.sn?.[0]?._ ;
        const device_name =  results?.config?.device_name?.[0]?._ || null;

        let infoItems = null;
        infoItems = Array.isArray(results?.config?.tripwire?.[0]?.tripInfo?.[0]?.item)
            ? results.config.tripwire[0].tripInfo[0].item
            : results?.config?.tripwire?.[0]?.tripInfo?.[0]?.item ? [results.config.tripwire[0].tripInfo[0].item] : [];

        if (infoItems.length === 0) {
            console.log("No se encontró información de cruce de línea para TRESPASSING.");
            infoItems = Array.isArray(results?.config?.perimeter?.[0]?.perInfo?.[0]?.item)
            ? results.config.perimeter[0].perInfo[0].item
            : results?.config?.perimeter?.[0]?.perInfo?.[0]?.item ? [results.config.perimeter[0].perInfo[0].item] : [];
            
            if (infoItems.length === 0) {
                console.log("No se encontró información de cruce de línea para Sterile Area.");
                return;
            }else{
                type = "Sterile Area"
            }
        
        }

        const processedData = [];
        let id_event = null;
        let id_target = null;
        let status = null;
        let currentDate = null;
        infoItems.forEach((item) => {
            id_event = item.id_event?.[0]?._ || null;
            id_target = item.id_target?.[0]?._ || null;
            status = item.status?.[0]?._ || null;
            currentDate = new Date();
        
        });

        const items = Array.isArray(results?.config?.listInfo?.[0]?.item)
        ? results.config.listInfo[0].item
        : results?.config?.listInfo?.[0]?.item ? [results.config.listInfo[0].item] : [];

        if (items.length === 0) {
            console.log("No se encontró object passline count FOR IMAGE.");
            return;
        }

        image = getImage(results);


            processedData.push({
                'Mac': mac || null,
                'Sn': sn || null,
                'Device Name': device_name|| null,
                'Event ID': id_event.trim(),
                'Target ID':id_target.trim() || null,
                'Status': status || null,
                'Fecha y hora' : currentDate.toLocaleString(),
                'Type': type,
                'Imagen': image ? `Archivo guardado en target_${id_target.trim().replace(/\s+/g, '_')}..jpg` : null,
            });
    
        
        if (processedData && processedData.length > 0) {
            console.log("Datos procesados:", processedData);
        } else {
            console.log("No se pudo procesar información de cruce de línea.");
        }
    }*/