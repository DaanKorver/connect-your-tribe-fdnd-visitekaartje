const card = document.getElementById("card")

//Elements that will be filled by API data
const nameEl = document.getElementById("name")
const bioEl = document.getElementById("bio")

const AMPLITUDE_X = 22
const AMPLITUDE_Y = 14
const MEMBER_ID = 9
let canHover = true

fillCard()
window.addEventListener("mousemove", onMouseMove)
window.addEventListener("mouseout", onMouseOut)
card.addEventListener("click", onClick)

function onClick() {
  if(!canHover) {
    card.style.transform = "rotateY(360deg)"
    setTimeout(()=>{
      card.style.transition = "none"
      card.style.transform = "rotateY(0deg)"
      setTimeout(() => {
        canHover = true
      },50);
    },625)
  } else {
    card.style.transform = "rotateY(180deg)"
    canHover = false
  }
  card.style.transition = ".625s transform ease-out"
}

function onMouseOut() {
  if(!canHover) return
  card.style.transition = ".3s transform ease-out"
  card.style.transform = "none"
}

function onMouseMove(e) {
  if(!canHover) return

  card.style.transition = "none"

  const x = e.clientX
  const y = e.clientY
 
  const nx = (x/(window.innerWidth/2) - 1) * AMPLITUDE_X
  const ny = ((y/(window.innerHeight/2) - 1) * AMPLITUDE_Y) * -1
  card.style.transform = `rotateY(${nx}deg) rotateX(${ny}deg)`
}

async function getStudentData(memberId) {
  const req = await fetch("https://tribe.api.fdnd.nl/v1/member")
  const res = await req.json()
  const student = res.data.find(student=>{
    return student.memberId == memberId
  })
  return student
}

async function fillCard() {
  const {bio, name, surname} = await getStudentData(MEMBER_ID)
  nameEl.innerText = `${name} ${surname}`
  bioEl.innerText = bio
}