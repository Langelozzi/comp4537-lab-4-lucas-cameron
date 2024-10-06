
const getEntry = async (word) => {
    const url = new URL(`${config.apiBaseUrl}/definitions`);
    url.searchParams.append("word", word);
    const method = 'Get';

    try {
        const response = await fetch(url, { method: method });

        if (!response.ok) {
            throw new Error('get request failed');
        }

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
}
