export class Question {
    static create(question) {
        return fetch('https://todo-list-aman.firebaseio.com/question.json', {
            method: "POST",
            body: JSON.stringify(question),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {
                question.id = response.name
                return question
            })
            .then(addToLocalStorage)
            .then(Question.renderList)
    }

    // to display an error when entering incorrect login&password
    static fetch(token) {
        if (!token) {
            return Promise.resolve(`<p class="error"> You don't have token </p>`)
        }
        return fetch(`https://todo-list-aman.firebaseio.com/question.json?auth=${token}`)
            .then(response => response.json())
            .then(response => {
                if (response && response.error) {
                    return `<p class="error"> ${response.error} </p>`
                }
                return response
                    ? Object.keys(response).map(key => ({
                        ...response[key],
                        id: key
                    }))
                    : []
            })
    }

    static listToHTML(questions) {
        return questions.length
            ? `<ol>${questions.map(q => `<li> ${q.text} </li>`).join('')}</ol>`
            :`<p>Not Questions</p>`
    }

    static renderList() {
        const questions = getQuestionsFromLocalStorage()

        const html = questions.length
            ? questions.map(toCard).join(' ')
            : `<div class="mui--text-headline"> Empty questions</div>`

        const list = document.getElementById('list')

        list.innerHTML = html
    }
}

function addToLocalStorage(question) {
    const all = getQuestionsFromLocalStorage();
    all.push(question);
    localStorage.setItem('questions', JSON.stringify(all))
};

function getQuestionsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('questions') || '[]')
}

function toCard(question) {
    return `
    <div class="mui--text-headline">
    ${new Date(question.date).toLocaleDateString()}
    ${new Date(question.date).toLocaleTimeString()}
    </div>
    <div>${question.text}</div>
    <br>`
};