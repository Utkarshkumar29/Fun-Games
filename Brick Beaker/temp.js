const canvas=document.querySelector('canvas');

const c=canvas.getContext('2d');

canvas.width=600;
canvas.height=600;

var score=0;

const start=document.querySelector('#start');

const scr=document.querySelector('#score');

const final=document.querySelector('#final')

class player
{
    constructor(x,y)
    {
        this.x=x;
        this.y=y;
    }

    draw()
    {
        c.beginPath();
        c.rect(this.x,this.y,100,20);
        c.fillStyle='aqua';
        c.fill();
    }

    update(x)
    {
        this.x+=x;
        this.draw();
    }
}

let player1=new player(canvas.width/2-50,canvas.height-30);

//object
class circle
{
    constructor(x,y,radius,dx,dy)
    {
        this.x=x;   //position x
        this.y=y;   //position y
        this.dx=dx;  // velocity x
        this.dy=dy;   //velocity y
        this.radius=radius
    }

    draw()
    {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        c.fillStyle=' #000080';
        c.fill();
    }
    
    update()
    {
        
        if(this.x+this.radius>=canvas.width || this.x-this.radius<0)
        {
            this.dx=-this.dx;
        }
        if(this.y+this.radius>=canvas.height || this.y-this.radius<0)
        {
            this.dy=-this.dy;
        }
    
        this.x+=this.dx;
        this.y+=this.dy;
    
        this.draw();

        this.play=player1;

        let bottom=this.y+this.radius;
        let top=this.play.y;

        let left=this.play.x;
        let right=this.play.x+100;

        if(bottom>=top && this.x>=left && this.x+this.radius<=right)
        {
            this.dy=-this.dy;
            this.y=this.play.y-this.radius;
        }
    }

}

let enemies = [];
class enemy {
    constructor(x,y,color,width,height) {
        this.x = x;
        this.y = y;
        this.color=color;
        this.width=width;
        this.height=height;
    }

    draw() {
        c.beginPath();
        c.rect(this.x, this.y,this.width,this.height);
        c.fillStyle = this.color;
        c.fill();
    }
}


//creation
function add() {
    let height=15;
    let width=40;
    setInterval(() => {
        enemies.push(new enemy(Math.random()*600, Math.random()*300,randcolor(),width,height))
    }, 2000)
}

var radius=10
var x=canvas.width/2;
var y=500
var dx=-5;
var dy=-5;
let obj=new circle(x,y,radius,dx,dy)


//animation
let reset;
function animate()
{
    reset=requestAnimationFrame(animate);
    c.clearRect(0,0,innerWidth,innerHeight)

    enemies.forEach((enemy,eindex)=>
    {
        enemy.draw();
        const dist=Math.hypot(enemy.x-obj.x,enemy.y-obj.y);
        if(dist-obj.radius<10)
        {
            enemies.splice(eindex,1);
            score++;
            scr.innerHTML=score;
        }
    })


    obj.update();
    if(canvas.height-obj.y<11)
    {
        start.style.display='block';
        cancelAnimationFrame(reset);
        final.innerHTML=score;
    }

    player1.draw();

    var key;
    addEventListener('keypress',(event)=>
    {
        key=event.code
        if(key==='KeyS')
        {
            x=(0.1)*(0.5);
            player1.update(x);
        }
        if(key==='KeyA')
        {
            x=(-0.1)*(0.5);
            player1.update(x);
        }
    })
}


//for beauty
function randcolor()
{
    let temp='#';
    let str="1234567890ABCDEF";
    for(let i=0; i<6; i++)
    {
        temp+=str[Math.floor(Math.random()*16)];
    }
    return temp;
}


start.addEventListener('click',()=>
{
    add();
    animate();
    start.style.display='none';
    enemies=[];
    player1=new player(canvas.width/2-50,canvas.height-30);
    score=0;
    scr.innerHTML=score;
})