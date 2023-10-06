require('dotenv').config();
const {createReadStream} = require('fs');
const{createWriteStream} = require('fs');
const readline = require('readline');

let linecount = 0;
let colNames=[];

let {uniqueattrib,ldifEntry,mappings} = require('./data');

const reader = createReadStream(process.env.CSVNAMELOC,{encoding:'utf-8',highWaterMark: 2048});
const writer = createWriteStream(process.env.LDIFNAMELOC); 
const rline = readline.createInterface(reader);

rline.on('line', (line) =>{
    if (linecount == 0){
        colNames = extractColumnNames(line);
        //console.log(colNames);
    }
    else{
        createRecord(colNames, line); 
    }    
 //   console.log(`Line ${linecount} --${line}`);
    linecount++;
})
.on('close',  () =>{
    console.log(`created ${linecount} records`);
})
.on('error', (err)=> {
    console.log(err.stack)
    rline.close();
    reader.close();
    writer.close();

});

writer.write("version: 1 \n");

//below extractColumnNames uses object deconstructing. 
// We swap the mappings property with its values. 
//This will ensure no code changes are needed as long as mappings are created correctly.

function extractColumnNames(data){
    const cols = extractColumns(data) 
    //get column names from csv
    let ind = 0;
    const propNames = Object.keys(mappings);    //get the property names in the mappings object
    while (ind < cols.length){
        let  attrib = cols[ind]                 
        attrib = attrib.toLowerCase();          //convert all the csv col names to small case
//        console.log(attrib);                
       
        if (propNames.includes(attrib)){        //check if mappings data has any of the csv col names
//            console.log("replacing")
            const{[attrib]:value} = mappings;   //internally replace csv col names with the mapping names as they are the values from ldif
            cols[ind] = value;
//            console.log(cols[ind]);
        }
        ind ++;
    }
    return cols;
}
function createRecord(cols, data){
    const rowdata = extractColumns(data)
    const rec = mapEntries(cols, rowdata);
    addRectoLdif(rec);
}
    

function extractColumns(data){
    cols = data.split(',');
 //   console.log(cols);
    return cols;
}

function mapEntries(colname, data){
    const rec = new Map();
//    console.log("columns"+colname);
//    console.log("values "+data);
    let index = 0;
    while (index < data.length)
    { 
        if(data[index]!=""){                        //skip null attributes
            rec.set(colname[index],data[index])    
        }
        index ++;
    }
 //   console.log (rec); 
    return rec; 
}
function addRectoLdif(rec){
    writer.write("\r\n");
    writer.write(`dn: ${uniqueattrib}=${rec.get(uniqueattrib)},${ldifEntry.dn}\n`); //whatever is the unique attrib, th edn will be crafted from it 
    let index = 0; 
    while (index < ldifEntry.objectclass.length){
        writer.write(`objectclass:${ldifEntry.objectclass[index]}\n`);
        index ++;        
    }

    for (const [key, value] of rec) {
        writer.write(`${key}: ${value}\n`);
    }
    writer.write("\r\n");
}

