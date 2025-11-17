
let table;
let colonne = []

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

  console.log(colonne)


  new p5(sketch, 'map')
  new p5(sketch1, 'key')
}

let sketch = function(p){

  p.createContainerCanvas = function(container){
    let w = container.width;
    let h = container.height;
    let canvas = p.createCanvas(w, h);
    canvas.parent(container)
  }

  p.drawTag = function(px, py, textString){
    p.push()
    p.rectMode(p.CENTER)
    p.fill("#3b3b3bb7")
    p.noStroke()
    p.rect(px + 10, py - 10, 240, 30, 10)
    p.pop()
    p.push()
    p.textSize(16)
    p.textAlign(p.CENTER, p.CENTER)
    p.fill("white")
    p.stroke("white")
    p.text(textString, px +10, py - 10)
    p.pop()

  }

  p.setup = function(){
    let container = select('#map')
    p.createContainerCanvas(container)
  }

  let hovered;

  p.mousePressed = function(){
    
    let myUrl = "detail.html?VolcanoName=" + hovered.nome
    window.location.href = myUrl

  }

  p.draw = function(){
    p.clear()
    hovered = null;

    p.push();
    p.stroke(255, 60); 
    p.strokeWeight(1);
    let stepsX = p.width/10;
    let stepsY = p.height/10;
    for(let x = 0; x < p.width; x += stepsX){
      p.line(x, 0, x, p.height)
    }
    for(let y = 0; y < p.height; y += stepsY){
      p.line(0, y, p.width, y)
    }

    p.pop()



    for(let i = 0; i < colonne[4].length; i++){
     let x = p.map(colonne[5][i], p.min(...colonne[5]), p.max(...colonne[5]), p.width * 0.05, p.width * 0.95)
     let y = p.map(colonne[4][i], p.min(...colonne[4]), p.max(...colonne[4]), p.height * 0.95, p.height * 0.05);
    
      let nome = table.getString(i, "Volcano Name")
      let radius = 10
      let distance = p.dist(x, y, p.mouseX, p.mouseY)

      p.push()
      if(distance < radius / 2){
        hovered = {x: x, y: y, nome: nome};
        p.fill("#f54927");
      } 
      p.noStroke()
      p.push()
      

      if(colonne[6][i] > 0){
        p.translate(x, y)
        p.fill("#f5272771")
        p.triangle(-5, 5, 5, 5, 0, -5)
      }

      p.pop()

      p.push()

      if(colonne[6][i] < 0){
        p.translate(x, y)
        p.fill("#2773f571")
        p.rotate(p.PI)
        p.triangle(-5, 5, 5, 5, 0, -5)
      }

      

      p.pop()

      p.push()

      if(colonne[6][i] === 0){
        p.translate(x, y)
        p.fill("#ffffff71")
        p.circle(0, 0, 10)
      }

      

      p.pop()


      
      p.pop()

      
    }

    if(hovered){
        p.cursor("pointer")
        p.drawTag(hovered.x +10, hovered.y -10, hovered.nome)
      } else{
        cursor("default")
      }

  }



}

let sketch1 = function(p){

  p.createContainerCanvas = function(container){
    let w = container.width;
    let h = container.height;
    let canvas = p.createCanvas(w, h);
    canvas.parent(container)
  }

  p.setup = function(){
    let container = p.select('#key');
    p.createContainerCanvas(container)
  }

  p.draw = function(){
    p.clear()

    p.push()
    p.noStroke()
    p.fill("#f52727ff")
    p.translate(p.width*0.20, p.height/2)
    p.triangle(-10, 10, 10, 10, 0, -10)
    p.pop()
    p.push()
    p.translate(p.width*0.20, (p.height/2) + 30)
    p.fill("#3f3f3fff")
    p.textAlign(p.CENTER)
    p.text("Elevation > 0", 0, 0)
    p.pop()

    p.push()
    p.noStroke()
    p.fill("#ffffffff")
    p.translate(p.width/2, p.height/2)
    p.circle(0, 0, 20)
    p.pop()
    p.push()
    p.translate(p.width/2, (p.height/2) + 30)
    p.fill("#3f3f3fff")
    p.textAlign(p.CENTER)
    p.text("Elevation = 0", 0, 0)
    p.pop()

    p.push()
    p.noStroke()
    p.fill("#2773f5ff")
    p.translate(p.width*0.80, p.height/2)
    p.rotate(p.PI)
    p.triangle(-10, 10, 10, 10, 0, -10)
    p.pop()
    p.push()
    p.translate(p.width*0.80, (p.height/2) + 30)
    p.fill("#3f3f3fff")
    p.textAlign(p.CENTER)
    p.text("Elevation < 0", 0, 0)
    p.pop()
    
  }

}

