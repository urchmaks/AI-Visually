
window.onload=function(){
  
  tf.loadLayersModel('pet_model/model.json').then(function(model) {
  window.model = model;});
let result = document.getElementById("result");
const canvas = document.getElementById("output");
const ctx = canvas.getContext("2d");

let spin = document.getElementById("spin");

let image = new Image();


  const fileSelector = document.getElementById('file-selector');
  fileSelector.addEventListener('change', (event) => {
    
    ctx.clearRect(0, 0, 128, 128);
    spin.classList.add('spinner-border', 'text-primary', 'm-3');
    const fileList = event.target.files;
    console.log(fileList[0].size);
    const url = URL.createObjectURL(fileList[0]);
    console.log(url);
    image.src = url;
    image.addEventListener("load", () => {
    ctx.drawImage(image, 0, 0, 128, 128);
    const imageData = ctx.getImageData(0, 0, 128, 128).data;
    spin.classList.remove('spinner-border', 'text-primary', 'm-3');

    console.log(imageData.length);
    let input = [];
    for(let i = 0; i < imageData.length; i+=4){
      input.push(imageData[i+0]/255, imageData[i+1]/255, imageData[i+2]/255);
    }
    console.log(input);
    let x = tf.tensor(input).reshape([1, 128, 128, 3]);
    console.log(x);
    window.model.predict([tf.tensor(input).reshape([1, 128, 128, 3])]).array().then(function(scores){
      scores = scores[0];
      predicted = scores.indexOf(Math.max(...scores));
      console.log(scores);
      if(scores[0] < scores[1]){
        result.innerHTML = "Это собака!";
        console.log("Dog");
      } 
      if(scores[0] > scores[1]) {
        result.innerHTML = "Это кошка!";
        console.log("Cat");
      }
    });
});

});

}

