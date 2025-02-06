import { type } from 'os';
import DeviceModel from '../Models/DeviceModel.js';

class DeviceService {

    static async getDeviceInfo(data) {
        console.log("Raw data:", JSON.stringify(data, null, 2));
    
        data = {
            'mac': data?.config?.mac?.[0]?._,
            'sn': data?.config?.sn?.[0]?._,
            'device_name': data?.config?.deviceName?.[0]?._ || null
        };
    
        console.log("Processed data:", data);
        return data;
    }
    



    static async CreateOrGetDevice(device) {
        console.log("CREAR O GET DEVICEEEE");
        console.log("devidceiceicieice ", device);
        const existingDevice = new DeviceModel();
        
        const query = { where: { mac: device.mac, device_name: device.device_name, sn: device.sn } }; 
        console.log("Valores para la consulta:", [device.mac, device.device_name, device.sn]);
    
        let result = await existingDevice.getDevice(query);
        console.log("RESULTADODODOODODD", JSON.stringify(result, null, 2));
    
        // Verifica si el resultado es un array vacío
        if (Array.isArray(result) && result.length === 0) {
            console.log("xddddddddd: El resultado es un array vacío.");
            result = await existingDevice.SaveDevice(device); 
            return result[0].id; // Retorna el ID del dispositivo existente


        } else if (!result || result === null) {
            console.log("xddddddddd: El resultado es null o undefined.");
        } else {
            console.log("LESTTT FIUNCEDKCNDKUCWQ CJKQEB<KJ");
        }
    
        return result[0].id; // Retorna el ID del dispositivo existente

        
      /*  try {
            let result = await existingDevice.getDevice(query);
            
            if (result.length === 0) {
                console.log("No existe el dispositivo, creando uno nuevo...");
                result = await existingDevice.SaveDevice(device); // Guarda el dispositivo si no existe
            }
    
            console.log("Resultado:", result);
            
            if (typeof result === "number") {
                return result; // Devuelve el ID directamente si SaveDevice devuelve un número
            } else {
                return result[0].id; // Retorna el ID del dispositivo existente
            }
        } catch (err) {
            console.error("Error al obtener o crear el dispositivo:", err);
            throw err; // Lanza el error para manejarlo en un nivel superior
        }*/
    }
    
    

}

export default DeviceService;