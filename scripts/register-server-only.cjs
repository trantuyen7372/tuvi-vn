const Module=require('node:module'),load=Module._load;
Module._load=function(name,...args){return name==='server-only'?{}:load.call(this,name,...args);};
