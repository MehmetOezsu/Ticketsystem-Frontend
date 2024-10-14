let backendurl = "";
let accessToken = "";

const template = document.createElement("template")
template.innerHTML = `
<form id="iu-correct-form">
    <label for="title">Titel</label>
    <input type="text" name="title" id="title" required/>

    <label for="assignedModuleId">Kurs</label>
    <input type="text" name="assignedModuleId" id="assignedModuleId" value="ISEF01" required/>
    
    <label for="category">Kategorie</label>
    <select type="text" name="category" id="category" required>
        <option disabled selected value> -- Wähle einen Wert! -- </option>
        <option value="AUDIO">Fehler bei der Tonwiedergabe</option>
        <option value="MISSING_SOURCE">Fehlende Quellenangabe</option>
    </select>


    <label for="ticketSource">Material</label>
    <select type="text" name="ticketSource" id="ticketSource" required>
        <option disabled selected value> -- Wähle einen Wert! -- </option>
        <option value="EXERCISE">Übungsaufgaben</option>
        <option value="SCRIPT">Skript</option>
        <option value="IULEARN">IU-Learn App</option>
        <option value="VIDEO">Videos</option>
    </select>

    <label for="description">Beschreibung</label>
    <textarea type="text" name="description" id="description" required></textarea>

    <button type="submit">Ticket erstellen</button>
    </form>
    
    <dialog id="feedback">
        <article>
            <header>
            <p>
                <strong id="feedback-headline"></strong>
            </p>
            </header>
            <p id="feedback-message"></p>
            <button aria-label="Close" rel="prev" id="feedback-close">Schließen</button>
        </article>
    </dialog>
`

const css = document.createElement("template")
css.innerHTML = `
<style>
select, input, textarea,form button{
display: block;
width:100%;
padding:0.2rem;
margin: 0;
height: 2rem;
font-size: 100%;
}

textarea {
resize: vertical;
height:5rem;
}

form label{
    margin-top: 1rem;
    display: inline-block;
    font-size: 1.3rem;
}

form button {
    margin-top: 1rem;
}

input, textarea{
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
}

</style>`

class TicketForm extends HTMLElement{
    static observedAttributes = ["backendurl", "accesstoken"];

    constructor(){
        super()
        const shadow = this.attachShadow({ mode: "open"})
        shadow.append(template.content.cloneNode(true))
        shadow.append(css.content.cloneNode(true))

        this.form = shadow.getElementById("iu-correct-form");
        this.form.addEventListener("submit",this.handleSubmit.bind(this));
        this.closeModal = shadow.getElementById("feedback-close");
        this.closeModal.addEventListener("click",this.closeFeedback.bind(this))
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch(name){
            case "backendurl": 
                backendurl = newValue;
                return;
            case "accesstoken":
                accessToken = newValue;
                return;
        }
    }

    showMessage(title, message){
        this.shadowRoot.getElementById("feedback-headline").innerText=title;
        this.shadowRoot.getElementById("feedback-message").innerText=message;
        this.shadowRoot.getElementById("feedback").showModal();
    }

    closeFeedback(event){
        this.shadowRoot.getElementById("feedback").close();
    }
       

    handleSubmit(event){
        const data = new FormData(event.target);
        const newTicket = Object.fromEntries(data.entries());

        newTicket.status = "ACTIVE";

        fetch(backendurl+"/tickets", {
        method: "POST",
        headers: {Authorization: 'Bearer ' +  accessToken},
        body: JSON.stringify(newTicket)})
        .then(response => response.json())
        .then(data => {
            if(data.id){
                this.showMessage("Vielen Dank für das Einreichen deines Tickets!","Dein Ticket wurde eingereicht und wird unter der TicketID " + data.id + " bearbeitet!");
            }else{
                this.showMessage("Es ist ein Fehler bei der Anlage des Tickets aufgetreten.", data.error);
            } 
        })
        .catch(error => {
            this.showMessage("Es ist ein Fehler bei der Anlage des Tickets aufgetreten.",error.message);
        });
    
        //event.target.reset();   
        event.preventDefault();
    }
}
customElements.define("ticket-form",TicketForm)
