import {ORM} from "./ORM.js";

class TypeModel extends ORM{
    table= 'AlarmTypes';

    async searchTypeId(query) {
        const result = await this.get(query);
       // console.log("Resultado de la consulta:", result);  // Verifica lo que estás recibiendo
        return result[0].id;
    }
    
    
}
export default TypeModel;