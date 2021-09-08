const db = require("../../data/db-config");

function find() {
  return db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "=", "st.scheme_id")
    .select("sc.*")
    .count("st.step_id as number_of_steps")
    .groupBy("sc.scheme_id")
    .orderBy("sc.scheme_id");
 
}

async function findById(scheme_id) {
  const response = await db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "=", "st.scheme_id")
    .select("sc.scheme_name", "st.*")
    .where("sc.scheme_id", scheme_id)
    .orderBy("st.step_number");

  const result = {
    scheme_id: response[0].scheme_id,
    scheme_name: response[0].scheme_name,
    steps: response[0].step_id
      ? response.map((r) => ({
          step_id: r.step_id,
          step_number: r.step_number,
          instructions: r.instructions,
        }))
      : [],
  };

  return result;
}

async function findSteps(scheme_id) {
  // EXERCISE C
  const rows = await db("schemes as sc")
    .leftJoin("steps as st", "sc.scheme_id", "st.scheme_id")
    .select("st.step_id", "st.step_number", "instructions", "sc.scheme_name")
    .where("sc.scheme_id", scheme_id)
    .orderBy("st.step_number");

  if (!rows[0].step_id) return [];
  return rows;
  
}

function add(scheme) {
  // EXERCISE D
  return db("schemes")
    .insert(scheme)
    .then(([scheme_id]) => {
      return db("schemes").where("scheme_id", scheme_id).first();
    });
  
}

function addStep(scheme_id, step) {
  // EXERCISE E
  return db("steps")
    .insert({ ...step, scheme_id })
    .then(() => {
      return db("steps as st")
        .join("schemes as sc", "sc.scheme_id", "st.scheme_id")
        .select("step_id", "step_number", "instructions", "scheme_name")
        .orderBy("step_number")
        .where("sc.scheme_id", scheme_id);
    });
 
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
};


// const db = require('../../data/db-config')


// function find() {
//   const result =  db('scheme as sc')
//   .leftJoin('steps as st', 'sc.scheme_id', '=', 'st.scheme_id')
//   .select('sc.*')
//   .count('st.step_id as number_of_steps')
//   .groupBy('sc.scheme_id')
//     return result
// }
// async function findById(scheme_id) {
//   const rows= await db('scheme as sc')
//   .leftJoin('steps as st', 'sc.scheme_id', '=', 'st.scheme_id')
//   .where('sc.scheme_id', scheme_id)
//   .select('sc.*', 'sc.scheme_name', 'sc.scheme_id')
//   .orderBy('st.step_number')
  
//   const result = {
//     scheme_id: rows[0].scheme_id,
//     scheme_name: rows[0].scheme_name,
//     steps: []
//   }
//   rows.array.forEach(row => {
//     if (row.step_id) {
//       result.steps.push({
//         step_id: row.step_id,
//         step_number: row.step_number,
//         instructions: row.instructions
//       })
//     }
//   });
//   return result
// }
// async function findSteps(scheme_id) {
//   const rows = await db('schemes as sc')
//         .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
//         .select('st.step_id', 'st.step_number', 'instruction', 'sc.scheme_id')
//         .where('sc.scheme_id', scheme_id)
//         .orderBy('st.step_number')
//     if (!rows[0].step_id) return []
//     return rows
// }

// function add(scheme) { 
//     return db('schemes').insert(scheme)
//       .then(({scheme_id})=>{
//         return db('schemes').where('scheme_id', scheme_id)
//       })
// }

// function addStep(scheme_id, step) { 

//  return db('steps').insert({
//    ...step,
//    scheme_id
//  })
//   .then(()=>{
//     return db('steps as st')
//     .join('schemes as sc', 'sc.scheme_id', 'st.scheme_id')
//     .select('step_id', 'step_number', 'instructions', 'scheme_name')
//     .orderBy('step_number')
//     .where('sc.scheme_id', scheme_id)
//   })
// }

// module.exports = {
//   find,
//   findById,
//   findSteps,
//   add,
//   addStep,
// }


