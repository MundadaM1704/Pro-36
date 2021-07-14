var dog, dogImg, dogImg1;
var database;
var food, foodS, foodStock, foodObj;
var fedTime, lastFed, feed, addFood;

function preload() {
  dogImg = loadImage("Images/dogImg.png");
  dogImg1 = loadImage("Images/dogImg1.png");
}

function setup() {
  database = firebase.database();

  createCanvas(1000,400);

  foodObj = new Food();

  foodStock = database.ref("Food");
  foodStock.on("value", readStock);

  dog = createSprite(800,200,150,150);
  dog.addImage(dogImg);
  dog.scale = 0.15;

  feed = createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,75);
  addFood.mousePressed(addFoods);
}

function draw() {
  background(46, 139, 87);

  fedTime = database.ref("FeedTime")
  fedTime.on("value",function(data){
    lastFed = data.val();
  })

  if (keyWentDown(UP_ARROW)) {
    writeStock(foodS);
    dog.addImage(dogImg1);
  }

  foodObj.display();
  drawSprites();

  fill(255, 255, 254);
  stroke("black");
  text("Food remaining : " + foodS, 170, 200);
  textSize(13);
  text("Note: Press UP_ARROW Key To Feed Drago Milk!", 130,10,300,20);

  if(lastFed >= 12){
    text("Last Feed: "+ lastFed%12 + "PM",350,30);
  }
  else if(lastFed == 0){
    text("Last Feed: 12 AM",350,30);
  }
  else{
     text("Last Feed: "+ lastFed + "AM",350,30);
  }
}

function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(dogImg);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref("/").update({
    Food: foodObj.getFoodStock(),
    feedTime: hour()
  });
}

function addFood(){
  foodS++;
  database.ref("/").update({
    Food: foodS,
  });
}