//FUNCIONES DE PROCESAMIENTO DE ALARMASprocessAOILEAVE, processAOIENTRY, processTraffic
// En AlarmModel.js, processPasslineprocessAVD
//export { processVSD, processVFD, processPEA, processLPR };
import fs from 'fs'; // Importa fs usando la sintaxis de ES6

import {ORM} from "./ORM.js"; // Nota: Asegúrate de poner .js al final


class AlarmModel extends ORM{
    table = "Alarms";

    async CreateAlarm(data){
        return this.save(data);
    }

    async getAlarmId(query){
        const result = await this.get(query);
        //console.log("Resultado de la consulta:", result);  
        return result[0].id;    }

    async searchAlarmId(query) {
        const result = await this.get(query);
        //console.log("Resultado de la consulta:", result);  
        return result;
    }

    async CreateAlarmVehice(data){
        return this.save(data);
    }
}


//export { processVSD, processVFD, processTraffic, processPassline, processAOILEAVE, processPEA, processAVD, processLPR };

export default AlarmModel;