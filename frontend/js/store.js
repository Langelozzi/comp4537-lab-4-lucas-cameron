const postEntry = async (word, definition) => {
    const url = `${config.apiBaseUrl}/definitions`;
    const method = 'POST';

    const requestBody = {};
    requestBody[word] = definition;

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const result = await response.json();
        return result
    } catch (e) {
        console.error('Error: ', e);
    }
}

const onSubmit = async () => {
    const word = document.getElementById('word').value;
    const definition = document.getElementById('definition').value;

    const response = await postEntry(word, definition);
    console.log('response', response);
    showMessage(response)
}

function showMessage(content) {
    let messageBox = document.getElementById("messageBox");

    let message;
    if (content.message) { // Error occured in the server
        message = content.message;
    } else {
        message = `"${content.word}" was written to the dictionary with the defininion: "${content.definition}"`;
    }

    messageBox.innerHTML = message;
}
