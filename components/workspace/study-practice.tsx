"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import { flashcards, quizQuestions } from "./demo-data";
import type { PracticeQuestion, StudyCard } from "./practice-data";
import "./study-practice.css";

export function FlashcardResource({cards=flashcards}:{cards?:StudyCard[]}={}) {
  const [queue,setQueue]=useState(()=>cards.map((_,index)=>index));
  const [revealed,setRevealed]=useState(false);
  const [reviewed,setReviewed]=useState(0);
  const current=queue[0];
  const learned=cards.length-queue.length;
  function reset(){setQueue(cards.map((_,index)=>index));setRevealed(false);setReviewed(0);}
  function rate(known:boolean){if(!revealed)return;setQueue(previous=>known?previous.slice(1):[...previous.slice(1),previous[0]]);setRevealed(false);setReviewed(previous=>previous+1);}
  if(!cards.length)return <p className="study-unavailable">No flashcards are available for this document.</p>;
  if(!queue.length)return <section className="study-complete" aria-label="Flashcard review complete"><span className="study-complete-icon"><Check size={22}/></span><h3>All {cards.length} cards reviewed.</h3><p>{reviewed} reviews in this session.</p><button className="study-primary" onClick={reset}><RotateCcw size={14}/>Review again</button></section>;
  return <section className="study-review" aria-label="Flashcard review" onKeyDown={event=>{if(event.key==="1"&&revealed){event.preventDefault();rate(false);}if(event.key==="2"&&revealed){event.preventDefault();rate(true);}}}>
    <div className="study-progress-heading"><span>{queue.length} remaining</span><span>{learned} of {cards.length} learned</span></div>
    <div className="study-progress-track" role="progressbar" aria-label="Cards learned" aria-valuemin={0} aria-valuemax={cards.length} aria-valuenow={learned}><span style={{width:`${learned/cards.length*100}%`}}/></div>
    <button className={`study-flashcard ${revealed?"is-revealed":""}`} aria-label={revealed?"Show question":"Reveal answer"} aria-expanded={revealed} onClick={()=>setRevealed(!revealed)}>
      <span className="study-card-top"><span>Card {current+1} / {cards.length}</span><span>{revealed?"Answer":"Question"}</span></span>
      <span className="study-card-question">{cards[current].question}</span>
      {revealed&&<span className="study-card-answer">{cards[current].answer}</span>}
      {!revealed&&<span className="study-reveal-hint">Reveal answer<ArrowRight size={15}/></span>}
    </button>
    <div className="study-rating-row">{revealed?<><button className="study-secondary" onClick={()=>rate(false)}><RotateCcw size={14}/>Review again<kbd>1</kbd></button><button className="study-primary" onClick={()=>rate(true)}><Check size={14}/>Got it<kbd>2</kbd></button></>:<button className="study-primary study-wide" onClick={()=>setRevealed(true)}>Show answer<ArrowRight size={15}/></button>}</div>
    <p className="study-review-help">{revealed?"Cards marked “Review again” return to the end of the deck.":"Try answering from memory before you reveal it."}</p>
  </section>;
}

export function QuizResource({questions=quizQuestions}:{questions?:PracticeQuestion[]}={}) {
  const [index,setIndex]=useState(0);
  const [choice,setChoice]=useState<number|null>(null);
  const [checked,setChecked]=useState(false);
  const [answers,setAnswers]=useState<number[]>([]);
  const [complete,setComplete]=useState(false);
  const [review,setReview]=useState(false);
  const question=questions[index];
  const score=answers.filter((answer,i)=>answer===questions[i].answer).length;
  function reset(){setIndex(0);setChoice(null);setChecked(false);setAnswers([]);setComplete(false);setReview(false);}
  if(!questions.length)return <p className="study-unavailable">No questions are available for this document.</p>;
  if(complete)return <section className="study-complete quiz-complete"><span className="study-score">{score}<small>/ {questions.length}</small></span><h3>{score===questions.length?"You’ve got this covered.":"Your review is complete."}</h3><p>{score} correct answers out of {questions.length}.</p><div className="study-complete-actions"><button className="study-secondary" onClick={()=>setReview(!review)}>{review?"Hide answers":"Review answers"}</button><button className="study-primary" onClick={reset}><RotateCcw size={14}/>Try again</button></div>{review&&<div className="study-answer-review">{questions.map((item,i)=><details key={i}><summary><span className={answers[i]===item.answer?"is-correct":"is-wrong"}>{answers[i]===item.answer?<Check size={13}/>:i+1}</span>{item.question}</summary><p><b>Correct answer</b>{item.options[item.answer]}</p>{answers[i]!==item.answer&&<p><b>Your answer</b>{item.options[answers[i]]}</p>}<p>{item.explanation}</p></details>)}</div>}</section>;
  return <section className="study-quiz" aria-label="Document quiz">
    <div className="study-progress-heading"><span>Question {index+1} of {questions.length}</span><span>{Math.round(index/questions.length*100)}% complete</span></div>
    <div className="study-progress-track" role="progressbar" aria-label="Quiz progress" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={index}><span style={{width:`${index/questions.length*100}%`}}/></div>
    <h3 className="study-quiz-question">{question.question}</h3>
    <div className="study-quiz-options" role="radiogroup" aria-label="Answer choices" onKeyDown={event=>{if(checked)return;const keys=["ArrowDown","ArrowUp","Home","End"];if(!keys.includes(event.key))return;event.preventDefault();const next=event.key==="Home"?0:event.key==="End"?question.options.length-1:((choice??-1)+(event.key==="ArrowDown"?1:-1)+question.options.length)%question.options.length;setChoice(next);event.currentTarget.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();}}>{question.options.map((option,i)=><button key={i} type="button" role="radio" aria-checked={choice===i} disabled={checked} className={`${choice===i?"is-selected":""} ${checked&&i===question.answer?"is-correct":""} ${checked&&choice===i&&i!==question.answer?"is-wrong":""}`} onClick={()=>setChoice(i)}><span className="study-option-letter">{String.fromCharCode(65+i)}</span><span>{option}</span>{checked&&i===question.answer&&<Check size={15}/>}</button>)}</div>
    {checked&&<div className={`study-answer-feedback ${choice===question.answer?"is-correct":"is-wrong"}`} role="status"><b>{choice===question.answer?"Correct":"Not quite"}</b><p>{question.explanation}</p></div>}
    <div className="study-quiz-footer">{!checked?<><span>Choose one answer.</span><button className="study-primary" disabled={choice===null} onClick={()=>{setChecked(true);setAnswers(previous=>[...previous,choice!]);}}>Check answer<ArrowRight size={14}/></button></>:<button className="study-primary study-wide" onClick={()=>{if(index===questions.length-1)setComplete(true);else{setIndex(index+1);setChoice(null);setChecked(false);}}}>{index===questions.length-1?"See results":"Next question"}<ArrowRight size={14}/></button>}</div>
  </section>;
}
