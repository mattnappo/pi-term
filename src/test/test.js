let promise1 = new Promise((resolve, reject) => {
    let dataReceivedSuccessfully = false;
    
    if (dataReceivedSuccessfully) {
        resolve('Data Available!');
    }

    if (!dataReceivedSuccessfully) {
        reject('Data Corrupted!');
    }
});


promise1.then((message) => {
    return message;
}).catch((message) => {
    return message;
});
