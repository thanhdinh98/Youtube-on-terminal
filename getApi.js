const {google} = require('googleapis');
const request = require('request-promise');
const Youtube = google.youtube({version: 'v3', auth: 'AIzaSyAeTt9KhY7dd8OmCDikWsFaUGA8a0hsrCI'});

process.on('message', async (message)=>{

    switch (message.name){
        case 'search':{
            const options = {
                'maxResults': '25',
                'part': 'snippet',
                'q': message.data,
                'type': 'video'
            }
        
            try{
                const response =  await Youtube.search.list(options);
                process.send({name: 'search', data: response.data.items});
            }catch(err){
                throw err;
            }
        }break;

        case 'play':{
            const options = {
                uri: `https://you-link.herokuapp.com/?url=https://www.youtube.com/watch?v=${message.data}`,
                json: true
            };

            try{
                const response = await request(options);
                process.send({name: 'play', data: response[0].url});    
            }catch(err){
                throw err;
            }
        }break;

        case 'info':{
            const options = {
                'id': message.data,
                'part': 'snippet, statistics'
            };

            try{
                const response = await Youtube.videos.list(options);
                process.send({name: 'info', data: response.data.items[0]});
            }catch(err){
                throw err;
            }
        }
    }
    
});