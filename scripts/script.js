const card = document.getElementById('card')
const light = document.getElementById('light')

//Elements that will be filled by API data
const nameEl = document.getElementById('name')
const bioEl = document.getElementById('bio')
const signatureEl = document.getElementById('signature')

const AMPLITUDE_X = 22
const AMPLITUDE_Y = 14
const MEMBER_ID = 9
let canHover = true

renderCard()
window.addEventListener('mousemove', moveCard)
window.addEventListener('mouseout', onMouseOut)
card.addEventListener('click', clickCard)

function clickCard() {
  if(!canHover) {
    card.style.transform = 'rotateY(360deg)'
    setTimeout(()=>{
      card.style.transition = 'none'
      card.style.transform = 'rotateY(0deg)'
      setTimeout(() => {
        canHover = true
      },50);
    },625)
  } else {
    card.style.transform = 'rotateY(180deg)'
    canHover = false
  }
  card.style.transition = '.625s transform ease-out'
}

function onMouseOut() {
  if(!canHover) return
  card.style.transition = '.3s transform ease-out'
  card.style.transform = 'none'
}

function moveCard(e) {
  if(!canHover) return

  card.style.transition = 'none'

  const x = e.clientX
  const y = e.clientY
 
  const nx = (x/(window.innerWidth/2) - 1) * AMPLITUDE_X
  const ny = ((y/(window.innerHeight/2) - 1) * AMPLITUDE_Y) * -1

  const lx = (x/window.innerWidth) * 100
  const ly = (y/window.innerHeight) * 100
  
  light.style.setProperty('--lx', lx + '%')
  light.style.setProperty('--ly', ly + '%')
  card.style.transform = `rotateY(${nx}deg) rotateX(${ny}deg)`
}

async function getStudentData(memberId) {
  try {
    const req = await fetch('https://tribe.api.fdnd.nl/v1/member')
    const res = await req.json()
    const student = res.data.find(student=>{
      return student.memberId == memberId
    })
    return student
  } catch(err) {
    setError()
    throw new Error(err)
  }
}

async function renderCard() {
  const {bio, name, surname, githubHandle} = await getStudentData(MEMBER_ID)
  nameEl.innerText = `${name} ${surname}`
  bioEl.innerText = bio
  signatureEl.innerText = githubHandle
}

function setError() {
  const errEl = document.createElement('section')
  errEl.classList.add('error')
  errEl.insertAdjacentHTML('beforeend', `
    <div>
    </div>
    <div>
      <h3>API Error</h3>
      <p>Failed to fetch.</p>
    </div>
  `)
  setTimeout(()=>{
    errEl.classList.add("hide")
  },6000)
  document.body.appendChild(errEl)
}