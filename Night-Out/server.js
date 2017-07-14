const app = require('./server/app');
const browser = require('openurl');

require('./routes/server.routes')(app);
require('./routes/users.routes')(app);

app.listen(3001, () => console.log('Server running at: 3001'));
browser.open(`http://localhost:3001`);
