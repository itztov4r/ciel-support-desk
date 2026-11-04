const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function harness(){
 const elements=new Map();const element=()=>({value:'',textContent:'',hidden:false,children:[],append(...c){this.children.push(...c)},replaceChildren(){this.children=[]},setAttribute(){},addEventListener(){},setCustomValidity(){},focus(){},reset(){},close(){this.closed=true},showModal(){this.open=true}});
 const get=id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id)};
 const context={document:{getElementById:get,createElement:element},localStorage:{getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}},crypto:{randomUUID:()=> 'session-ticket'},setTimeout,Blob,URL};
 vm.runInNewContext(fs.readFileSync(require.resolve('../script.js'),'utf8'),context);return {get,context};
}
test('blocked storage still permits creating and viewing session tickets with warning',()=>{
 const {get}=harness();get('title').value='Session example';get('asset').value='PC-TEST';get('category').value='Matériel';get('priority').value='Normale';get('status').value='Nouveau';
 get('ticket-form').onsubmit({preventDefault(){},target:{reportValidity(){}}});
 assert.equal(get('total').textContent,1);assert.equal(get('rows').children.length,1);assert.match(get('feedback').textContent,/stockage plein ou bloqué/);assert.equal(get('editor').closed,true);
});
test('example tickets remain idempotent without persistent storage',()=>{
 const {get}=harness();get('demo').onclick();get('demo').onclick();assert.equal(get('total').textContent,3);assert.equal(get('urgent').textContent,1);
});
