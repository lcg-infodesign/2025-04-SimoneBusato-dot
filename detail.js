
let table;
let colonne = []
let parameters;
let select;
let z_selected;

function preload() {
  table = loadTable("assets/volcanoes.csv", "csv", "header")
}

function setup() {

  for(let i = 0; i < table.getColumnCount(); i++){
    colonne[i]=table.getColumn(i)
  }

  colonne[0] = colonne[0].map(v => float(v));
  colonne[4] = colonne[4].map(v => float(v));
  colonne[5] = colonne[5].map(v => float(v));
  colonne[6] = colonne[6].map(v => {
    if (v == null) return NaN;
    let s = String(v).trim()
      .replace(/,/g, '.')
      .replace(/[^\d.\-eE+]/g, '');
    let num = parseFloat(s);
    return isNaN(num) ? 0 : num; // usa 0 se non valido
});

  //tutta questa sezione di codice è stata utilizzata per poter usare le assi z. 
  //nei numeri vi erano caratteri invisibili che non permettevano la conversione da stringhe a numero.
  //dopo tanti tentativi, questo è stato il metodo che, grazie all'IA, mi ha portato a risolvere la cosa.

  parameters = getURLParams();
  let volcanoName = decodeURIComponent(parameters.VolcanoName);
  select = table.findRows(volcanoName, "Volcano Name")[0];
  z_selected = parseFloat(select.get("Elevation (m)"))
  //console.log(colonne)


  new p5(sketch, 'map')
  new p5(sketch1, 'submap')
  new p5(sketch2, 'description')
}

let sketch = function(p){

  let camZ = 800;
  let camY = 0;
  let camX = 0;
  let xTarget, yTarget, zTarget;
  let sphereX = p.width / 200;
  let sphereY = p.height / 200
  let sphereZ = 15
  let offset;
  let zooming = true;
  let minElev, maxElev;
  

  p.createContainerCanvas = function(container){
    let w = container.width;
    let h = container.height;
    let canvas = p.createCanvas(w, h, p.WEBGL);
    canvas.parent(container)
  }

  p.setup = function(){
    let container = p.select('#map')
    p.createContainerCanvas(container)
    offset = p.createVector(0, 110, 50)
    xTarget = sphereX + offset.x
    yTarget = sphereY + offset.y
    zTarget = sphereZ + offset.z
    
  }

  p.draw = function(){
    p.clear()

    if(zooming){
      camX = p.lerp(camX, xTarget, 0.05)
      camY = p.lerp(camY, yTarget, 0.05)
      camZ = p.lerp(camZ, zTarget, 0.05)
      p.camera(camX, camY, camZ, sphereX, sphereY, sphereZ, 0, 1, 0)
    } else {
      camZ = p.lerp(camZ, 800, 0.05);
      camY = p.lerp(camY, 0, 0.05);
      camX = p.lerp(camX, 0, 0.05);
      p.camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
    }

    p.orbitControl()

p.push();
p.stroke(255, 60); 
p.strokeWeight(1);

let size = p.width * 0.9;
let step = size / 10; 
let half = size / 2;


for (let x = -half; x <= half; x += step) {
  p.line(x, -half, 0, x, half, 0);
}
for (let y = -half; y <= half; y += step) {
  p.line(-half, y, 0, half, y, 0);
}

p.pop();

    p.push();

    p.translate(sphereX, sphereY, sphereZ);
    p.noStroke();
    
    p.push()
    if(z_selected > 0){
      p.fill("#f5272771")
      p.rotateX(p.HALF_PI)
      p.cone(10);
    }
    p.pop()

    p.push()
    if(z_selected < 0){
      p.fill("#2773f571")
      p.rotateX(-p.HALF_PI)
      p.cone(10);
    }
    p.pop()

    p.push()
    if(z_selected === 0){
      p.fill("#ffffff71")
      p.sphere(10);
    }
    p.pop()





    p.pop();

  }

}

let sketch1 = function(p){
  let camZ = 800;
  let camY = 0;
  let camX = 0;
  let xTarget, yTarget, zTarget;
  let sphereX = p.width / 64;
  let sphereY = p.height / 64
  let sphereZ = 15
  let offset;
  let zooming = true;
  let minLat, maxLat, minLon, maxLon, minElev, maxElev;
  p.createContainerCanvas = function (container) {
    let w = container.width;
    let h = container.height;
    let canvas = p.createCanvas(w, h, p.WEBGL);
    canvas.parent(container);
  };

  p.setup = function(){
    let container = p.select('#submap');
    p.createContainerCanvas(container);

    offset = p.createVector(0, 110, 50)
    xTarget = sphereX + offset.x
    yTarget = sphereY + offset.y
    zTarget = sphereZ + offset.z
    minLat = Math.min(...colonne[4]);
    maxLat = Math.max(...colonne[4]);
    minLon = Math.min(...colonne[5]);
    maxLon = Math.max(...colonne[5]);
    minElev = Math.min(...colonne[6]);
    maxElev = Math.max(...colonne[6]);
  };

  p.draw = function(){
   p.clear()

   if(zooming){
      camX = p.lerp(camX, xTarget, 0.05)
      camY = p.lerp(camY, yTarget, 0.05)
      camZ = p.lerp(camZ, zTarget, 0.05)
      p.camera(camX, camY, camZ, sphereX, sphereY, sphereZ, 0, 1, 0)
    } else {
      camZ = p.lerp(camZ, 800, 0.05);
      camY = p.lerp(camY, 0, 0.05);
      camX = p.lerp(camX, 0, 0.05);
      p.camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);
    }


    for(let i = 0; i < colonne[4].length; i++){

      x = p.map(colonne[5][i], minLon, maxLon, -p.width/2, p.width/2)
      y = p.map(colonne[4][i], minLat, maxLat, p.height/2, -p.height/2)
      elevation = p.map(colonne[6][i], minElev, maxElev, -1, 1)
      let z = 15


     if(elevation > 0){
         p.push();
         p.translate(x,  y, z);
         p.noStroke();
         p.rotateX(p.HALF_PI)
         p.fill("#f5272771")
         p.cone(10);
         p.pop();
     }

     if(elevation < 0){
         p.push();
         p.translate(x,  y, z);
         p.noStroke();
         p.rotateX(-p.HALF_PI)
         p.fill("#2773f571")
         p.cone(10);
         p.pop();
     }


    

    }
  }
};

let sketch2 = function(p){

  p.createContainerCanvas = function (container) {
    let w = container.width;
    let h = container.height;
    let canvas = p.createCanvas(w, h);
    canvas.parent(container);
  }

  let dimension = [
        "Volcano Name",
        "Country",
        "Location",
        "Latitude",
        "Longitude",
        "Elevation (m)",
        "Type",
        "TypeCategory",
        "Status",
       "Last Known Eruption"
    ]

    let typeInfo = [];

    let backBtn = p.select('#back')

  

  p.setup =function(){
    let container = p.select('#description')
    p.createContainerCanvas(container)

   

    for(let i = 0; i < dimension.length; i++){
      let dim = dimension[i];
      let value = select.get(dim);
      typeInfo.push(`${dim}: ${value}`);

    }
    backBtn.mousePressed(()=> { 
    
    let myUrl = "index.html"
    window.location.href = myUrl

  }) 
  }

  

  p.draw = function(){
    p.clear()
    
    p.push()
    p.textAlign(p.LEFT, p.TOP)
    p.textSize(20);
    p.fill(0);
    let x = 20;
    let y = 20;
    let lineHeight = 30;

    for(let i = 0; i < typeInfo.length; i++){
      p.text(typeInfo[i], x, y + i * lineHeight)
      
    }
    p.pop()

  }

  

}
