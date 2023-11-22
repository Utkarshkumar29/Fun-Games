/* 
Create a player
Shoot projectiles
Create Enemies
Detect Collision on enemy/projectile hit
Detect Collision on enemy/player hit
Remove projectiles which are out of bound
Colorize game
Shrink enemies on hit
Create particle explosion on hit
Add score
Add game over UI
Add restart button
Add start game button
*/

const canvas=document.querySelector('canvas');

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

const c=canvas.getContext('2d');

const upscore=document.querySelector('#update');

const begin=document.querySelector('#game');

const hide=document.querySelector('#hide');

const final=document.querySelector('#final')

class Player
{
    constructor(x,y,radius,color)
    {
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
    }

    draw()
    {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        c.fillStyle=this.color;
        c.fill();
    }
    
}

class projectile
{
    constructor(x,y,radius,color,velocity)
    {
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
    }

    draw()
    {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        c.fillStyle=this.color;
        c.fill();
    }

    update()
    {
        this.draw();
        this.x=this.x+this.velocity.x*7;
        this.y=this.y+this.velocity.y*7;
    }
}

function randcolor()
{
    var temp = "1234567890ABCEDF";
    var str = "#";
    for (var i = 0; i <= Math.floor(Math.random() * 16); i++) {
        str += temp[i];
    }
    return str;
}


class enemy
{
    constructor(x,y,radius,color,velocity)
    {
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
    }

    draw()
    {
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        c.fillStyle=this.color;
        c.fill();
    }

    update()
    {
        this.draw();
        this.x=this.x+this.velocity.x*3;
        this.y=this.y+this.velocity.y*3;
    }
}

let enemyarray=[];
let particles=[];
const friction=0.95;
class particle
{
    constructor(x,y,radius,color,velocity)
    {
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.color=color;
        this.velocity=velocity;
        //additional property for fading 
        this.alpha=1;
    }

    draw()
    {
        c.save(); //provide global function
        c.globalAlpha=this.alpha;
        c.beginPath();
        c.arc(this.x,this.y,this.radius,0,Math.PI*2,false)
        c.fillStyle=this.color;
        c.fill();
        c.restore();
    }

    update()
    {
        this.draw();
        this.velocity.x*=friction;
        this.velocity.y*=friction;
        this.alpha-=0.01;
        this.x=this.x+this.velocity.x*5;
        this.y=this.y+this.velocity.y*5;
    }
}

function init()
{
    setInterval(()=>
    {
        const radius=Math.random()*(30-4)+4;
        let x,y;
        if(Math.random()<0.5)
        {
            x=Math.random()<0.5? 0-radius:canvas.width+radius;
            y=Math.random()*canvas.height;
        }
        else
        {
            y=Math.random()<0.5? 0-radius:canvas.width+radius;
            x=Math.random()*canvas.height;
        }
        const color=`hsl(${Math.random()*360},50%,50%)`;
        const angle=Math.atan2(canvas.height/2-y,canvas.width/2-x);

        const velocity=
        {
            x:Math.cos(angle),
            y:Math.sin(angle)
        }

        enemyarray.push(new enemy(x,y,radius,color,velocity))
    },1000)
}


const x=canvas.width/2;
const y=canvas.height/2;
let player1=new Player(x,y,10,'white')
player1.draw();

let projectiles=[];

let score=0;

let restart
function animate()
{
    //end game
    restart=requestAnimationFrame(animate);

    c.fillStyle='rgba(0,0,0,0.1)'
    c.fillRect(0,0,innerWidth,innerHeight);
    player1.draw();
    projectiles.forEach((projectile,projectileindex)=>
    {
        projectile.update();
        if(projectile.x+projectile.radius<0 || projectile.x-projectile.radius>canvas.width || projectile.y+projectile.radius<0 || projectile.y-projectile.radius>canvas.height)
        {
            setTimeout(()=>
                {
                    projectiles.splice(projectileindex,1);
                },0)
        }
    })

    particles.forEach((particle,index1)=>
        {
            if(particle.alpha<=0)
            {
                particles.splice(index1,1)
            }
            else
            {
                particle.update();
            }
        })

    enemyarray.forEach((enemy,index)=>
    {
        enemy.update();
        const dist=Math.hypot(player1.x-enemy.x,player1.y-enemy.y);
        //end game
        if(dist-enemy.radius-player1.radius<1)
        {
            cancelAnimationFrame(restart);
            hide.style.display='flex';
            final.innerHTML=score;
        }

        
        projectiles.forEach((projectile,projectileindex)=>
        {
            const dist=Math.hypot(projectile.x-enemy.x,projectile.y-enemy.y)
            //when projectile touch enemies
            if(dist-projectile.radius-enemy.radius<1)
            {

                //increasing score
                score+=100;
                upscore.innerHTML=score;

                //creating explosions
                for(var i=0; i<enemy.radius*2; i++)
                {
                    particles.push(new particle(projectile.x,projectile.y,Math.random()*2,enemy.color,{
                        x:(Math.random()-0.5)*(Math.random()*2),
                        y:(Math.random()-0.5)*(Math.random()*2)
                    }))
                }
                if(enemy.radius-10>5)
                {
                    gsap.to(enemy,{
                        radius:enemy.radius-10
                    })
                    setTimeout(()=>
                    {
                        projectiles.splice(projectileindex,1);
                    },0)
                }
                else
                {
                    setTimeout(()=>
                    {
                        enemyarray.splice(index,1);
                        projectiles.splice(projectileindex,1);
                    },0)
                }
            }
        })      
        
    })


}


addEventListener('click',function(event)
{
    const angle=Math.atan2(event.clientY-canvas.height/2,event.clientX-canvas.width/2);

    const velocity=
    {
        x:Math.cos(angle),
        y:Math.sin(angle)
    }

    projectiles.push(new projectile(canvas.width/2,canvas.height/2,5,'pink',velocity));
})

begin.addEventListener('click',()=>
{
    re();
    animate();
    init();
    hide.style.display='none'
})

function re()
{
    player1=new Player(x,y,10,'white');
    projectiles=[];
    enemyarray=[];
    particles=[];
    score=0;
    upscore.innerHTML=score;
}