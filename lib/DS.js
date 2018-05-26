const underlineText = str => `<U> ${str} </U>`
const boldText=str=>`<B> ${str} </B>`;


class ERD {
  constructor(name) {
    this.name = name;
    this.nodes = [];
    this.relations=[];
  }
  addRelation(collection1,collection2,collection1Config,collection2Config){
    let relationString=''
   if(collection1Config.isUnique){
     relationString+=collection1Config.required?'many':'0';

   }
   else{
     relationString+=collection1Config.required?'1':'0';

   }
   relationString+=' -to- many';
   this.relations.push(`${collection2}:${collection2Config.foreignField} -> ${collection1}:${collection1Config.localField.index}  [label="${collection2}-${collection1}" arrowhead=none shape="none" taillabel = "${relationString}"]`)
  }
  addCollection(node) {
    this.nodes.push(node);
  }
  generate() {

      return `
        digraph {
        splines=true; esep=1;
        graph [margin="0" pad="2", nodesep="2", ranksep="2"];
        node [shape=record]
        edge [style=dashed];
        rankdir=LR;
        ${this.nodes.map(node=>node.generate()).join('\n')}

        ${this.relations.join('\n')}
        }
        `


  }
}

class Collection {

  constructor(name,options) {
    this.name = name;
    this.fields = [];
    this.options={bgcolor:'#c1b37c'};
    if(options.bgcolor){
      this.options.bgcolor=options.bgcolor;
    }
  }

  addField(name, options) {
    this.fields.push({
      name,
      options
    })
  }
  generate() {
    const fieldsString = [];

    for (const field of this.fields) {
      let nameString = field.name;
      let options=field.options;
      let fieldString=nameString;
      if(options.type){
        fieldString+=' ['+options.type+']';
      }
      fieldsString.push(fieldString);
    }
    return `

  ${this.name} [shape="none" margin=0 label=<<table BGCOLOR="${this.options.bgcolor}" border="0" CELLPADDING="0" cellspacing="0" cellborder="1">
  <tr><td cellpadding="3"><i>${boldText(this.name)}</i></td></tr>
      ${fieldsString.map((field,i)=>'<tr><td port="'+i+'">'+field+'</td></tr>').join('\n\t')}

  </table>>]
  `
  }



}




module.exports={ERD,Collection};
