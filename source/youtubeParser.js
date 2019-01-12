const fetch = require('node-fetch');
const queryString = require('querystring');

const Parser = async (videoId)=>{
    try{
        const embedFileResponse = await fetch(`https://www.youtube.com/embed/${videoId}`, {mode: 'no-cors'});
        const embedFile = await embedFileResponse.text();
        const embedFileInfo = JSON.parse(`{
            ${/"js":.*\/base\.js"/.exec(embedFile)[0]},
            ${/"sts":[0-9]*/.exec(embedFile)[0]}
        }`);

        let metaDataResponse = await fetch(`https://www.youtube.com/get_video_info?video_id=${videoId}&sts=${embedFileInfo.sts}`, {mode: 'no-cors'});
        let metaData = await metaDataResponse.text();
        
        const metaDataJson = queryString.parse(metaData, null, null);
        let streamMap = null;

        if(metaDataJson.status === 'fail'){
            metaDataResponse = await fetch(`https://www.youtube.com/get_video_info?video_id=${videoId}&sts=${embedFileInfo.sts}&el=detailpage`, {mode: 'no-cors'});
            metaData = await metaDataResponse.text();
            streamMap = queryString.parse(
                queryString.parse(metaData, null, null).url_encoded_fmt_stream_map,
                null, null
            );  
        }else{
            streamMap = queryString.parse(
                metaDataJson.url_encoded_fmt_stream_map,
                null, null
            );
        }

        for(let url of streamMap.url){
            if(queryString.parse(url, null, null)['itag'] == '18'){
                const errPath = url.indexOf(',type=');
                return errPath !== -1 ? url.substring(0, errPath) : url;
            }
        }
        return null;
    }catch(err){throw err;}
}

module.exports.Parser = Parser;