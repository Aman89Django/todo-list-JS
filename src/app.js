import './styles.css';
import {createModal, isValid} from "./utils";
import {Question} from './question';
import {authWithEmailAndPassword, getAuthForm} from "./auth";


const form = document.getElementById('form');
const input = form.querySelector('#question-input');
const submitBtn = form.querySelector('#submit');
const modalBtn = document.getElementById('modal-btn')
const list = document.getElementById('list');


window.addEventListener('load', Question.renderList);
form.addEventListener('submit', submitFormHandler);
input.addEventListener('input', () => {
    submitBtn.disabled = !isValid(input.value)
});
modalBtn.addEventListener('click', openModal)


function submitFormHandler(event) {
    event.preventDefault();
    if (isValid(input.value)) {
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        }

        submitBtn.disabled = true;
        ///   Async request to server to save
        Question.create(question).then(() => {
            input.value = '';
            input.className = '';
            submitBtn.disabled = false;
        })
    }
}

function openModal() {
    createModal('Authorization', getAuthForm());

    document
        .getElementById('auth-form')
        .addEventListener('submit', authFormHandler, {once:true})
};

function authFormHandler(event) {
    event.preventDefault();

    const btn = event.target.querySelector('button');
    const email = event.target.querySelector('#email').value;
    const password = event.target.querySelector('#password').value;

    btn.disabled = true;
    authWithEmailAndPassword(email, password)
        .then(token =>{
           return Question.fetch(token)
        })
        .then(renderModalAfterAuth)
        .then(()=> btn.disabled=false)
}

function renderModalAfterAuth(content) {
    if(typeof content === 'string') {
        createModal('Error', content)
    }
    else{
        createModal('List questions', Question.listToHTML(content))
    }
}



