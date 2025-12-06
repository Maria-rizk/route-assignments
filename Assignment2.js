const path = require("node:path");
//1
function file(){
    const dir = __dirname;
    const file =__filename;
    
    console.log(`{file: ${file} , Dir: ${dir} }`);
    
}
file()
//2
function getFileName(filePath) {
  return filePath.split('/').pop();
}
console.log(getFileName("/user/files/report.pdf")); 
//3
function buildpath(obj){
    return path.join(obj.dir, obj.name + obj.ext);
}
console.log(buildpath({ dir: "/folder", name: "app", ext: ".js"}))
//4
function fileext(filePath){
    return path.extname(filePath)
}
console.log(fileext("/docs/readme.md"))
//5
/*function pathname(filePath){
    const filename = fileNameWithExt.substring(0, lastDotIndex)
    const pathext = path.extname(filePath)
    console.log(`{name: ${filename} , ext: ${pathext}}`);
    
}
pathname("/home/app/main.js")
*/
//6
function isAbsolutePath(path) {
  return path.startsWith('/');
}
console.log(isAbsolutePath("/home/user/file.txt"));
//7 
function joinPaths(...segments) {
  return segments.join('/');
}
console.log(joinPaths("src", "components", "App.js"));
//8
function addtopath(partpath){
    const url = "/home/user/project/src"
    if(partpath.startsWith("/")){
        return url  + partpath
    }
    let cleanPath = partpath;
  if (cleanPath.startsWith('./')) {
    cleanPath = cleanPath.substring(2);
  }
  return url + '/' + cleanPath;
}
console.log(addtopath("./index.js"))
//9
function joinTwoPaths(path1, path2) {
  // Remove trailing slash from path1 and leading slash from path2 to avoid //
  const cleanPath1 = path1.replace(/\/$/, '');
  const cleanPath2 = path2.replace(/^\//, '');
  
  return cleanPath1 + '/' + cleanPath2;
}
console.log(joinTwoPaths("/folder1", "folder2/file.txt"))
//10 
const fs = require('node:fs');

async function deleteFile(filePath) {
  try {
    await fs.unlink(filePath);
    console.log(`The ${filePath.split('/').pop()} is deleted.`);
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
  }
}deleteFile("D:\\route assigments\\file.txt")
//11

// function createFolderSync(folderPath) {
//   try {
//     fs.mkdirSync(folderPath, { recursive: true });
//     return "Success";
//   } catch (error) {
//     throw new Error(`Failed to create folder: ${error.message}`);
//   }
// }
// console.log(createFolderSync("/tmp/my-new-folder"));

//12
const {EventEmitter} = require("node:events");
const event = new EventEmitter();

event.on("start", () => {
    console.log("Welcome event triggered!")
})
event.emit("start")
//13
event.on("login", (username) => {
    console.log(`user logged in: ${username}`);
    
})
event.emit("login", "maria")
//14
const filepath = path.resolve("./notes.txt");
fs.readFileSync(filepath , 'utf-8' , (error ,data) =>{
    if(error){
        return console.log(error);
        
    }
    console.log(`the file content =>"${data}"`);
})
//15
fs.writeFile(filepath, '@@@wertyu' , {flag:"a"}, (error) =>{
    if(error){
        return console.log(error);
        
    }
    return console.log("Async save");
})
//16 
function directoryExists(path) {
  try {
    const stats = fs.statSync(path);
    return stats.isDirectory();
  } catch (error) {
    return false; 
  }
}
  console.log(directoryExists("./notes.txt")); 
//17
const os = require('os');

function getSystemInfo() {
  return {
    Platform: os.platform(),
    Arch: os.arch()
  };
}
console.log(getSystemInfo());