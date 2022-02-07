let card = document.getElementById("card")

const AMPLITUDE_X = 22
const AMPLITUDE_Y = 18

let canHover = true
window.addEventListener("mousemove", e=>{
  if(!canHover) return

  card.style.transition = "none"

  const x = e.clientX
  const y = e.clientY
 
  const nx = (x/(window.innerWidth/2) - 1) * AMPLITUDE_X
  const ny = (y/(window.innerHeight/2) - 1) * AMPLITUDE_Y
  card.style.transform = `rotateY(${nx}deg) rotateX(${ny}deg)`
})


card.addEventListener("click", function(){
  if(!canHover) {
    this.style.transform = "rotateY(360deg)"
    setTimeout(()=>{
      canHover = true
    },350)
  } else {
    this.style.transform = "rotateY(180deg)"
    canHover = false
  }
  this.style.transition = ".3s transform"
})
