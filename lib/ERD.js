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
    console.log('here')
    for (const model of modelsArray) {
      const collectionName = model.collection.collectionName;
      const col = new Collection(collectionName, options.collection);
      const paths = model.schema.paths;
      const nameToCollection = {};
      let i = 0;
      for (let key in paths) {
        const required = paths[key].isRequired;
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
          const required = paths[key].required || false;
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
          } else {
            relationConfig = {
              foreignField: collection2Fields.indexOf('_id'),
              localField: {
                type: fieldType,
                index: i,
                required
              }
            }
          }
          if (relations[collectionName]) {
            relations[collectionName][collection2Name] = relationConfig;
          } else {
            relations[collectionName] = {
              [collection2Name]: relationConfig
            }
          }

        }
        i++;

      }
    }
    for (let key in relations) {
      const relation = relations[key];
      for (let insideKey in relation) {
        erd.addRelation(key, insideKey, relation[insideKey], relation[insideKey]);
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
