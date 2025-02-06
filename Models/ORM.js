import pool from "../config/db.js";

class ORM {
  constructor(table) {
    this.table = table;
  }

  async includeBuilder(input, option) {
    const { table, pivot, pk, fk, fk_pivot, key, select = [] } = option
    const promiser = []
    for (let i = 0; i < input.length; i++) {
      const item = input[i];
      const query = QueryBuilder.build.innerJoin(table, pivot, pk, fk, fk_pivot, item[key], select)
      promiser.push(pool.query(query))
    }
    return Promise.all(promiser)

  }

  async include(options, data) {
    const db = this;
    const response = await db.get(data)

    if(!response.length) return []
    
    const promisers = options.map(function (option) {
      return db.includeBuilder(response, option)
    })
    const outputs = await Promise.all(promisers)
    const newResponse = []
    for (let i = 0; i < response.length; i++) {
      const item = response[i];
      const join = {}
      for (let j = 0; j < outputs.length; j++) {
        const output = outputs[j];
        const option = options[j];
        join[option.table] = output[i].rows
      }
      newResponse.push({
        ...item,
        ...join
      })
    }
    if(data.top) return newResponse[0]
    return newResponse
  }

  async get(data = {}) {
    const { query, values } = QueryBuilder.build.filter(this.table, data);
    try {
        const result = await new Promise((resolve, reject) => {
            pool.query(query, values, function (err, result) {
                if (err) {
                    console.error("Error en la consulta:", err);
                    reject(err);  // Si ocurre un error, lo rechazamos
                } else {
                      console.log("AAAMMAMAMAMA",result);
                      return resolve(result);
                }
            });
        });
        return result;
    } catch (error) {
        console.error("Error en la consulta:", error);  // En caso de error
        throw error;
    }
}


save(data) {
  console.log("FUNCION SAVE");
  const sql = QueryBuilder.build.save(this.table, data);
  return new Promise((resolve, reject) => {
    pool.query(sql, Object.values(data), (err, result) => {
      if (err) {
        reject(err);
      } else {
        return resolve(result.insertId); // Usamos insertId para obtener el ID del registro insertado
      }
    });
  });
}

  update(data, where) {
    const sql = QueryBuilder.build.update(this.table, data, where);
    return new Promise((resolve, reject) => {
      pool.query(sql, Object.values(data), (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data);
        }
      });
    });
  }

  deleteOne(id) {
    const sql = `DELETE FROM ${this.table} WHERE id = ?`;
    return new Promise((resolve, reject) => {
      pool.query(sql, [this.table, id], function (err, data) {
        if (err) reject(err);
        resolve(data);
      });
    });
  }
}

const QueryBuilder = {
  build: {
    save: (name, data) => {
      if (!Object.keys(data).length) throw new Error("No se pueden guardar datos vacíos");
      const vIterator = Object.keys(data).map(() => `?`).join(',');
      const keys = Object.keys(data).join(',');
      return `INSERT INTO ${name} (${keys}) VALUES (${vIterator})`;
    },

    filter(table, data) {
      //console.log("smart_type:", data);  // Asegúrate de que sea el valor correcto
    
      const whereConditions = data?.where;  // Accede a `data.where` directamente
      let query = `SELECT * FROM ${table}`;
      let values = [];
    
      // Verifica si 'whereConditions' existe y tiene datos antes de procesarlo
      if (whereConditions && typeof whereConditions === 'object' && Object.keys(whereConditions).length > 0) {
        const conditions = Object.entries(whereConditions)
          .map(([key, value]) => {
            values.push(value);  // Agregar los valores a la lista
            return `${key} = ?`;  // Crear la condición 'key = ?'
          })
          .join(' AND ');  // Si hay más condiciones, unírlas con 'AND'
    
        query += ` WHERE ${conditions}`;  // Agregar el 'WHERE' a la consulta
      } else {
        console.log("No hay condiciones WHERE o la estructura es incorrecta");
      }
    
      console.log("Consulta generada:", query);  // Asegúrate de que la consulta sea correcta
      console.log("Valores para la consulta:", values);  // Verifica los valores generados
    
      return { query, values };  // Devolver la consulta y los valores para el 'WHERE'
    },   
  
    
    innerJoin: (name, pivot, pk, fk, fk_pivot, id, select = []) => {

      const selection = select.length ? select.map(s => `s.${s}`).join(',') : '*'

      return `SELECT ${selection}
      FROM ${pivot} sc 
      INNER JOIN ${name} s ON s.${fk} = sc.${fk_pivot}
      WHERE sc.${pk} = ${id}`
    },
    update: (name, data, where) => {
      let conditions = '';
      let updater = '';

      if (where) {
        const conditionKeys = Object.keys(where);
        const conditionValues = Object.values(where).map((value) => (typeof value === 'string' ? `'${value}'` : value));
        conditionKeys.forEach((key, index) => {
          conditions += `${key} = ${conditionValues[index]}${index === conditionKeys.length - 1 ? '' : ' AND '}`;
        });
      }
      if (data) {
        const dataKey = Object.keys(data);
        dataKey.forEach((key, index) => {
          updater += `${key} = $${index + 1}`;
        });
      }
      let query = `UPDATE ${name} SET ${updater} `;
      if (conditions) query += ` WHERE ${conditions}`;
      return query;
    },
  }
}
export { ORM, QueryBuilder };


