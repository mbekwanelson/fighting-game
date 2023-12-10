const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0,0,canvas.width,canvas.height)
const gravity = 0.7

const background = new Sprite({
	position : {
		x:0,
		y:0
	},
	imageSrc : './Assets/background.png'

})

const shop = new Sprite({
	position : {
		x:600,
		y:130
	},
	imageSrc : './Assets/shop.png',
	scale : 2.75,
	framesMax : 6
})



// initialise Players
const player = new Fighter({
	position : {
		x:0,
		y:0
	},
	velocity : {
		x:0,
		y:0
	},
	gravity : {
		x:0,
		y:0
	},
	offset : {
		x:0,
		y:0
	},
	imageSrc : './Assets/samuraiMack/Idle.png',
	scale: 2.5,
	framesMax : 8,
	offset : {
		x: 215,
		y: 157
	},
	sprites:{
		attack1 : {
			imageSrc : './Assets/samuraiMack/Attack1.png',
			framesMax : 6
		},
		attack2 : {
			imageSrc : './Assets/samuraiMack/Attack2.png',
			framesMax : 8
		},
		death : {
			imageSrc : './Assets/samuraiMack/Death.png',
			framesMax : 6
		},
		fall : {
			imageSrc : './Assets/samuraiMack/Fall.png',
			framesMax : 2
		},
		idle : {
			imageSrc : './Assets/samuraiMack/Idle.png',
			framesMax : 8
		},
		jump : {
			imageSrc : './Assets/samuraiMack/Jump.png',
			framesMax : 2
		},
		run : {
			imageSrc : './Assets/samuraiMack/Run.png',
			framesMax : 8
		},
		takeHit : {
			imageSrc : './Assets/samuraiMack/Take Hit - white silhouette.png',
			framesMax : 4
		},
		takeHitwsh : {
			imageSrc : './Assets/samuraiMack/Take Hit - white silhouette.png',
			framesMax : 4
		}
	},
	attackBox : {
		offset : {
			x: 100,
			y: 50
		},
		width : 160,
		height : 50
	}
})

const enemy = new Fighter({
	position : {
		x:400,
		y:10
	},
	velocity : {
		x:0,
		y:0
	},
	gravity :{
		x:0,
		y:0
	},
	imageSrc : './Assets/kenji/Idle.png',
	scale: 2.5,
	framesMax : 4,
	offset : {
		x: 215,
		y: 167
	},
	sprites:{
		attack1 : {
			imageSrc : './Assets/kenji/Attack1.png',
			framesMax : 4
		},
		attack2 : {
			imageSrc : './Assets/kenji/Attack2.png',
			framesMax : 4
		},
		death : {
			imageSrc : './Assets/kenji/Death.png',
			framesMax : 7
		},
		fall : {
			imageSrc : './Assets/kenji/Fall.png',
			framesMax : 2
		},
		idle : {
			imageSrc : './Assets/kenji/Idle.png',
			framesMax : 4
		},
		jump : {
			imageSrc : './Assets/kenji/Jump.png',
			framesMax : 2
		},
		run : {
			imageSrc : './Assets/kenji/Run.png',
			framesMax : 8
		},
		takeHit : {
			imageSrc : './Assets/kenji/Take Hit.png',
			framesMax : 3
		}
	},
	attackBox : {
		offset : {
			x: -170,
			y: 50
		},
		width : 170,
		height : 50
	}
})


const keys = {
	a:{
		pressed:false
	},
	d:{
		pressed:false
	},
	w:{
		pressed:false
	},
	ArrowLeft :{
		pressed:false
	},
	ArrowRight:{
		pressed:false
	},
	ArrowUp:{
		pressed:false
	}
}

decreaseTimer()

// G A M E   L O O P
function animate(){

	window.requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0,0,canvas.width,canvas.height)
	background.update()
	shop.update()
	c.fillStyle = 'rgba(255,255,255,0.2)'
	c.fillRect(0,0,canvas.width,canvas.height)

	player.update()
	enemy.update()

	player.velocity.x = 0
	enemy.velocity.x = 0

	// P L A Y E R   M O V E M E N T
	if(keys.a.pressed && player.lastKey === 'a'){
		player.velocity.x = -5
		player.switchSprite('run')
	}else if(keys.d.pressed && player.lastKey === 'd')
	{
		player.velocity.x = 5
		player.switchSprite('run')
	}
	else{
		player.switchSprite('idle')
	}

	// jump
	if(player.velocity.y < 0){
		player.switchSprite('jump')
	}
	else if(player.velocity.y > 0)
	{
		player.switchSprite('fall')
	}



	// ENEMY COLLISION
	if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
		enemy.velocity.x = -5
		enemy.switchSprite('run')
	}
	else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight')
	{
		enemy.velocity.x  = 5
		enemy.switchSprite('run')
	}else{
		enemy.switchSprite('idle')
	}


	if(enemy.velocity.y < 0){
		enemy.switchSprite('jump')
	}
	else if(enemy.velocity.y > 0)
	{
		enemy.switchSprite('fall')
	}


	//DETECT COLLISION
	if(	rectangularCollision({rectangle1 : player,rectangle2 : enemy}) &&
	  player.isAttacking &&
	  	player.framesCurrent === 4)
	{
		enemy.takeHit()
	  	player.isAttacking = false
	  	gsap.to('#enemyHealth',{
	  		width : enemy.health + '%'
	  	})
	}

	// player misses
	if(player.isAttacking && player.framesCurrent === 4 )
	{
		player.isAttacking = false	
	}

	if(	rectangularCollision({rectangle1 : enemy, rectangle2 : player}) &&
	  	enemy.isAttacking &&
	  	enemy.framesCurrent === 2)
	{
	  	enemy.isAttacking = false
		player.takeHit()
	  	gsap.to('#playerHealth',{
	  		width : player.health + '%'
	  	})
	}

	if(enemy.isAttacking && enemy.framesCurrent === 2 )
	{
		enemy.isAttacking = false	
	}

	// END GAME BASED ON HEALTH
	if(enemy.health <= 0 || player.health <= 0)
	{
		determineWinner({player,enemy,timerId});
	}

}





animate()



// Event Listeners
window.addEventListener('keydown',(event)=>
{
	if(!player.isDead){
		
		switch(event.key){
			case 'd':
				keys.d.pressed = true
				player.lastKey = 'd'
				break
			case 'a':
				keys.a.pressed = true
				player.lastKey = 'a'
				break
			case 'w':
				player.velocity.y = -20
				break
			case ' ':
				player.attack()
				break
		}
	}

	if(!enemy.isDead){
		switch(event.key){
			case 'ArrowRight':
				keys.ArrowRight.pressed = true
				enemy.lastKey = 'ArrowRight'
				break
			case 'ArrowLeft':
				keys.ArrowLeft.pressed = true
				enemy.lastKey = 'ArrowLeft'
				break
			case 'ArrowUp':
				enemy.velocity.y = -20
				break
			case 'ArrowDown':
				enemy.attack()
				break
		}
	}
})

window.addEventListener('keyup',(event)=>
{
	
	switch(event.key){
		case 'd':
			keys.d.pressed = false
			break
		case 'a':
			keys.a.pressed = false
			break
		case 'w':
			keys.w.pressed = false
			break
	}

	//enemy keys
	switch(event.key){
		case 'ArrowRight':
			keys.ArrowRight.pressed = false
			break
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false
			break
		
	}
})