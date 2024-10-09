const snackbar = new SnackBar("snackbar", 30000)

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
        if (response.status != 201) {
            if (result.errorCode === 1) {
                snackbar.showSnackbar(result.message, true);
            }
            console.log("post failed with error " + response.status);
        } else {
            snackbar.showSnackbar(result.message, false);
        }
    } catch (e) {
        console.error('Error: ', e);
    }
}

const onSubmit = async (event) => {
    event.preventDefault();
    const word = document.getElementById('word').value;
    const definition = document.getElementById('definition').value;

    await postEntry(word, definition);
}
