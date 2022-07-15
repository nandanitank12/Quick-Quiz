const question=document.getElementById("question");
const choices=Array.from(document.getElementsByClassName("choice-text"));
const progressText=document.getElementById("progressText");
const progressBarFull=document.getElementById("progressBarFull");
const loader=document.getElementById("loader");
const game=document.getElementById("game");
const scoreText=document.getElementById("score");

let currentQuestion ={};
let accesptingAnswers =false;
let score =0;
let questionCounter= 0;
let availableQuestions =[];
let questions =[];
fetch("https://opentdb.com/api.php?amount=10&category=19&difficulty=medium&type=multiple")
.then(res=> {
   return res.json();
}).then(loadedQuestions=>{
   
    questions=loadedQuestions.results.map(loadedQuestions =>{
        const formattedQuestion = {
            question:loadedQuestions.question,
        };

        const answerChoices =[...loadedQuestions.incorrect_answers];
        formattedQuestion.answer=Math.floor(Math.random()*4)+1;
        answerChoices.splice(formattedQuestion.answer-1,0,loadedQuestions.correct_answer);

        answerChoices.forEach((choice,index)=>{
            formattedQuestion["choice"+(index+1)]=choice;
        });
        return formattedQuestion;
    });
    startgame();
}).catch(err=>{
    console.error(err);
})


const CORRECT_BONUS =10;
const MAX_QUESTIONS =3;

startgame=()=>
{
    questioncounter=0;
    score=0;
    availableQuestions= [...questions];
    console.log(availableQuestions);
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");


};

getNewQuestion =()=>
{
   if(availableQuestions.length===0 || questionCounter >=MAX_QUESTIONS)
   {localStorage.setItem("mostRecentScore",score);
     // console.log(score);
    return window.location.assign("/end.html");
   }
    questionCounter++;
    progressText.innerText= `Question ${questionCounter}/${MAX_QUESTIONS}`;
    progressBarFull.style.width=`${(questionCounter/MAX_QUESTIONS)*100}%`;

    const questionIndex=Math.floor(Math.random()*availableQuestions.length);
    currentQuestion=availableQuestions[questionIndex];
    question.innerText=currentQuestion.question;


    choices.forEach(choice =>{
        const number =choice.dataset["number"];
        choice.innerText=currentQuestion["choice"+number];
    });

    availableQuestions.splice(questionIndex,1);

    accesptingAnswers = true;
};
    choices.forEach((choice) =>{
    choice.addEventListener("click",(e)=>{
          if(!accesptingAnswers) return;

     accesptingAnswers=false;
     const selectedChoice= e.target;
     const selectedAnswer =selectedChoice.dataset["number"];
     
     const classToApply= selectedAnswer == currentQuestion.answer?'correct':'incorrect';
       console.log(classToApply);

       if(classToApply=='correct')
       {increasenumber(CORRECT_BONUS);}

       selectedChoice.parentElement.classList.add(classToApply);
       setTimeout(()=>{
        selectedChoice.parentElement.classList.remove(classToApply);
        getNewQuestion();
       },1000);
    });


});



increasenumber = num =>{
   score+=num;
   scoreText.innerText=score; 
}
