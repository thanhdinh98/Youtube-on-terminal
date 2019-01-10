const {google} = require('googleapis');
const request = require('request-promise');
const {Parser} = require(`${__dirname}/youtubeParser`);
const Youtube = google.youtube({version: 'v3', auth: process.argv[2]});

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
                process.send({name: 'load', data: true});
                const response =  await Youtube.search.list(options);
                process.send({name: 'load', data: false});
                process.send({name: 'search', data: response.data.items});
            }catch(err){
                throw err;
            }
        }break;

        case 'play':{
            try{

                process.send({name: 'load', data: true});
                const url = await Parser(message.data);
                process.send({name: 'load', data: false});
                process.send({name: 'play', data: url})

            }catch(err){throw err;}

        }break;

        case 'info':{
            const options = {
                'id': message.data,
                'part': 'snippet, statistics'
            };

            try{
                process.send({name: 'load', data: true});
                const response = await Youtube.videos.list(options);
                process.send({name: 'load', data: false});
                process.send({name: 'info', data: response.data.items[0]});
            }catch(err){
                throw err;
            }
        }
    }
    
});