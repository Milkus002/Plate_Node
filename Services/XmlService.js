import { parseString } from "xml2js";


class XMLservice{
    convertXMLToJSON(xmlData) {
        return new Promise((resolve, reject) => {
            parseString(xmlData, function (err, results) {
                if (err) {
                    console.error("Error al parsear XML:", err);
                    reject(err);  // Rechaza la promesa en caso de error
                } else {
                    resolve(results);  // Resuelve la promesa con los resultados
                }
            });
        });
    }


        XMLtoString(xmlData){
                parseString(xmlData, (err, results) => {
                    if(err){
                        reject("XD error al parsear a XML");
                    }else{
                        resolve(results);
                    }
                });
        };

        ObjectJStoJSON(results) {
            console.log("OBJECTTOJSON FUNCIONNNN");
            const data = JSON.stringify(results, null, 2);
            console.log("DATAAAA", data);
            // Opcional: Guardar en un archivo JSON
            //fs.writeFileSync("output2.json", data);
            return data;
        };

                    // Checamos la alarma recibida
                    //const smartType = results?.config?.smartType?.[0]?._ || null; 
                    //console.log("Smart type: "+smartType);*/
        getSmartType(results) {
            let SmartType = results?.config?.smartType?.[0]._|| null;
            return SmartType;
        }
}


export default XMLservice;