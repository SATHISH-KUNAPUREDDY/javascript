let players=[ {name:'subbu',color:"#4e2a4f ",score:0},{name: 'balaji',color:"#134e5e",score:0}, {name:'sathish',color:"#d76d77",score:0}, {name:'narasimha',color:"#5e4b43",score:0} ]
let h1_element =document.createElement("h1")

h1_element.textContent="Snake and ladder"
h1_element.classList="heading"
document.body.appendChild(h1_element)

let container= document.createElement("div")
container.classList="container"
document.body.appendChild(container)

for(let i=100;i>=1;i--){

    let div_ele=document.createElement("div")
    div_ele.classList="cell"
    div_ele.id=`cell${i}`
    div_ele.textContent=i 
    container.appendChild(div_ele)
   

}

for(let i=0;i<=3;i++){
    let btn=document.createElement("button")
    btn.textContent=players[i].name +" "+ players[i].score
    btn.style.backgroundColor=players[i].color
    btn.classList="btn"
    btn.onclick=function(){
        let randomNumber=Math.random()*6
        randomNumber=Math.ceil(randomNumber)
        let current_person =document.getElementById(`person${players[i].score}`) 
        if(current_person){
            current_person.parentNode.removeChild(current_person)
        }
     
     
        players[i].score=players[i].score+randomNumber
        btn.textContent=players[i].name +" "+ players[i].score
       


        let person=document.createElement("div")
        person.classList="person"
        person.id=`person${players[i].score}`
        person.style.backgroundColor=players[i].color
         let parentEle=document.getElementById(`cell${players[i].score}`)
         parentEle.appendChild(person)
        document.getElementById(`cell${players[i].score}`).style.backgroundColor=players[i].color
        document.getElementById(`cell${players[i].score}`).style.backgroundColor = players[i].color

    }
    document.body.appendChild(btn)
}