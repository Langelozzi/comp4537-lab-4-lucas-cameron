
const getEntry = async (word) => {
    const url = new URL(`${config.apiBaseUrl}/definitions`);
    url.searchParams.append("word", word);
    const method = 'Get';

    try {
        const response = await fetch(url, { method: method });

        const result = await response.json();
        console.log('Success', result);
        return result
    } catch (e) {
        console.error('Error: ', e);
    }
}

const onSubmit = async () => {
    const word = document.getElementById('word').value;
    const response = await getEntry(word);

    showMessage(response);
}

function showMessage(content) {
    let messageBox = document.getElementById("messageBox");

    let message;
    if (content.message) { // Error occured in the server
        message = content.message;
    } else {
        message = `"${content.word}": ${content.definition}`;
    }

    messageBox.innerHTML = message;
}
