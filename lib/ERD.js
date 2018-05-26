var mongoose = require('mongoose');
var Schema = mongoose.Schema

const Viz = require('viz.js');
const {
  Module,
  render
} = require('viz.js/full.render.js');

const fs = require('fs');
const util = require('util');
const {
  Collection,
  ERD
} = require('./DS');
const parseModel=(model,erd,models,relations,options,fake=false)=>{
  try{
    let col;
  const collectionName = model.collection.collectionName;
  col = new Collection(collectionName, options.collection);
  const paths = model.schema.paths;
  const nameToCollection = {};

  let i = 0;
  for (let key in paths) {
    const fieldName = paths[key].path;
    const fieldType = paths[key].instance
    col.addField(fieldName, {
      type: fieldType
    });
    erd.addCollection(col);
    if (paths[key].options.ref) {
      let collection2Name = modelNameToCollectionName[paths[key].options.ref];
      if (!collection2Name) {
        i += 1;
        continue;
      }
      let relationConfig;
      const required = paths[key].options.required || false;
      const collection2Fields = Object.keys(models[collection2Name].schema.paths);
      if (paths[key].options.foreignField && paths[key].options.localField) {
        relationConfig = {
          foreinField: collection2Fields.indexOf(foreignField),
          localField: {
            type: fieldType,
            index: Object.keys(paths.indexOf(localField)),
            required
          }
        }
      }
      else{
        if(fieldType==='Array'){

        }
        relationConfig = {
          foreignField: collection2Fields.indexOf('_id'),
          localField: {
            type: fieldType,
            index: i,
            required
          }
        }
      }
      if (relations[collectionName] && relations[collectionName][collection2Name]) {
        relations[collectionName][collection2Name].push(relationConfig);
      } else if(relations[collectionName]){
        relations[collectionName][collection2Name]=[relationConfig]
      }
      else{
        relations[collectionName] ={
          [collection2Name]: [relationConfig]
        }
      }

    }

    if(paths[key] instanceof Schema.Types.DocumentArray){

      const fakeCollectionName=`${collectionName}_${key}`
      paths[key].collection={collectionName:fakeCollectionName};
      models[fakeCollectionName]=paths[key];
      if(!relations[collectionName]){
        relations[collectionName]={};
      }
      if(!relations[collectionName][fakeCollectionName]){
        relations[collectionName][fakeCollectionName]=[];
      }
      relations[collectionName][fakeCollectionName].push({localField:{index:i,type:fieldType},foreignField:Object.keys(paths[key].schema.paths).indexOf('_id')});
      parseModel(paths[key],erd,models,relations,options,true);

    }
        i++;
}


}
catch(e){
  console.log(e)
  throw e;
}
}
const generateFromModels = async (modelsArray, options = {}) => {
  try {
    let viz = new Viz({
      Module,
      render
    });
    const erd = new ERD();
    const relations = {};
    modelNameToCollectionName = {};
    const models = {};

    for (const model of modelsArray) {
      models[model.collection.collectionName] = model;
      modelNameToCollectionName[model.modelName] = model.collection.collectionName;
    }
    for (const model of modelsArray) {
      parseModel(model,erd,models,relations,options);
    }
    for (let collection1 in relations) {
      const relation = relations[collection1];
      for (let collection2 in relation) {
        for(let config of relation[collection2]){
        erd.addRelation(collection1, collection2,config);
      }
      }

    }

    return await viz.renderString(erd.generate(),{format:options.format});


  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  generateFromModels
};
