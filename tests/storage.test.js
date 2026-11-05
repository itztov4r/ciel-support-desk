'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../script.js'),'utf8');

function boot(storageBlocked) {
  const nodes=new Map();
  function element() {
    return {
      textContent:'', value:'', hidden:false, children:[],
      classList:{add(){},remove(){},toggle(){}},
      append(...items){this.children.push(...items);},
      replaceChildren(...items){this.children=items;},
      setAttribute(){}, reset(){}, close(){}, showModal(){}, focus(){},
      setCustomValidity(){}, reportValidity(){return true;},
      addEventListener(){},
    };
  }
  const byId=id=>{
    if(!nodes.has(id))nodes.set(id,element());
    return nodes.get(id);
  };
  let saved=null;
  const localStorage={
    getItem(){if(storageBlocked)throw new Error('Storage disabled');return saved;},
    setItem(_key,value){if(storageBlocked)throw new Error('Storage full');saved=value;}
  };
  const document={getElementById:byId,createElement:element};
  vm.runInNewContext(source,{document,localStorage,Date,JSON,crypto:{randomUUID:()=> 'ticket-1'}},{filename:'script.js'});
  return {byId,getSaved:()=>saved};
}

test('example tickets are saved when localStorage works',()=>{
  const app=boot(false);
  app.byId('demo').onclick();
  assert.equal(app.byId('total').textContent,3);
  assert.equal(JSON.parse(app.getSaved()).length,3);
  assert.match(app.byId('feedback').textContent,/Exemples ajoutés/);
});

test('blocked localStorage still permits session edits and shows export warning',()=>{
  const app=boot(true);
  app.byId('demo').onclick();
  assert.equal(app.byId('total').textContent,3);
  assert.equal(app.getSaved(),null);
  assert.match(app.byId('feedback').textContent,/uniquement pendant cette session/i);
  assert.match(app.byId('feedback').textContent,/Exportez le CSV/);
});
