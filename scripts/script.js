const card = document.getElementById('card')
const light = document.getElementById('light')
const preloader = document.getElementById('preloader')

//Elements that will be filled by API data
const nameEl = document.getElementById('name')
const bioEl = document.getElementById('bio')
const signatureEl = document.getElementById('signature')

const AMPLITUDE_X = 22
const AMPLITUDE_Y = 14
const MEMBER_ID = 9
let canHover = false

renderCard()
window.addEventListener('mousemove', moveCard)
window.addEventListener('mouseout', onMouseOut)
card.addEventListener('click', clickCard)
preloader.style.setProperty('--opacity', '1')

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
    setState('error')
    throw new Error(err)
  }
}

async function renderCard() {
  const {bio, name, surname, githubHandle} = await getStudentData(MEMBER_ID)
  setState('loaded')
  nameEl.innerText = `${name} ${surname}`
  bioEl.innerText = bio
  signatureEl.innerText = githubHandle
}

function setState(state) {
  setTimeout(()=>{
    switch(state) {
      case 'loaded':
        setLoaded()
      break;
      case 'error':
        setError('API Error', 'Failed to fetch the API.')
      break;
    }
    hidePreloader()
  },1200)
}

function setLoaded() {
  setTimeout(()=>{
    card.style.transition = "1s transform cubic-bezier(0.215, 0.610, 0.355, 1)"
    card.style.transform = "scale(1) rotateX(0deg) rotateY(0deg)"
    setTimeout(()=>{
      canHover = true
    }, 1000)
  }, 400)
}

function setError(title, body) {
  const errEl = document.createElement('section')
  errEl.classList.add('error')
  errEl.insertAdjacentHTML('beforeend',
  `
  <img src="./assets/error.gif" alt="Dog floating, failed to fetch" />
  <div>
    <h3>${title}</h3>
    <p>${body}</p>
  </div>
  `)
  document.body.appendChild(errEl)
}

function hidePreloader() {
  preloader.style.setProperty('--opacity', '0')
  preloader.style.setProperty('--scale', '.9')
  setTimeout(()=>{
    document.body.removeChild(preloader)
  },400)
}