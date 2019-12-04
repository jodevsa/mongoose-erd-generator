#!/usr/bin/env node
var program = require('commander');
const process = require('process');
const fs = require('fs');
const util = require('util');
readdir = util.promisify(fs.readdir)
const path = require('path');
const ERD = require('../lib/ERD');
const allowedFormats=["svg", "dot", "xdot", "plain", "plain-ext", "ps", "ps2", "json", "json0"];
const main = async () => {
  try {
    program
      .version('0.1.0')
      .option('-p, --path <path>', 'set models path wanted to generate an ERD from.')
      .option('-o, --output <path>', 'set output path')
      .option('-f, --format [svg,dot,xdot,plain,plan-ext,ps,ps2,json,json0]')
      .option('-c, --color <color>')
      .option('-i, --ignore-index','ignore any files called index.js')
      .parse(process.argv);
    if(allowedFormats.indexOf(program.format)==-1){
        console.log(`Format :'${program.format}', is not supported.`);
        return;
    }
    if (program.path && program.output) {

      const modelDirectory = path.resolve(program.path);
      const outputFilePath = program.output;
      const modelsPath = await readdir(modelDirectory);
      const models = [];
      for (const _model of modelsPath) {
        if (_model.indexOf('.js') != -1 && !(_model === "index.js" && program.ignoreIndex)){
          const model = require(path.join(modelDirectory, _model));
          models.push(model);
        }
      }
      const svg = await ERD.generateFromModels(models, {
        format:program.format,
        collection: {
          nameColor:'lightblue',
          backgroundColor: program.color || '#4477c9'
        }
      });

      fs.writeFileSync(outputFilePath, svg);
      console.log('ERD written to',outputFilePath);
    }
  } catch (e) {
    console.log(e)
    throw e;
  }
}
//////////////////////
main();
