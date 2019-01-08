const Gui = (blessed, screen)=>{

    function SearchBox(){
        return blessed.textbox({
            parent: screen,
            width: '50%',
            height: '15%',
            border: 'line',
            label: 'Search',
            inputOnFocus: true
        });
    }

    function ResultBox(){
        return blessed.list({
            parent: screen,
            width: '60%',
            height: '50%',
            top: '15%',
            border: 'line',
            label: 'Search Results',
            keys: true,
            style:{
                item:{
                    hover:{
                        bg: 'blue'
                    }
                },
                selected:{
                    bg: 'blue',
                    bold: true
                }
            },
            scrollbar: {
                ch: ' ',
                track: {
                  bg: 'cyan'
                },
                style: {
                  inverse: true
                }
            }
        });
    }

    function VideoInfoBox(){
        return blessed.box({
            parent: screen,
            width: '40%',
            height: '50%',
            border: 'line',
            right: 0,
            label: 'Video Info',
            top: '15%'
        });
    }

    return {
        SearchBox,
        ResultBox,
        VideoInfoBox
    }
}

const ScreenHandle = (screen, components)=>{
    screen.key('C-c', (ch, key)=>{
        process.exit(0);
    });
    
    screen.key('s', (ch, key)=>{
        components['searchBox'].focus();
    });
    
    screen.key('f', (ch, key)=>{
        components['listBox'].focus();
    });

    screen.key('c', (ch, key)=>{
        components['listBox'].clearItems();
    });
}

module.exports.Gui = Gui;
module.exports.ScreenHandle = ScreenHandle;