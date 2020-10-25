const notify = require('./notifications');

const handleError = (error) => {
    notify.error('There was a problem!');

    if(error.response.status){
        notify.error(error.response.status);
    }

    if(error.response.statusText){
        notify.error(error.response.statusText);
    }

    if(error.response.data){
        console.log(error.response.data);
    }
};

module.exports = {
    handleError,
};