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

        if (!response.ok) {
            throw new Error('POST request failed');
        }

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
    const content = JSON.parse(response.message)
    showSnackbar(content)
}

function showSnackbar(content) {
    let snackbar = document.getElementById("snackbar");

    // snackbar.innerHTML = LocalizationHelper.getTranslation(config.messages.storeUserMessage, [content.word, content.definition])
    snackbar.innerHTML = `${content.word} was written to the dictionary with the defininion: ${content.definition}`

    snackbar.className = "show";

    setTimeout(function() {
        snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
}
