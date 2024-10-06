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
        console.log('Success', result);
    } catch (e) {
        console.error('Error: ', e);
    }
}

const onSubmit = async () => {
    const word = document.getElementById('word').value;
    const definition = document.getElementById('definition').value;

    await postEntry(word, definition);
}