import {ORM} from "../ORM.js";

class VehiceModel extends ORM{
    table="VEHICE";

    createVEHICE(itemsData){
        return this.save(itemsData);
    }

}

export default VehiceModel;