const blessed = require('blessed');
const {fork, spawn} = require('child_process');
const {Gui, ScreenHandle} = require('./gui');
const getApi = fork('./getApi.js', [], {silent: true});

const screen = blessed.screen({
    smartCSR: true,
    title: 'Youtube Search'
});

const searchBox = Gui(blessed, screen).SearchBox();
const listBox = Gui(blessed, screen).ResultBox()
const videoInfoBox = Gui(blessed, screen).VideoInfoBox()

ScreenHandle(screen, {searchBox, listBox});

let vid = null;

// Handle Api

getApi.on('message', (message)=>{

    switch(message.name){
        case 'search':{
            const items = message.data.map((item, i)=>{
                return `https://www.youtube.com/watch?v=${item.id.videoId}`
            });
            listBox.clearItems();
            listBox.setItems(items);
            screen.render();
        }break;

        case 'play':{
            if(message.data !== undefined){
                spawn('npm', ['start', '--', message.data]);
            }else{
                console.log(message.data);
            }
        }break;

        case 'info':{
            const {statistics, snippet} = message.data;
            const {viewCount, likeCount, dislikeCount} = statistics;
            const {title, channelTitle} = snippet;
            videoInfoBox.setContent('');
            videoInfoBox.insertTop([
                `Title: ${title}`,
                `Channel title: ${channelTitle}`,
                `Views: ${viewCount}`,
                `Likes: ${likeCount}`,
                `Dislikes: ${dislikeCount}`
            ]);
            screen.render();
        }
    }
    
});

getApi.stderr.on('data', (err)=>{
    console.log('Api error: ' + err);
});


// ListBox events

listBox.on('select', (item)=>{
    if(item !== undefined){
        const videoId = item.getText().split('=')[1];
        vid = videoId;
        getApi.send({name: 'info', data: videoId});
    }
});

listBox.key('esc', (ch, key)=>{
    listBox.blur();
});

listBox.key('p', (ch, key)=>{
    if(vid !== null){
        getApi.send({name: 'play', data: vid});
    }
});

// SearchBox events

searchBox.on('submit', (searchString)=>{
    getApi.send({name: 'search', data: searchString});
});

searchBox.key('esc', (ch, key)=>{
    searchBox.blur();
});

searchBox.key('enter', (ch, key)=>{
    searchBox.submit();
    searchBox.clearValue();
    screen.render();
});


// Render Gui
screen.render();
