import {ORM} from "../ORM.js";

class VfdModel extends ORM{
    table="VFD";

    createVFD(itemsData){
        return this.save(itemsData);
        
    }

}

export default VfdModel;