var AddEmpl = document.querySelector('.btn1'); // Select button correctly
var BackDrop = document.querySelector('.modal-backdrop'); // Select backdrop
var modal = document.querySelector('.modal'); // Select modal
var cancelButton = document.querySelector('#cancel-button'); // Select Cancel button
var closeButton = document.querySelector('#close-btn'); // Select Close (×) button

function showModal() {
    BackDrop.style.display = 'block';
    modal.style.display = 'block';
}

function closeModal() {
    BackDrop.style.display = 'none';
    modal.style.display = 'none';
}

if (AddEmpl) {
    AddEmpl.onclick = showModal;
}

if (cancelButton) {
    cancelButton.onclick = closeModal;
}

if (closeButton) {
    closeButton.onclick = closeModal;
}

if (BackDrop) {
    BackDrop.onclick = closeModal; // Clicking outside modal closes it
}
