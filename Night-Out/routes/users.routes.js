const attach = (app) =>{
    app.get('/users/', (req, res)=>{
        res.send();
    });
};

module.exports = attach;
