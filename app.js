const start=document.getElementById('go');
start.addEventListener('click', startgame);

const next= document.getElementById('next');
next.addEventListener('click', gonext);

const back= document.getElementById('back');
back.addEventListener('click', goback);

const queCont=document.getElementById('quizbox');
const queEle= document.getElementById('que');
const ansEle= document.getElementById('options');
const nav=document.getElementById('navbar');

var currentque , shuffledque, correctcounter, time;

function startgame(){
    document.getElementById('tinfo').style.display='block';
    document.getElementById('timer').style.display='block';
    document.body.style.background='black';
    //console.log('quiz startd')
    document.getElementById('instructions').style.display='none';
    queCont.style.display='block';
    currentque = 0;
    correctcounter=0;
    time=150;

    //shuffle the questins
    shuffledque =  shuffle(questions);

    function shuffle(questions){
        let ctr= questions.length;
        let temp;
        let index;

        while(ctr >1){
            index=Math.floor(Math.random()*ctr);
            ctr--;
            temp=questions[ctr];
            questions[ctr]= questions[index];
            questions[index]=temp;
        }
        return questions;
    };
    setnext();
    starttimer();
    navque();
    
};

function navque() {
    let button = "";
    questions.forEach((ques, index) => {
       button += `<button class="navq" onclick="gotoQues(${index})" style="background-color:rgb(3, 97, 114);;
       color:whitesmoke;
       padding:3px;
       font-family:'Segoe UI';
       border:0;
       border-radius:4px;
       cursor:pointer;
       font-size:18px;" >${index + 1}</button>`;
    });
    questionsnav.innerHTML = button;
  };


function starttimer(){
    time--;
    if(time<150){
        document.getElementById('timer').innerHTML=time;
    }
    if(time<11){
        document.getElementById('timer').style.color='red';
        document.getElementById('timer').style.fontSize='45px';
        
    }
    if(time<1){
        window.clearInterval(update);
        back.style.display='none';
        next.style.display='none';
        document.getElementById('tinfo').style.display='none';
        document.getElementById('questionsnav').style.display='none';
        document.getElementById('timer').style.display='none';
        document.getElementById('results').style.display='block';
        document.getElementById('info').style.display='block';
        document.getElementById('info').innerHTML='Oops! You ran out of time :(';
        document.getElementById('results').addEventListener('click',()=>{
            clearstatus(document.body);
            document.body.style.background='url(bg2.jpg)';
            document.getElementById('score').style.display='block';
            document.getElementById('info').style.display='none';
            document.getElementById('results').innerHTML='';
            queCont.style.display='none';
            document.getElementById('marks').innerHTML=Math.floor(correctcounter/2);
            document.getElementById('again').addEventListener('click',()=>{
                location.reload();
            })
        })    
    }
}

update = setInterval('starttimer()', 1000);

function gonext(){
    currentque++;
    resetquizbox();
    shownext(shuffledque[currentque]);
    
};

function goback(){
    resetquizbox();
    currentque--;
    if(currentque>=0){
        shownext(shuffledque[currentque]);
    }  
};

function gotoQues(number) {
    resetquizbox();
    currentque = number;
    shownext(shuffledque[currentque]);
  };

function setnext(){
    resetquizbox();
    shownext(shuffledque[currentque]);
}

function shownext(que){
    if(currentque > 0){
        back.style.display='block';
    }
    document.getElementsByClassName('no')[0].innerHTML='Question ' + (currentque +1) + '  of 10';
    queEle.innerText=que.que;
    que.ans.forEach( ans =>{
        const button =document.createElement('button');
        button.innerText= ans.text;
        button.classList.add('btn')
        if(ans.iscorrect){
            button.dataset.iscorrect = ans.iscorrect;
        };
        button.addEventListener('click', selectnext);
        ansEle.appendChild(button);
    });
};

function setstatus(element, iscorrect) {
    clearstatus(element)
    if(iscorrect){
        correctcounter++;
        element.classList.add('correct')
        
    }else{
        element.classList.add('wrong');
    }
    changenavcolor();
};

function changenavcolor(){
    document.getElementsByClassName('navq')[currentque].style.background="grey";
}

function clearstatus(element){
    element.classList.remove('correct');
    element.classList.remove('wrong');
};


function selectnext(e){
    const selectcorrectans = e.target;
    const iscorrect = selectcorrectans.dataset.iscorrect;

    Array.from(ansEle.children).forEach(button =>{
        setstatus(button, button.dataset.iscorrect)
    });
    //stop at last que
    if(shuffledque.length > currentque +1 ){
        next.style.visibility='visible';
    }else{
        window.clearInterval(update);
        back.style.display='none';
        next.style.display='none';
        document.getElementById('questionsnav').style.display='none';
        document.getElementById('tinfo').style.display='none';
        document.getElementById('timer').style.display='none';
        document.getElementById('results').style.display='block';
        document.getElementById('info').style.display='block';
        document.getElementById('results').addEventListener('click',()=>{
           show();
            clearstatus(document.body);
            document.body.style.background='url(bg2.jpg)';
            document.getElementById('score').style.display='block';
            document.getElementById('info').style.display='none';
            document.getElementById('results').innerHTML='';
            queCont.style.display='none';
            document.getElementById('marks').innerHTML=correctcounter;
            document.getElementById('again').addEventListener('click',()=>{
                location.reload();
            })
        })    
    }
};
function show(){
    var name= document.getElementById('name').value;
    document.getElementById('infos').innerHTML= name + ", Here's your score!";

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    var d = new Date(),
        h = (d.getHours()<10?'0':'') + d.getHours(),
        m = (d.getMinutes()<10?'0':'') + d.getMinutes();
    let t = h + ':' + m;
    let thisScore = [{username : name, score : Math.floor(correctcounter/2), date : today, time : t}];
    let storedScores = JSON.parse(localStorage.getItem("quizScores"));
    if(storedScores == null){
        storedScores = thisScore;
    }else{
        storedScores.push(thisScore[0]);
    }
    localStorage.setItem("quizScores", JSON.stringify(storedScores));
    if(storedScores != null){
        storedScores.sort((a, b) => (a.score < b.score) ? 1: -1);
        let scoresToDisplay = 5;
        if(storedScores.length < 5){
            scoresToDisplay = storedScores.length;
        }
        for(let i = 0; i < scoresToDisplay; i++){
            var s = storedScores[i];
            var p = document.createElement("p");
            p.textContent = s.score + " by " + s.username + " on " + s.date +  " at " + s.time;
        }
        document.getElementById('highscore').appendChild(p);
    }
};

function resetquizbox() {
    while (ansEle.firstChild){
        ansEle.removeChild(ansEle.firstChild);
    }
};


