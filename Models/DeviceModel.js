import {ORM} from "./ORM.js";

class DeviceModel extends ORM {
    table = 'Devices';

    async getDevice(query){
        const result = await this.get(query);
        console.log("GET DEVICEEEEE:", result);  
        return result;

    };

    async SaveDevice(device){
        const result = await this.save(device); 
        console.log("SAVE DEVICEEEEEEE:", result);  
        return result;
    }

}

export default DeviceModel;