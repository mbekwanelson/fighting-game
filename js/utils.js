function determineWinner({player, enemy, timerId}){

	clearTimeout(timerId)
	document.querySelector('#displaytext').style.display = 'flex'
	if(player.health === enemy.health)
	{
		document.querySelector('#displaytext').innerHTML = 'T   I   E'	
	}else if(player.health > enemy.health)
	{
		document.querySelector('#displaytext').innerHTML = 'P L A Y E R   1   W I N S'
	}else if(player.health < enemy.health){
		document.querySelector('#displaytext').innerHTML = 'P L A Y E R   2   W I N S'
	}
}

// T I M E R
let timer = 60
let timerId
function decreaseTimer(){

	if(timer > 0){
	  timerId = setTimeout(decreaseTimer,1000)
	  timer--	
	  document.querySelector('#timer').innerHTML = timer
	}

	if(timer === 0){
		determineWinner({player,enemy,timerId});	
	}		
}


function rectangularCollision({rectangle1, rectangle2}){

	return (
	 rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x && 
	  rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
	  rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && 
	  rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
	)
}