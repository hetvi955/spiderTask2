const start=document.getElementById('go');
start.addEventListener('click', startgame);

const next= document.getElementById('next');
next.addEventListener('click', gonext);

const back= document.getElementById('back');
back.addEventListener('click', goback);

const queCont=document.getElementById('quizbox');
const queEle= document.getElementById('que');
const ansEle= document.getElementById('options');

var arr=[]
var currentque , shuffledque, correctcounter;

function startgame(){
    document.body.style.background='black';
    //console.log('quiz startd')
    document.getElementById('instructions').style.display='none';
    queCont.style.display='block';
    currentque = 0;
    correctcounter=0;

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
    
}
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
        if(arr.includes(currentque)){
            correctcounter++;
            element.classList.add('correct')
        }
    }else{
        element.classList.add('wrong');
    }
};

function clearstatus(element){
    element.classList.remove('correct');
    element.classList.remove('wrong');
};


function selectnext(e){
    arr.push(currentque);
    const selectcorrectans = e.target;
    const iscorrect = selectcorrectans.dataset.iscorrect;

    Array.from(ansEle.children).forEach(button =>{
        setstatus(button, button.dataset.iscorrect)
    });
    //stop at last que
    if(shuffledque.length > currentque +1 ){
        next.style.visibility='visible';
    }else{
        back.style.display='none';
        next.style.display='none';
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
    document.getElementById('infos').innerHTML= name + ", Here's your score!"
}
function resetquizbox() {
    while (ansEle.firstChild){
        ansEle.removeChild(ansEle.firstChild);
    }
};


