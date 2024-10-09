
const snackbar = new SnackBar("snackbar", 30000)

const getEntry = async (word) => {
    const url = new URL(`${config.apiBaseUrl}/definitions`);
    url.searchParams.append("word", word);
    const method = 'Get';

    try {
        const response = await fetch(url, { method: method });

        const result = await response.json();
        if (response.status != 200) {
            if (result.errorCode === 2) {
                throw new Error(result.message)
            }
            console.log("post failed with error " + response.status);
        }
        console.log(result)
        return result
    } catch (e) {
        throw e;
    }
}

const onSubmit = async (event) => {
    event.preventDefault()
    try {

        const word = document.getElementById('word').value;
        const response = await getEntry(word);
        snackbar.showSnackbar(response.message, false)
    } catch (e) {

        snackbar.showSnackbar(e.message, true)
    }
    console.log(response)
}
