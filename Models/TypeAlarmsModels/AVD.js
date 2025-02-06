import {ORM} from "../ORM.js";

class AVDModel extends ORM{
    table="AVD";

    createADV(itemsData){
        console.log("CREANDO ALARMA WIU WIUW IWUWIWIUWIW");
        return this.save(itemsData);
        
    }

}

export default AVDModel;