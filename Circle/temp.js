const canvas=document.querySelector('canvas');

const c=canvas.getContext('2d');

class player
{
    constructor(x,y)
    {
        this.x=x;
        this.y=y;


        draw()
        {
            c.beginPath()
            c.rect(this.x,this.y)
            c.stroke()
        }

        update()
        {

        }
    }
}

const obj=new player(45,54)
;